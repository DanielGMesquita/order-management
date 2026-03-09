import express from 'express';
import { createOrder, listOrders, getOrder, updateOrder, deleteOrder } from '../controllers/orderController.js';
import { validateCreateOrder, handleValidationErrors } from '../utils/validators';

const router = express.Router();

// Rotas de pedidos
router.post('/order', validateCreateOrder, handleValidationErrors, createOrder);
router.get('/order/list', listOrders);
router.get('/order/:orderId', getOrder);
router.put('/order/:orderId', updateOrder);
router.delete('/order/:orderId', deleteOrder);

export default router;