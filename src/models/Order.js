/**
 * Order Model
 * Arquivo de definição do modelo de pedidos para o Sequelize
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

const Order = sequelize.define('Order', {
  orderId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
    comment: 'Identificador único do pedido',
  },
  value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Valor total do pedido',
    validate: {
      min: {
        args: [0],
        msg: 'O valor deve ser maior ou igual a zero',
      },
    },
  },
  creationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Data de criação do pedido',
  },
}, {
  tableName: 'orders',
  timestamps: true,
  underscored: true,
  comment: 'Tabela de pedidos',
});

export default Order;