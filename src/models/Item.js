/**
 * Item Model
 * Define o esquema da tabela de itens de pedidos
 */

import { DataTypes } from 'sequelize';
import db from '../config/database.js';
import Order from './Order.js';

const Item = db.sequelize.define('Item', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único do item',
    },
    orderId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
        model: Order,
        key: 'order_id',
        },
        comment: 'Referência ao pedido',
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
        min: 1,
        },
        comment: 'Identificador do produto',
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
        min: {
            args: [1],
            msg: 'A quantidade deve ser um número inteiro positivo',
        },
        },
        comment: 'Quantidade do produto',
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
        min: {
            args: [0],
            msg: 'O preço deve ser maior ou igual a zero',
        },
        },
        comment: 'Preço unitário do produto',
    }
}, {
    tableName: 'items',
    timestamps: true,
    underscored: true,
    comment: 'Tabela de itens de pedidos',
});

//Relação entre Item e Order
Order.hasMany(Item, {
    foreignKey: 'order_id',
    as: 'items',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})

Item.belongsTo(Order, {
    foreignKey: 'order_id',
    as: 'order',
})

export default Item;