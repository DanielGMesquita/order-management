import Order from '../models/Order.js';
import Item from '../models/Item.js';
import { mapOrderInputToDatabase, mapItemsInputToDatabase } from '../utils/mappers.js';

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
