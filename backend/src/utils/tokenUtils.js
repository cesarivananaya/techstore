'use strict';
const jwt    = require('jsonwebtoken');
const config = require('../config');

/**
 * Genera un access token JWT
 * @param {object} payload - { id, email, role }
 */
const generateAccessToken = (payload) =>
  jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expire });

/**
 * Genera un refresh token JWT
 * @param {object} payload - { id }
 */
const generateRefreshToken = (payload) =>
  jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpire });

/**
 * Verifica un access token
 * @param {string} token
 */
const verifyAccessToken = (token) =>
  jwt.verify(token, config.jwt.secret);

/**
 * Verifica un refresh token
 * @param {string} token
 */
const verifyRefreshToken = (token) =>
  jwt.verify(token, config.jwt.refreshSecret);

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
