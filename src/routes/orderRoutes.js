import express from 'express';
import { createOrder } from '../controllers/orderController';

const router = express.Router();

// Rota para criar um novo pedido
router.post('/orders', createOrder);

export default router;