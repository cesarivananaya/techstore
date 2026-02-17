'use strict';

/**
 * Error operacional de la aplicación
 * Distingue errores esperados (404, 401, 400, etc.)
 * de errores inesperados del sistema
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode  = statusCode;
    this.status      = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
