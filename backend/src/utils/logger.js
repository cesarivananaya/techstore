'use strict';
const { createLogger, format, transports } = require('winston');
const path   = require('path');
const config = require('../config');

const { combine, timestamp, printf, colorize, errors } = format;

// Formato para consola
const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack }) =>
    stack
      ? `[${timestamp}] ${level}: ${message}\n${stack}`
      : `[${timestamp}] ${level}: ${message}`
  )
);

// Formato para archivo (JSON)
const fileFormat = combine(
  timestamp(),
  errors({ stack: true }),
  format.json()
);

const logger = createLogger({
  level: config.logging.level,
  transports: [
    // Consola
    new transports.Console({ format: consoleFormat }),

    // Archivo de errores
    new transports.File({
      filename: path.join('logs', 'error.log'),
      level:    'error',
      format:   fileFormat,
    }),

    // Archivo general
    new transports.File({
      filename: path.join(process.cwd(), config.logging.file),
      format:   fileFormat,
    }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: path.join('logs', 'exceptions.log') }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: path.join('logs', 'rejections.log') }),
  ],
});

module.exports = logger;
