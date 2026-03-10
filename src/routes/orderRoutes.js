import express from 'express';
import { createOrder, listOrders, getOrder, updateOrder, deleteOrder } from '../controllers/orderController.js';
import { validateCreateOrder, validateOrderId, handleValidationErrors } from '../utils/validators.js';
import { authenticateToken, generateToken } from '../middleware/auth.js';

const router = express.Router();

// Health check - sem autenticação
router.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'API está operacional',
    endpoints: {
      post: '/order (requer autenticação)',
      get: ['/order/list (sem autenticação)', '/order/:orderId (sem autenticação)'],
      put: '/order/:orderId (requer autenticação)',
      delete: '/order/:orderId (requer autenticação)',
    },
  });
});

// Rotas de pedidos

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Cria um novo pedido
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Token não fornecido
 *       403:
 *         description: Token inválido ou expirado
 *       409:
 *         description: Pedido já existe
 *       500:
 *         description: Erro do servidor
 */
router.post('/order', authenticateToken, validateCreateOrder, handleValidationErrors, createOrder);

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
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Token não fornecido
 *       403:
 *         description: Token inválido ou expirado
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro do servidor
 */
router.put('/order/:orderId', authenticateToken, validateOrderId, handleValidationErrors, updateOrder);

/**
 * @swagger
 * /order/{orderId}:
 *   delete:
 *     summary: Deleta um pedido
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Token não fornecido
 *       403:
 *         description: Token inválido ou expirado
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro do servidor
 */
router.delete('/order/:orderId', authenticateToken, validateOrderId, handleValidationErrors, deleteOrder);

// ========== AUTENTICAÇÃO ==========

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Gera token JWT para acesso a endpoints protegidos
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "testuser"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "test@example.com"
 *     responses:
 *       200:
 *         description: Token gerado com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro do servidor
 */
router.post('/auth/login', (req, res) => {
  try {
    const { username, email } = req.body;

    // Simples validação
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username é obrigatório',
      });
    }

    // Cria payload do token
    const payload = {
      userId: `user-${Date.now()}`,
      username: username || 'user',
      email: email || `${username}@example.com`,
      role: 'admin',
      loginTime: new Date().toISOString(),
    };

    // Gera token
    const token = generateToken(payload);

    return res.status(200).json({
      success: true,
      message: 'Token gerado com sucesso',
      data: {
        token,
        expiresIn: process.env.JWT_EXPIRATION || '24h',
        user: payload,
      },
    });
  } catch (error) {
    console.error('Erro ao gerar token:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao gerar token',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

export default router;
