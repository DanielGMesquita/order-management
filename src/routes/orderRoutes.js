import express from 'express';
import { createOrder, listOrders, getOrder, updateOrder, deleteOrder } from '../controllers/orderController.js';

const router = express.Router();

// Health check - rota raiz
router.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'API está operacional',
    endpoints: {
      post: '/order',
      get: ['/order/list', '/order/:orderId'],
      put: '/order/:orderId',
      delete: '/order/:orderId',
    },
  });
});

// Rotas de pedidos
router.post('/order', createOrder);
router.get('/order/list', listOrders);
router.get('/order/:orderId', getOrder);
router.put('/order/:orderId', updateOrder);
router.delete('/order/:orderId', deleteOrder);

// Rota 404
router.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
  });
});

export default router;