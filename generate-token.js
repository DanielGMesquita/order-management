/**
 * Script para gerar token JWT para testes no Postman
 * 
 * Uso:
 *   node generate-token.js
 * 
 * O token será exibido no console - copie e use no Postman
 */

import dotenv from 'dotenv';
import pkg from 'jsonwebtoken';

dotenv.config();

const { sign } = pkg;

// Payload de teste - customize conforme necessário
const payload = {
  email: 'test@example.com',
  username: 'testuser',
};

const JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '24h';

try {
  const token = sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║           Token JWT Gerado com Sucesso!                   ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  console.log('📋 Payload:');
  console.log(JSON.stringify(payload, null, 2));
  
  console.log('\n🔑 Token:');
  console.log(token);
  
  console.log('\n📌 Instruções de Uso no Postman:');
  console.log('1. Abra o Postman');
  console.log('2. Selecione a aba "Headers"');
  console.log('3. Adicione uma nova header:');
  console.log('   Key: Authorization');
  console.log('   Value: Bearer ' + token);
  console.log('\n4. Envie a requisição com autenticação!');
  
  console.log('\n⏰ Informações do Token:');
  console.log(`   - Expira em: ${JWT_EXPIRATION}`);
  console.log(`   - JWT_SECRET: ${JWT_SECRET}`);
  
  console.log('\n');
} catch (error) {
  console.error('❌ Erro ao gerar token:', error.message);
  process.exit(1);
}
