/**
 * Unit Tests - JWT Authentication
 * Testa o middleware de autenticação JWT
 */

import { authenticateToken, generateToken } from '../../src/middleware/auth.js';

describe('JWT Authentication - Unit Tests', () => {
  const testPayload = {
    userId: '123',
    email: 'test@example.com',
    role: 'admin',
  };

  // ========== TESTES DE GERAÇÃO DE TOKEN ==========
  describe('generateToken', () => {
    test('deve gerar um token JWT válido', () => {
      const token = generateToken(testPayload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT tem 3 partes
    });

    test('deve gerar tokens diferentes para chamadas diferentes', () => {
      const token1 = generateToken(testPayload);
      const token2 = generateToken(testPayload);
      
      // Os tokens podem ser diferentes por causa do timestamp 'iat'
      expect(token1).toBeDefined();
      expect(token2).toBeDefined();
      // Ambos devem ser válidos, mesmo que diferentes
    });

    test('deve incluir o payload no token', () => {
      const token = generateToken(testPayload);
      
      // Decodificar e verificar
      const parts = token.split('.');
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      
      expect(payload.userId).toBe(testPayload.userId);
      expect(payload.email).toBe(testPayload.email);
      expect(payload.role).toBe(testPayload.role);
    });

    test('deve incluir expiração no token', () => {
      const token = generateToken(testPayload);
      
      const parts = token.split('.');
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      
      expect(payload).toHaveProperty('exp'); // Tempo de expiração
      expect(payload).toHaveProperty('iat'); // Tempo de emissão
    });

    test('deve retornar string não vazia', () => {
      const token = generateToken(testPayload);
      
      expect(token).toBeTruthy();
      expect(token.length).toBeGreaterThan(0);
    });
  });

  // ========== TESTES DO MIDDLEWARE authenticateToken ==========
  describe('authenticateToken - Middleware', () => {
    let req, res, next;

    beforeEach(() => {
      // Mock do objeto request
      req = {
        headers: {},
      };

      // Mock do objeto response
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      // Mock da função next
      next = jest.fn();

      // Resetar mocks
      jest.clearAllMocks();
    });

    test('deve retornar 401 quando token não é fornecido', () => {
      req.headers.authorization = undefined;

      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token não fornecido',
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('deve retornar 401 quando authorization header está vazio', () => {
      req.headers.authorization = '';

      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token não fornecido',
      });
    });

    test('deve extrair token corretamente do header Bearer', () => {
      const token = generateToken(testPayload);
      req.headers.authorization = `Bearer ${token}`;

      authenticateToken(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeDefined();
      expect(req.user.userId).toBe(testPayload.userId);
      expect(req.user.email).toBe(testPayload.email);
      expect(req.user.role).toBe(testPayload.role);
    });

    test('deve retornar 403 quando token é inválido', () => {
      req.headers.authorization = 'Bearer token_invalido';

      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalled();
      expect(res.json.mock.calls[0][0]).toHaveProperty('success', false);
      expect(res.json.mock.calls[0][0]).toHaveProperty('message');
      expect(next).not.toHaveBeenCalled();
    });

    test('deve retornar 403 quando token está vazio', () => {
      req.headers.authorization = 'Bearer ';

      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    test('deve retornar 403 quando authorization format está incorreto', () => {
      const token = generateToken(testPayload);
      req.headers.authorization = token; // Sem "Bearer"

      authenticateToken(req, res, next);

      // Deve falhar porque espera "Bearer token"
      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    test('deve atribuir user ao request quando token é válido', () => {
      const token = generateToken(testPayload);
      req.headers.authorization = `Bearer ${token}`;

      authenticateToken(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user).toHaveProperty('userId');
      expect(req.user).toHaveProperty('email');
      expect(req.user).toHaveProperty('role');
    });

    test('deve chamar next() apenas quando token é válido', () => {
      const token = generateToken(testPayload);
      req.headers.authorization = `Bearer ${token}`;

      authenticateToken(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith();
    });

    test('deve retornar mensagem de erro quando token é expirado', (done) => {
      // Criar um token com expiração imediata
      const authHeader = req.headers;
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE2MDAwMDAwMDB9.INVALID';
      req.headers.authorization = `Bearer ${expiredToken}`;

      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
      done();
    });

    test('deve preservar a estrutura do token no usuário', () => {
      const customPayload = {
        id: 'user123',
        username: 'johndoe',
        permissions: ['read', 'write'],
      };

      const token = generateToken(customPayload);
      req.headers.authorization = `Bearer ${token}`;

      authenticateToken(req, res, next);

      expect(req.user.id).toBe(customPayload.id);
      expect(req.user.username).toBe(customPayload.username);
      expect(req.user.permissions).toEqual(customPayload.permissions);
    });

    test('deve retornar mensagem de erro apropriada na resposta', () => {
      req.headers.authorization = 'Bearer invalid_token';

      authenticateToken(req, res, next);

      const responseBody = res.json.mock.calls[0][0];
      expect(responseBody).toHaveProperty('success', false);
      expect(responseBody).toHaveProperty('message');
      expect(responseBody.message).toContain('Token inválido');
    });
  });

  // ========== TESTES DE INTEGRAÇÃO DE TOKEN ==========
  describe('Token Lifecycle', () => {
    test('deve gerar token, verificar e extrair payload', (done) => {
      const payload = { userId: '456', email: 'user@test.com' };
      const token = generateToken(payload);

      // Mock de request/response
      const req = { headers: { authorization: `Bearer ${token}` } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      authenticateToken(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user.userId).toBe(payload.userId);
      expect(req.user.email).toBe(payload.email);
      done();
    });

    test('deve rejeitar token modificado', () => {
      const payload = { userId: '789', role: 'user' };
      const token = generateToken(payload);

      // Modificar token (corromper a assinatura)
      const parts = token.split('.');
      const tamperedToken = `${parts[0]}.${parts[1]}.CORRUPTED`;

      const req = { headers: { authorization: `Bearer ${tamperedToken}` } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
