/**
 * Input Validators
 * Funções para validação de entrada de dados
 */

import { body, param, validationResult } from 'express-validator';

/**
 * Validação para criação de pedido
 */
const validateCreateOrder = [
  body('numeroPedido')
    .trim()
    .notEmpty()
    .withMessage('numeroPedido é obrigatório')
    .isString()
    .withMessage('numeroPedido deve ser uma string'),
    
  body('valorTotal')
    .notEmpty()
    .withMessage('valorTotal é obrigatório')
    .isNumeric()
    .withMessage('valorTotal deve ser um número')
    .custom(value => value > 0)
    .withMessage('valorTotal deve ser maior que 0'),
    
  body('dataCriacao')
    .notEmpty()
    .withMessage('dataCriacao é obrigatória')
    .isISO8601()
    .withMessage('dataCriacao deve ser uma data válida em formato ISO8601'),
    
  body('items')
    .isArray()
    .withMessage('items deve ser um array')
    .notEmpty()
    .withMessage('items não pode estar vazio')
    .custom(items => items.length > 0)
    .withMessage('items deve conter pelo menos um item'),
    
  body('items.*.idItem')
    .notEmpty()
    .withMessage('idItem é obrigatório em cada item')
    .isString()
    .withMessage('idItem deve ser uma string'),
    
  body('items.*.quantidadeItem')
    .notEmpty()
    .withMessage('quantidadeItem é obrigatória em cada item')
    .isInt({ min: 1 })
    .withMessage('quantidadeItem deve ser um inteiro maior que 0'),
    
  body('items.*.valorItem')
    .notEmpty()
    .withMessage('valorItem é obrigatório em cada item')
    .isNumeric()
    .withMessage('valorItem deve ser um número')
    .custom(value => value > 0)
    .withMessage('valorItem deve ser maior que 0'),
];

/**
 * Validação de parâmetro de ID do pedido
 */
const validateOrderId = [
  param('orderId')
    .trim()
    .notEmpty()
    .withMessage('orderId é obrigatório')
    .isString()
    .withMessage('orderId deve ser uma string'),
];

/**
 * Middleware para lidar com erros de validação
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Erro na validação dos dados',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

export { validateCreateOrder, validateOrderId, handleValidationErrors }; 