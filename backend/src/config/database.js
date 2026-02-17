'use strict';
const { Sequelize } = require('sequelize');
const config        = require('./index');
const logger        = require('../utils/logger');

/**
 * Instancia única de Sequelize (PostgreSQL)
 * Se usa DATABASE_URL si está definida (Render, Railway, Supabase…),
 * de lo contrario usa los parámetros individuales.
 */
const sequelize = config.database.url
  ? new Sequelize(config.database.url, {
      dialect:  'postgres',
      protocol: 'postgres',
      logging:  config.database.logging ? (msg) => logger.debug(msg) : false,
      dialectOptions: {
        ssl: {
          require:            true,
          rejectUnauthorized: false,   // para Render / Supabase
        },
      },
      pool: config.database.pool,
    })
  : new Sequelize(
      config.database.name,
      config.database.user,
      config.database.password,
      {
        host:    config.database.host,
        port:    config.database.port,
        dialect: 'postgres',
        logging: config.database.logging ? (msg) => logger.debug(msg) : false,
        pool:    config.database.pool,
      }
    );

/**
 * Prueba la conexión a la base de datos
 */
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅  PostgreSQL conectado correctamente');

    // En desarrollo sincronizamos sin borrar datos (alter:true)
    if (config.server.env === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('📐  Modelos sincronizados con la BD (alter)');
    }
  } catch (err) {
    logger.error(`❌  Error al conectar con PostgreSQL: ${err.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
