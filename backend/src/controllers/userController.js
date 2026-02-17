'use strict';
const { User }   = require('../models');
const AppError   = require('../utils/AppError');
const { successResponse } = require('../utils/apiResponse');

/**
 * GET /api/v1/users/profile  (protected)
 */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return next(new AppError('Usuario no encontrado', 404));
    return successResponse(res, { data: user.toSafeJSON() });
  } catch (err) { next(err); }
};

/**
 * PUT /api/v1/users/profile  (protected)
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const ALLOWED = ['nombre', 'telefono', 'avatar'];
    const updates = {};
    ALLOWED.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const user = await User.findByPk(req.user.id);
    if (!user) return next(new AppError('Usuario no encontrado', 404));

    await user.update(updates);
    return successResponse(res, { message: 'Perfil actualizado', data: user.toSafeJSON() });
  } catch (err) { next(err); }
};

/**
 * PUT /api/v1/users/password  (protected)
 */
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.scope('withPassword').findByPk(req.user.id);
    const ok   = await user.checkPassword(currentPassword);
    if (!ok) return next(new AppError('Contraseña actual incorrecta', 400));

    await user.update({ password: newPassword });
    return successResponse(res, { message: 'Contraseña actualizada exitosamente' });
  } catch (err) { next(err); }
};

/**
 * GET /api/v1/users  (admin)
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    return successResponse(res, { data: users });
  } catch (err) { next(err); }
};

/**
 * PATCH /api/v1/users/:id/toggle  (admin)
 */
exports.toggleActive = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return next(new AppError('Usuario no encontrado', 404));
    await user.update({ activo: !user.activo });
    return successResponse(res, { message: `Usuario ${user.activo ? 'activado' : 'desactivado'}` });
  } catch (err) { next(err); }
};
