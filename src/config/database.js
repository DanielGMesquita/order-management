/**
 * Database Configuration
 * Arquivo de configuração do Sequelize para conexão com PostgreSQL
 */

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// Configuração da conexão com PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME || 'order_management',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Testa a conexão com o banco de dados
const authenticate = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Conexão com banco de dados estabelecida');
  } catch (error) {
    console.error('✗ Erro ao conectar ao banco de dados:', error.message);
    throw error;
  }
};

// Sincroniza modelos com o banco de dados
const sync = async (options = {}) => {
  try {
    await sequelize.sync(options);
    console.log('✓ Modelos sincronizados com o banco de dados');
  } catch (error) {
    console.error('✗ Erro ao sincronizar modelos:', error.message);
    throw error;
  }
};

// Fecha a conexão com o banco de dados
const close = async () => {
  try {
    await sequelize.close();
    console.log('✓ Conexão com banco de dados fechada');
  } catch (error) {
    console.error('✗ Erro ao fechar conexão:', error.message);
    throw error;
  }
};

export default {
  sequelize,
  authenticate,
  sync,
  close,
};
