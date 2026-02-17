'use strict';
const { ValidationError, UniqueConstraintError, DatabaseError } = require('sequelize');
const logger   = require('../utils/logger');
const AppError = require('../utils/AppError');

/**
 * Convierte errores de Sequelize a AppError legibles
 */
const handleSequelizeError = (err) => {
  if (err instanceof UniqueConstraintError) {
    const field = Object.keys(err.fields)[0];
    return new AppError(`El valor de '${field}' ya existe`, 409);
  }
  if (err instanceof ValidationError) {
    const messages = err.errors.map((e) => e.message).join('. ');
    return new AppError(`Error de validación: ${messages}`, 400);
  }
  if (err instanceof DatabaseError) {
    return new AppError('Error en la base de datos', 500);
  }
  return err;
};

/**
 * Middleware global de errores
 * Debe declararse con 4 parámetros para que Express lo reconozca como error handler
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = handleSequelizeError(err);

  // Errores de JWT
  if (err.name === 'JsonWebTokenError')  error = new AppError('Token inválido', 401);
  if (err.name === 'TokenExpiredError')  error = new AppError('Token expirado', 401);

  const statusCode = error.statusCode || 500;
  const message    = error.isOperational ? error.message : 'Error interno del servidor';

  logger.error(`[${req.method}] ${req.path} → ${statusCode}: ${err.message}`, {
    stack: err.stack,
    body:  req.body,
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
