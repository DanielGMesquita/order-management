import express from 'express';
import { createOrder, listOrders, getOrder, updateOrder, deleteOrder } from '../controllers/orderController.js';
import { validateCreateOrder, validateOrderId, handleValidationErrors } from '../utils/validators.js';

const router = express.Router();

// Rotas de pedidos

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Cria um novo pedido
 *     tags:
 *       - Pedidos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numeroPedido
 *               - valorTotal
 *               - dataCriacao
 *               - items
 *             properties:
 *               numeroPedido:
 *                 type: string
 *                 example: "v10089015vdb-01"
 *               valorTotal:
 *                 type: number
 *                 example: 10000
 *               dataCriacao:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-07-19T12:24:11.5299601+00:00"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - idItem
 *                     - quantidadeItem
 *                     - valorItem
 *                   properties:
 *                     idItem:
 *                       type: string
 *                       example: "2434"
 *                     quantidadeItem:
 *                       type: integer
 *                       example: 1
 *                     valorItem:
 *                       type: number
 *                       example: 1000
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Erro na validação dos dados
 *       409:
 *         description: Pedido já existe
 *       500:
 *         description: Erro do servidor
 */
router.post('/order', validateCreateOrder, handleValidationErrors, createOrder);

/**
 * @swagger
 * /order/list:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags:
 *       - Pedidos
 *     responses:
 *       200:
 *         description: Pedidos listados com sucesso
 *       500:
 *         description: Erro do servidor
 */
router.get('/order/list', listOrders);

/**
 * @swagger
 * /order/{orderId}:
 *   get:
 *     summary: Obtém um pedido específico
 *     tags:
 *       - Pedidos
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: "v10089016vdb"
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro do servidor
 */
router.get('/order/:orderId', validateOrderId, handleValidationErrors, getOrder);

/**
 * @swagger
 * /order/{orderId}:
 *   put:
 *     summary: Atualiza um pedido
 *     tags:
 *       - Pedidos
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: "v10089016vdb"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               valorTotal:
 *                 type: number
 *               dataCriacao:
 *                 type: string
 *                 format: date-time
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro do servidor
 */
router.put('/order/:orderId', validateOrderId, handleValidationErrors, updateOrder);

/**
 * @swagger
 * /order/{orderId}:
 *   delete:
 *     summary: Deleta um pedido
 *     tags:
 *       - Pedidos
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: "v10089016vdb"
 *     responses:
 *       200:
 *         description: Pedido deletado com sucesso
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro do servidor
 */
router.delete('/order/:orderId', validateOrderId, handleValidationErrors, deleteOrder);

export default router;