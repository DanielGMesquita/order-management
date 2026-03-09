/**
 * Jest Setup File
 * Executado antes de qualquer teste
 */

// Carrega variáveis de ambiente para testes
process.env.NODE_ENV = 'test';
process.env.DB_HOST = process.env.DB_HOST || 'localhost';
process.env.DB_PORT = process.env.DB_PORT || 5432;
process.env.DB_NAME = process.env.DB_NAME || 'order_management';
process.env.DB_USER = process.env.DB_USER || 'postgres';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key';

// Suppress console logs durante testes (opcional)
// global.console.error = jest.fn();
// global.console.warn = jest.fn();
