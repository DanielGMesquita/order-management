import Order from '../models/Order';
import Item from '../models/Item';

export const createOrder = async (req, res) => {
  try {
    const { orderId, value, items } = req.body;

    // Cria o pedido
    const order = await Order.create({ orderId, value });

    // Cria os itens associados ao pedido
    const createdItems = await Promise.all(items.map(async (item) => {
      return await Item.create({
        orderId: order.orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });
    }));

    res.status(201).json({
      message: 'Pedido criado com sucesso',
      order: {
        orderId: order.orderId,
        value: order.value,
        creationDate: order.creationDate,
        items: createdItems,
      },
    });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ message: 'Erro ao criar pedido', error: error.message });
  }
};

export default {
  createOrder,
};
