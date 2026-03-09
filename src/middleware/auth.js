/**
 * JWT Authentication Middleware
 * Middleware para autenticação de requisições usando JWT
 */

import pkg from 'jsonwebtoken';
const { verify, sign } = pkg;

/**
 * Middleware para verificar token JWT
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token não fornecido',
    });
  }

  verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token inválido ou expirado',
        error: err.message,
      });
    }

    req.user = user;
    next();
  });
};

/**
 * Gera um token JWT
 * @param {Object} payload - Dados para incluir no token
 * @returns {String} Token JWT
 */
export const generateToken = (payload) => {
  return sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION || '24h' }
  );
};