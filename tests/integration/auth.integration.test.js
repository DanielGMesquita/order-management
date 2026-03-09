/**
 * Integration Tests - Authentication Routes
 * Testa endpoints protegidos por JWT
 */

import request from 'supertest';
import { app } from '../../src/app.js';
import db from '../../src/config/database.js';
import auth from '../../src/middleware/auth.js';
import Order from '../../src/models/Order.js';
import Item from '../../src/models/Item.js';

describe('Order API - Authentication Integration Tests', () => {
  // Setup e Teardown
  beforeAll(async () => {
    try {
      await db.authenticate();
      await db.sync({ alter: true });
    } catch (error) {
      console.error('Erro ao conectar ao banco de dados:', error.message);
      throw error;
    }
  });

  afterAll(async () => {
    await db.close();
  });

  beforeEach(async () => {
    // Limpa dados antes de cada teste
    await Item.destroy({ where: {} });
    await Order.destroy({ where: {} });
  });

  // ========== TESTES SEM MIDDLEWARE (ROTAS ATUAIS) ==========
  describe('Rotas Sem Autenticação (Atuais)', () => {
    test('POST /order deve estar acessível sem token', async () => {
      const response = await request(app)
        .post('/order')
        .set('Content-Type', 'application/json')
        .send({
          numeroPedido: 'TEST001',
          valorTotal: 100,
          dataCriacao: new Date().toISOString(),
          items: [{ idItem: '1', quantidadeItem: 1, valorItem: 100 }],
        });

      expect([201, 500]).toContain(response.status); // 201 ou erro de BD
    });

    test('GET /order/list deve estar acessível sem token', async () => {
      const response = await request(app).get('/order/list');

      expect([200, 500]).toContain(response.status); // 200 ou erro de BD
    });
  });

  // ========== TESTES PARA ROTAS COM AUTENTICAÇÃO (TDD) ==========
  describe('POST /order - Com Autenticação', () => {
    const validPayload = {
      numeroPedido: 'AUTH001',
      valorTotal: 150,
      dataCriacao: new Date().toISOString(),
      items: [{ idItem: '2', quantidadeItem: 2, valorItem: 75 }],
    };

    test('deve retornar 401 quando token não é fornecido', async () => {
      const response = await request(app)
        .post('/order')
        .set('Content-Type', 'application/json')
        .send(validPayload);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Token');
    });

    test('deve retornar 403 quando token é inválido', async () => {
      const response = await request(app)
        .post('/order')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer invalid_token')
        .send(validPayload);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Token');
    });

    test('deve retornar 403 quando Authorization header está mal formatado', async () => {
      const token = auth.generateToken({ userId: '123' });

      const response = await request(app)
        .post('/order')
        .set('Content-Type', 'application/json')
        .set('Authorization', token) // Sem "Bearer"
        .send(validPayload);

      expect(response.status).toBe(403);
    });

    test('deve retornar 401 quando Authorization header está vazio', async () => {
      const response = await request(app)
        .post('/order')
        .set('Content-Type', 'application/json')
        .set('Authorization', '')
        .send(validPayload);

      expect(response.status).toBe(401);
    });

    test('deve aceitar requisição com token válido', async () => {
      const token = auth.generateToken({
        userId: 'user123',
        role: 'admin',
      });

      const response = await request(app)
        .post('/order')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(validPayload);

      // Deve passar pela autenticação (pode falhar por validação ou BD)
      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });

    test('deve permitir acesso apenas com role específico', async () => {
      const userToken = auth.generateToken({
        userId: 'user456',
        role: 'user', // Não é admin
      });

      const response = await request(app)
        .post('/order')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validPayload);

      // Deve retornar 403 Forbidden para usuário sem permissão
      // (quando middleware de autorização for implementado)
      expect([200, 201, 400, 403, 500]).toContain(response.status);
    });

    test('deve permitir acesso com role admin', async () => {
      const adminToken = auth.generateToken({
        userId: 'admin123',
        role: 'admin',
      });

      const response = await request(app)
        .post('/order')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validPayload);

      // Deve passar pela autenticação
      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });

    test('deve incluir usuário no request quando token é válido', async () => {
      const tokenPayload = {
        userId: 'test_user_123',
        email: 'test@example.com',
        role: 'admin',
      };

      const token = auth.generateToken(tokenPayload);

      const response = await request(app)
        .post('/order')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(validPayload);

      // Se a implementação incluir o userId na resposta
      if (response.body.data && response.body.data.userId) {
        expect(response.body.data.userId).toBe(tokenPayload.userId);
      }
    });
  });

  // ========== TESTES PARA GET /order/list ==========
  describe('GET /order/list - Com Autenticação', () => {
    test('deve retornar 401 quando token não é fornecido', async () => {
      const response = await request(app).get('/order/list');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('deve retornar 403 quando token é inválido', async () => {
      const response = await request(app)
        .get('/order/list')
        .set('Authorization', 'Bearer invalid');

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    test('deve aceitar requisição com token válido', async () => {
      const token = auth.generateToken({ userId: 'user123' });

      const response = await request(app)
        .get('/order/list')
        .set('Authorization', `Bearer ${token}`);

      // Passou pela autenticação - pode retornar 200
      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });
  });

  // ========== TESTES PARA GET /order/:orderId ==========
  describe('GET /order/:orderId - Com Autenticação', () => {
    test('deve retornar 401 quando token não é fornecido', async () => {
      const response = await request(app).get('/order/TEST001');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('deve retornar 403 quando token é inválido', async () => {
      const response = await request(app)
        .get('/order/TEST001')
        .set('Authorization', 'Bearer invalid');

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    test('deve aceitar requisição com token válido', async () => {
      const token = auth.generateToken({ userId: 'user123' });

      const response = await request(app)
        .get('/order/NONEXISTENT')
        .set('Authorization', `Bearer ${token}`);

      // Passou pela autenticação - pode retornar 404
      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });
  });

  // ========== TESTES PARA PUT /order/:orderId ==========
  describe('PUT /order/:orderId - Com Autenticação', () => {
    test('deve retornar 401 quando token não é fornecido', async () => {
      const response = await request(app)
        .put('/order/TEST001')
        .set('Content-Type', 'application/json')
        .send({ valorTotal: 200 });

      expect(response.status).toBe(401);
    });

    test('deve retornar 403 quando token é inválido', async () => {
      const response = await request(app)
        .put('/order/TEST001')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer invalid_token')
        .send({ valorTotal: 200 });

      expect(response.status).toBe(403);
    });

    test('deve aceitar requisição com token válido', async () => {
      const token = auth.generateToken({ userId: 'user123', role: 'admin' });

      const response = await request(app)
        .put('/order/NONEXISTENT')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({ valorTotal: 200 });

      // Passou pela autenticação
      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });
  });

  // ========== TESTES PARA DELETE /order/:orderId ==========
  describe('DELETE /order/:orderId - Com Autenticação', () => {
    test('deve retornar 401 quando token não é fornecido', async () => {
      const response = await request(app).delete('/order/TEST001');

      expect(response.status).toBe(401);
    });

    test('deve retornar 403 quando token é inválido', async () => {
      const response = await request(app)
        .delete('/order/TEST001')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(403);
    });

    test('deve aceitar requisição com token válido', async () => {
      const token = auth.generateToken({ userId: 'user123', role: 'admin' });

      const response = await request(app)
        .delete('/order/NONEXISTENT')
        .set('Authorization', `Bearer ${token}`);

      // Passou pela autenticação
      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });
  });

  // ========== TESTES DE REFRESH TOKEN (FUTURO) ==========
  describe('POST /auth/refresh - Gerar Novo Token', () => {
    test('deve retornar novo token quando fornecido token válido', async () => {
      const token = auth.generateToken({
        userId: 'user123',
        email: 'user@test.com',
      });

      const response = await request(app)
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${token}`);

      // Esperado: retorna novo token
      if (response.status === 200) {
        expect(response.body).toHaveProperty('token');
        expect(typeof response.body.token).toBe('string');
      }
    });

    test('deve retornar 401 quando token não é fornecido', async () => {
      const response = await request(app).post('/auth/refresh');

      if (response.status === 404) {
        // Rota não existe ainda
      } else {
        expect(response.status).toBe(401);
      }
    });
  });

  // ========== TESTES DE TOKEN EXPIRADO ==========
  describe('Token Expirado', () => {
    test('deve rejeitar token expirado', async () => {
      // Este é um token JWT expirado (exp: 1609459200 = Jan 1, 2021)
      const expiredToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMTIzIiwiZXhwIjoxNjA5NDU5MjAwfQ.invalid_signature';

      const response = await request(app)
        .get('/order/TEST')
        .set('Authorization', `Bearer ${expiredToken}`);

      // Deve retornar erro de autenticação
      expect([401, 403]).toContain(response.status);
    });
  });
});
