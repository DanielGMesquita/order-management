import express from 'express';
import { createOrder, listOrders, getOrder } from '../controllers/orderController.js';

const router = express.Router();
// Rota para criar um novo pedido
router.post('/order', createOrder);
router.get('/order/list', listOrders);
router.get('/order/:orderId', getOrder);

export default router;