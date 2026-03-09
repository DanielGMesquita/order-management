/**
 * Integration Tests - Order Endpoints
 * Testa todos os endpoints da API
 */

import request from 'supertest';
import { app } from '../../src/app';
import { authenticate, sync, close } from '../../src/config/database';
import { destroy } from '../../src/models/Order';
import { destroy as _destroy } from '../../src/models/Item';
import { validOrderPayload, validOrderPayload2, multipleItemsOrderPayload, invalidOrderPayloads, updateOrderPayload } from '../fixtures/orderFixtures';

describe('Order API - Integration Tests', () => {
  // Setup e Teardown
  beforeAll(async () => {
    try {
      await authenticate();
      await sync({ alter: true });
    } catch (error) {
      console.error('Erro ao conectar ao banco de dados:', error.message);
      throw error;
    }
  });

  afterAll(async () => {
    await close();
  });

  beforeEach(async () => {
    // Limpa dados antes de cada teste
    await _destroy({ where: {} });
    await destroy({ where: {} });
  });

  // ========== TESTES POST /order ==========
  describe('POST /order - Criar Pedido', () => {
    test('deve criar um novo pedido com sucesso (201)', async () => {
      const response = await request(app)
        .post('/order')
        .set('Content-Type', 'application/json')
        .send(validOrderPayload);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Pedido criado com sucesso');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.orderId).toBe(validOrderPayload.numeroPedido);
      expect(response.body.data.value).toBe(validOrderPayload.valorTotal);
    });

    test('deve validar campos obrigatórios - falta numeroPedido', async () => {
      const response = await request(app)
        .post('/order')
        .set('Content-Type', 'application/json')
        .send(invalidOrderPayloads.missingNumeroPedido);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('errors');
    });

    test('deve validar campos obrigatórios - falta valorTotal', async () => {
      const response = await request(app)
        .post('/order')
        .set('Content-Type', 'application/json')
        .send(invalidOrderPayloads.missingValorTotal);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('deve validar campos obrigatórios - falta dataCriacao', async () => {
      const response = await request(app)
        .post('/order')
        .set('Content-Type', 'application/json')
        .send(invalidOrderPayloads.missingDataCriacao);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('deve validar que items não pode estar vazio', async () => {
      const response = await request(app)
        .post('/order')
        .set('Content-Type', 'application/json')
        .send(invalidOrderPayloads.missingItems);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('deve validar dataCriacao em formato ISO8601', async () => {
      const response = await request(app)
        .post('/order')
        .set('Content-Type', 'application/json')
        .send(invalidOrderPayloads.invalidDataCriacao);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('deve validar que valorTotal deve ser maior que 0', async () => {
      const response = await request(app)
        .post('/order')
        .set('Content-Type', 'application/json')
        .send(invalidOrderPayloads.negativeValorTotal);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('deve validar que quantidadeItem deve ser maior que 0', async () => {
      const response = await request(app)
        .post('/order')
        .set('Content-Type', 'application/json')
        .send(invalidOrderPayloads.negativeQuantidadeItem);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('deve validar que valorItem deve ser maior que 0', async () => {
      const response = await request(app)
        .post('/order')
        .set('Content-Type', 'application/json')
        .send(invalidOrderPayloads.negativeValorItem);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('deve rejeitar pedido duplicado (409)', async () => {
      // Cria primeiro pedido
      await request(app)
        .post('/order')
        .set('Content-Type', 'application/json')
        .send(validOrderPayload);

      // Tenta criar duplicado
      const response = await request(app)
        .post('/order')
        .set('Content-Type', 'application/json')
        .send(validOrderPayload);

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('já existe');
    });

    test('deve criar pedido com múltiplos itens', async () => {
      const response = await request(app)
        .post('/order')
        .set('Content-Type', 'application/json')
        .send(multipleItemsOrderPayload);

      expect(response.status).toBe(201);
      expect(response.body.data.items).toHaveLength(2);
      expect(response.body.data.items[0]).toHaveProperty('productId');
      expect(response.body.data.items[1]).toHaveProperty('productId');
    });

    test('deve mapear dados de entrada corretamente', async () => {
      const response = await request(app)
        .post('/order')
        .set('Content-Type', 'application/json')
        .send(validOrderPayload);

      const data = response.body.data;
      expect(data.orderId).toBe(validOrderPayload.numeroPedido);
      expect(data.value).toBe(validOrderPayload.valorTotal);
      expect(data.items[0].productId).toBe(parseInt(validOrderPayload.items[0].idItem));
      expect(data.items[0].quantity).toBe(validOrderPayload.items[0].quantidadeItem);
      expect(data.items[0].price).toBe(validOrderPayload.items[0].valorItem);
    });
  });

  // ========== TESTES GET /order/:orderId ==========
  describe('GET /order/:orderId - Obter Pedido', () => {
    beforeEach(async () => {
      // Cria um pedido para os testes
      await request(app)
        .post('/order')
        .set('Content-Type', 'application/json')
        .send(validOrderPayload);
    });

    test('deve obter um pedido existente (200)', async () => {
      const response = await request(app).get(`/order/${validOrderPayload.numeroPedido}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.orderId).toBe(validOrderPayload.numeroPedido);
      expect(response.body.data.value).toBe(validOrderPayload.valorTotal);
    });

    test('deve retornar erro 404 para pedido não encontrado', async () => {
      const response = await request(app).get('/order/INEXISTENTE');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('não encontrado');
    });

    test('deve retornar itens do pedido', async () => {
      const response = await request(app).get(`/order/${validOrderPayload.numeroPedido}`);

      expect(response.status).toBe(200);
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.items[0]).toHaveProperty('productId');
      expect(response.body.data.items[0]).toHaveProperty('quantity');
      expect(response.body.data.items[0]).toHaveProperty('price');
    });

    test('deve retornar dados mapeados corretamente', async () => {
      const response = await request(app).get(`/order/${validOrderPayload.numeroPedido}`);

      const data = response.body.data;
      expect(data).toHaveProperty('orderId');
      expect(data).toHaveProperty('value');
      expect(data).toHaveProperty('creationDate');
      expect(data).toHaveProperty('items');
    });
  });

  // ========== TESTES GET /order/list ==========
  describe('GET /order/list - Listar Pedidos', () => {
    test('deve retornar lista vazia quando não há pedidos (200)', async () => {
      const response = await request(app).get('/order/list');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
      expect(response.body.count).toBe(0);
    });

    test('deve retornar todos os pedidos criados', async () => {
      // Cria dois pedidos
      await request(app)
        .post('/order')
        .send(validOrderPayload);

      await request(app)
        .post('/order')
        .send(validOrderPayload2);

      const response = await request(app).get('/order/list');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.count).toBe(2);
    });

    test('deve retornar pedidos com todos os campos', async () => {
      await request(app)
        .post('/order')
        .send(validOrderPayload);

      const response = await request(app).get('/order/list');

      expect(response.body.data[0]).toHaveProperty('orderId');
      expect(response.body.data[0]).toHaveProperty('value');
      expect(response.body.data[0]).toHaveProperty('creationDate');
      expect(response.body.data[0]).toHaveProperty('items');
    });

    test('deve retornar pedidos em ordem decrescente de criação', async () => {
      await request(app)
        .post('/order')
        .send(validOrderPayload);

      await new Promise(resolve => setTimeout(resolve, 100));

      await request(app)
        .post('/order')
        .send(validOrderPayload2);

      const response = await request(app).get('/order/list');

      expect(response.body.data[0].orderId).toBe(validOrderPayload2.numeroPedido);
      expect(response.body.data[1].orderId).toBe(validOrderPayload.numeroPedido);
    });
  });

  // ========== TESTES PUT /order/:orderId ==========
  describe('PUT /order/:orderId - Atualizar Pedido', () => {
    beforeEach(async () => {
      await request(app)
        .post('/order')
        .send(validOrderPayload);
    });

    test('deve atualizar um pedido existente (200)', async () => {
      const response = await request(app)
        .put(`/order/${validOrderPayload.numeroPedido}`)
        .set('Content-Type', 'application/json')
        .send(updateOrderPayload);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('atualizado');
      expect(response.body.data.value).toBe(updateOrderPayload.valorTotal);
    });

    test('deve retornar erro 404 ao atualizar pedido inexistente', async () => {
      const response = await request(app)
        .put('/order/INEXISTENTE')
        .set('Content-Type', 'application/json')
        .send(updateOrderPayload);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    test('deve atualizar apenas valorTotal', async () => {
      const updatePayload = { valorTotal: 9999 };

      const response = await request(app)
        .put(`/order/${validOrderPayload.numeroPedido}`)
        .set('Content-Type', 'application/json')
        .send(updatePayload);

      expect(response.status).toBe(200);
      expect(response.body.data.value).toBe(9999);
    });

    test('deve atualizar apenas itens', async () => {
      const updatePayload = {
        items: [
          {
            idItem: '5555',
            quantidadeItem: 5,
            valorItem: 1000,
          },
        ],
      };

      const response = await request(app)
        .put(`/order/${validOrderPayload.numeroPedido}`)
        .set('Content-Type', 'application/json')
        .send(updatePayload);

      expect(response.status).toBe(200);
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.items[0].productId).toBe(5555);
      expect(response.body.data.items[0].quantity).toBe(5);
    });

    test('deve atualizar valorTotal e itens juntos', async () => {
      const response = await request(app)
        .put(`/order/${validOrderPayload.numeroPedido}`)
        .set('Content-Type', 'application/json')
        .send(updateOrderPayload);

      expect(response.status).toBe(200);
      expect(response.body.data.value).toBe(updateOrderPayload.valorTotal);
      expect(response.body.data.items).toHaveLength(1);
    });

    test('deve atualizar dataCriacao', async () => {
      const newDate = '2025-12-31T23:59:59Z';
      const updatePayload = { dataCriacao: newDate };

      const response = await request(app)
        .put(`/order/${validOrderPayload.numeroPedido}`)
        .set('Content-Type', 'application/json')
        .send(updatePayload);

      expect(response.status).toBe(200);
      expect(response.body.data.creationDate).toBeDefined();
    });
  });

  // ========== TESTES DELETE /order/:orderId ==========
  describe('DELETE /order/:orderId - Deletar Pedido', () => {
    beforeEach(async () => {
      await request(app)
        .post('/order')
        .send(validOrderPayload);
    });

    test('deve deletar um pedido existente (200)', async () => {
      const response = await request(app).delete(`/order/${validOrderPayload.numeroPedido}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deletado');
    });

    test('deve retornar erro 404 ao deletar pedido inexistente', async () => {
      const response = await request(app).delete('/order/INEXISTENTE');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    test('deve deletar pedido e seus itens', async () => {
      // Deleta o pedido
      const deleteResponse = await request(app).delete(`/order/${validOrderPayload.numeroPedido}`);
      expect(deleteResponse.status).toBe(200);

      // Verifica que não existe mais
      const getResponse = await request(app).get(`/order/${validOrderPayload.numeroPedido}`);
      expect(getResponse.status).toBe(404);
    });

    test('deve deletar em cascata os itens do pedido', async () => {
      // Verifica que pedido existe com itens
      let getResponse = await request(app).get(`/order/${validOrderPayload.numeroPedido}`);
      expect(getResponse.body.data.items.length).toBeGreaterThan(0);

      // Deleta pedido
      await request(app).delete(`/order/${validOrderPayload.numeroPedido}`);

      // Verifica que pedido foi deletado
      getResponse = await request(app).get(`/order/${validOrderPayload.numeroPedido}`);
      expect(getResponse.status).toBe(404);
    });
  });

  // ========== TESTES DE ROTA RAIZ ==========
  describe('GET / - Health Check', () => {
    test('deve retornar status OK (200)', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  // ========== TESTES DE ROTA NÃO ENCONTRADA ==========
  describe('GET /rota-inexistente - 404', () => {
    test('deve retornar erro 404 para rota não encontrada', async () => {
      const response = await request(app).get('/rota-inexistente');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
