'use strict';
/**
 * auth.js – Middleware de autenticación JWT
 */
const { verifyAccessToken } = require('../utils/tokenUtils');
const { User }              = require('../models');
const AppError              = require('../utils/AppError');

const protect = async (req, _res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return next(new AppError('No autorizado – token requerido', 401));

    const decoded = verifyAccessToken(token);
    const user    = await User.findByPk(decoded.id, {
      attributes: ['id', 'nombre', 'email', 'role', 'activo'],
    });

    if (!user)        return next(new AppError('El usuario ya no existe', 401));
    if (!user.activo) return next(new AppError('Cuenta desactivada', 403));

    req.user = user;
    next();
  } catch {
    next(new AppError('Token inválido o expirado', 401));
  }
};

/** Restringe el acceso a uno o más roles */
const authorize = (...roles) =>
  (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('No tienes permiso para esta acción', 403));
    }
    next();
  };

module.exports = { protect, authorize };
