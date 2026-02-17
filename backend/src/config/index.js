'use strict';
require('dotenv').config();

/**
 * Configuración central de la aplicación
 * Toda variable de entorno se consume desde aquí
 */
module.exports = {
  server: {
    port:    process.env.PORT        || 5000,
    env:     process.env.NODE_ENV    || 'development',
    version: process.env.API_VERSION || 'v1',
  },

  database: {
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT) || 5432,
    name:     process.env.DB_NAME     || 'techstore',
    user:     process.env.DB_USER     || 'postgres',
    password: process.env.DB_PASSWORD || '',
    dialect:  'postgres',
    url:      process.env.DATABASE_URL || null,
    pool: {
      max:     parseInt(process.env.DB_POOL_MAX)     || 10,
      min:     parseInt(process.env.DB_POOL_MIN)     || 0,
      acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
      idle:    parseInt(process.env.DB_POOL_IDLE)    || 10000,
    },
    logging: process.env.DB_LOGGING === 'true',
  },

  jwt: {
    secret:         process.env.JWT_SECRET,
    expire:         process.env.JWT_EXPIRE         || '7d',
    refreshSecret:  process.env.JWT_REFRESH_SECRET,
    refreshExpire:  process.env.JWT_REFRESH_EXPIRE || '30d',
  },

  security: {
    bcryptRounds:      parseInt(process.env.BCRYPT_ROUNDS)    || 12,
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    rateLimitMax:      parseInt(process.env.RATE_LIMIT_MAX)   || 100,
  },

  cors: {
    origin:      (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
    credentials: true,
    methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },

  email: {
    host:     process.env.EMAIL_HOST     || 'smtp.gmail.com',
    port:     parseInt(process.env.EMAIL_PORT) || 587,
    secure:   process.env.EMAIL_SECURE   === 'true',
    user:     process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from:     process.env.EMAIL_FROM     || 'TechStore <noreply@techstore.com>',
  },

  stripe: {
    secretKey:     process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file:  process.env.LOG_FILE  || 'logs/app.log',
  },
};
