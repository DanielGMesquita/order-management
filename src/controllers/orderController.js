import Order from '../models/Order.js';
import Item from '../models/Item.js';
import { mapOrderInputToDatabase, mapItemsInputToDatabase, mapOrderDatabaseToOutput } from '../utils/mappers.js';

/**
 * Cria um novo pedido
 * POST /order
 */
export const createOrder = async (req, res) => {
  try {
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    // Verifica se o pedido já existe
    const existingOrder = await Order.findByPk(numeroPedido);
    if (existingOrder) {
      return res.status(409).json({
        success: false,
        message: `Pedido com número ${numeroPedido} já existe`,
      });
    }

    // Mapeia dados de entrada
    const orderData = mapOrderInputToDatabase({ numeroPedido, valorTotal, dataCriacao });
    const itemsData = mapItemsInputToDatabase(items, numeroPedido);

    // Cria pedido e itens
    const order = await Order.create(orderData);
    await Item.bulkCreate(itemsData);

    // Busca pedido com itens
    const createdOrder = await Order.findByPk(numeroPedido, {
      include: [{ model: Item, as: 'items' }],
    });

    return res.status(201).json({
      success: true,
      message: 'Pedido criado com sucesso',
      data: createdOrder,
    });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao criar pedido',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Lista todos os pedidos
 * GET /order/list
 */
export const listOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: Item, as: 'items' }],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      message: 'Pedidos listados com sucesso',
      data: orders.map(mapOrderDatabaseToOutput),
      count: orders.length,
    });
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao listar pedidos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Obtém um pedido específico
 * GET /order/:orderId
 */
export const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByPk(orderId, {
      include: [{ model: Item, as: 'items' }],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Pedido ${orderId} não encontrado`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Pedido encontrado',
      data: mapOrderDatabaseToOutput(order),
    });
  } catch (error) {
    console.error('Erro ao obter pedido:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao obter pedido',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
