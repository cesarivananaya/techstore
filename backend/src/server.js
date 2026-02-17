'use strict';
const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const compression  = require('compression');
const morgan       = require('morgan');
const cookieParser = require('cookie-parser');

const config        = require('./config');
const { connectDB } = require('./config/database');
// Importar modelos para que se registren en Sequelize
require('./models');

const { generalLimiter } = require('./middlewares/rateLimit');
const errorHandler        = require('./middlewares/errorHandler');
const logger              = require('./utils/logger');

// Rutas
const authRoutes    = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes   = require('./routes/orderRoutes');
const userRoutes    = require('./routes/userRoutes');

const app    = express();
const PREFIX = `/api/${config.server.version}`;

// ─── Seguridad ────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors(config.cors));
app.use(generalLimiter);

// ─── Middlewares generales ────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(compression());

if (config.server.env !== 'test') {
  app.use(morgan('dev', { stream: { write: (msg) => logger.info(msg.trim()) } }));
}

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) =>
  res.json({
    success: true,
    message: '✅ TechStore API funcionando',
    env:     config.server.env,
    time:    new Date().toISOString(),
  })
);

// ─── Rutas API ────────────────────────────────────────────────────────────────
app.use(`${PREFIX}/auth`,     authRoutes);
app.use(`${PREFIX}/products`, productRoutes);
app.use(`${PREFIX}/orders`,   orderRoutes);
app.use(`${PREFIX}/users`,    userRoutes);

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use('*', (req, res) =>
  res.status(404).json({ success: false, message: `Ruta ${req.originalUrl} no encontrada` })
);

// ─── Error handler global ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Arranque ─────────────────────────────────────────────────────────────────
const start = async () => {
  await connectDB();

  const server = app.listen(config.server.port, () => {
    logger.info('');
    logger.info('🚀 ─────────────────────────────────────────');
    logger.info(`   TechStore API  →  puerto ${config.server.port}`);
    logger.info(`   Entorno        →  ${config.server.env}`);
    logger.info(`   Base de datos  →  PostgreSQL`);
    logger.info(`   API base       →  http://localhost:${config.server.port}${PREFIX}`);
    logger.info('─────────────────────────────────────────── 🚀');
    logger.info('');
  });

  const gracefulShutdown = (signal) => {
    logger.info(`${signal} recibido – cerrando servidor...`);
    server.close(() => {
      logger.info('Servidor cerrado correctamente');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT',  () => gracefulShutdown('SIGINT'));
  process.on('unhandledRejection', (err) => {
    logger.error('UnhandledRejection:', err);
    server.close(() => process.exit(1));
  });
};

start();

module.exports = app; // Para tests
