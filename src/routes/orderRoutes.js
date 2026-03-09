import express from 'express';
import { createOrder, listOrders } from '../controllers/orderController.js';

const router = express.Router();
// Rota para criar um novo pedido
router.post('/orders', createOrder);
router.get('/orders/list', listOrders);

export default router;