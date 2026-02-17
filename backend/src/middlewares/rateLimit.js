'use strict';
const rateLimit = require('express-rate-limit');
const config = require('../config');

/**
 * Rate limiter general
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000, // Límite virtualmente infinito para desarrollo
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Demasiadas peticiones. Intenta más tarde.' },
});

/**
 * Rate limiter estricto para auth
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000, // Límite virtualmente infinito para desarrollo
  message: { success: false, message: 'Demasiados intentos de acceso. Espera 15 minutos.' },
});

module.exports = { generalLimiter, authLimiter };
