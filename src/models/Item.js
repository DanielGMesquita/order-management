/**
 * Item Model
 * Define o esquema da tabela de itens de pedidos
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./Order');

const Item = sequelize.define('Item', {
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
        key: 'orderId',
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
    foreignKey: 'orderId',
    as: 'items',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})

Item.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order',
})

module.exports = Item;