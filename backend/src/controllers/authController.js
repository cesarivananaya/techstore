'use strict';
const crypto   = require('crypto');
const { User } = require('../models');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/tokenUtils');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const AppError = require('../utils/AppError');
const logger   = require('../utils/logger');

/**
 * POST /api/v1/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { nombre, email, password, telefono } = req.body;

    const existe = await User.findOne({ where: { email } });
    if (existe) return next(new AppError('El email ya está registrado', 409));

    const user = await User.create({ nombre, email, password, telefono });

    const accessToken  = generateAccessToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    logger.info(`Nuevo usuario registrado: ${email}`);

    return successResponse(res, {
      statusCode: 201,
      message: 'Usuario registrado exitosamente',
      data: { user: user.toSafeJSON(), accessToken, refreshToken },
    });
  } catch (err) { next(err); }
};

/**
 * POST /api/v1/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.scope('withPassword').findOne({ where: { email } });
    if (!user) return next(new AppError('Credenciales inválidas', 401));

    const passwordOk = await user.checkPassword(password);
    if (!passwordOk) return next(new AppError('Credenciales inválidas', 401));

    if (!user.activo) return next(new AppError('Cuenta desactivada. Contacta soporte.', 403));

    await user.update({ ultimoAcceso: new Date() });

    const accessToken  = generateAccessToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    logger.info(`Login exitoso: ${email}`);

    return successResponse(res, {
      message: 'Inicio de sesión exitoso',
      data: { user: user.toSafeJSON(), accessToken, refreshToken },
    });
  } catch (err) { next(err); }
};

/**
 * GET /api/v1/auth/me  (protected)
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return next(new AppError('Usuario no encontrado', 404));
    return successResponse(res, { data: user.toSafeJSON() });
  } catch (err) { next(err); }
};

/**
 * POST /api/v1/auth/logout  (protected)
 */
exports.logout = (_req, res) => {
  // En producción: invalidar token en lista negra (Redis)
  return successResponse(res, { message: 'Sesión cerrada exitosamente' });
};

/**
 * POST /api/v1/auth/refresh
 */
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return next(new AppError('Refresh token requerido', 400));

    const decoded = verifyRefreshToken(refreshToken);
    const user    = await User.findByPk(decoded.id);
    if (!user || !user.activo) return next(new AppError('Token inválido', 401));

    const newAccess = generateAccessToken({ id: user.id, email: user.email, role: user.role });

    return successResponse(res, { data: { accessToken: newAccess } });
  } catch {
    return next(new AppError('Refresh token inválido o expirado', 401));
  }
};

/**
 * POST /api/v1/auth/forgot-password
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    // Respuesta genérica para no revelar si el email existe
    if (!user) {
      return successResponse(res, { message: 'Si el email existe, recibirás un correo de recuperación' });
    }

    const token    = crypto.randomBytes(32).toString('hex');
    const hashed   = crypto.createHash('sha256').update(token).digest('hex');

    await user.update({
      resetPasswordToken:  hashed,
      resetPasswordExpire: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    });

    // TODO: enviar email con el token
    // await emailService.sendPasswordReset(email, token);

    logger.info(`Reset solicitado para: ${email}`);

    return successResponse(res, { message: 'Si el email existe, recibirás un correo de recuperación' });
  } catch (err) { next(err); }
};

/**
 * PUT /api/v1/auth/reset-password/:token
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const { Op } = require('sequelize');

    const user = await User.findOne({
      where: {
        resetPasswordToken:  hashed,
        resetPasswordExpire: { [Op.gt]: new Date() },
      },
    });

    if (!user) return next(new AppError('Token inválido o expirado', 400));

    await user.update({
      password:            req.body.password,
      resetPasswordToken:  null,
      resetPasswordExpire: null,
    });

    const accessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role });

    return successResponse(res, {
      message: 'Contraseña actualizada exitosamente',
      data: { accessToken },
    });
  } catch (err) { next(err); }
};
