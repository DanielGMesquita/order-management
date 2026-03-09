import express from 'express';
import { createOrder, listOrders, getOrder, updateOrder, deleteOrder } from '../controllers/orderController.js';
import { validateCreateOrder, validateOrderId, handleValidationErrors } from '../utils/validators';

const router = express.Router();

// Rotas de pedidos
router.post('/order', validateCreateOrder, handleValidationErrors, createOrder);
router.get('/order/list', listOrders);
router.get('/order/:orderId', validateOrderId, handleValidationErrors, getOrder);
router.put('/order/:orderId', validateOrderId, handleValidationErrors, updateOrder);
router.delete('/order/:orderId', validateOrderId, handleValidationErrors, deleteOrder);

export default router;