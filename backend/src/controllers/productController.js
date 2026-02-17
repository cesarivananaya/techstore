'use strict';
const { Op }     = require('sequelize');
const { Producto } = require('../models');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');
const AppError   = require('../utils/AppError');

/**
 * GET /api/v1/products
 * Listado con filtros, búsqueda y paginación
 */
exports.getAll = async (req, res, next) => {
  try {
    const {
      page = 1, limit = 12, search = '', categoria,
      marca, precioMin, precioMax, destacado, nuevo,
      ordenar = 'createdAt', dir = 'DESC',
    } = req.query;

    const where = { activo: true };

    if (search)    where[Op.or] = [
      { nombre:      { [Op.iLike]: `%${search}%` } },
      { descripcion: { [Op.iLike]: `%${search}%` } },
      { marca:       { [Op.iLike]: `%${search}%` } },
    ];
    if (categoria)  where.categoria  = categoria;
    if (marca)      where.marca      = { [Op.iLike]: `%${marca}%` };
    if (destacado !== undefined) where.destacado = destacado === 'true';
    if (nuevo !== undefined)     where.nuevo     = nuevo === 'true';
    if (precioMin || precioMax) {
      where.precio = {};
      if (precioMin) where.precio[Op.gte] = parseFloat(precioMin);
      if (precioMax) where.precio[Op.lte] = parseFloat(precioMax);
    }

    const orderField = ['precio', 'nombre', 'ratingPromedio', 'vendidos', 'createdAt']
      .includes(ordenar) ? ordenar : 'createdAt';
    const orderDir = dir.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Producto.findAndCountAll({
      where,
      order: [[orderField, orderDir]],
      limit: parseInt(limit),
      offset,
    });

    return paginatedResponse(res, { data: rows, total: count, page, limit });
  } catch (err) { next(err); }
};

/**
 * GET /api/v1/products/:id
 */
exports.getOne = async (req, res, next) => {
  try {
    const producto = await Producto.findOne({
      where: { id: req.params.id, activo: true },
    });
    if (!producto) return next(new AppError('Producto no encontrado', 404));

    await producto.incrementarVistas();
    return successResponse(res, { data: producto });
  } catch (err) { next(err); }
};

/**
 * GET /api/v1/products/slug/:slug
 */
exports.getBySlug = async (req, res, next) => {
  try {
    const producto = await Producto.findOne({
      where: { slug: req.params.slug, activo: true },
    });
    if (!producto) return next(new AppError('Producto no encontrado', 404));
    await producto.incrementarVistas();
    return successResponse(res, { data: producto });
  } catch (err) { next(err); }
};

/**
 * POST /api/v1/products  (admin)
 */
exports.create = async (req, res, next) => {
  try {
    const producto = await Producto.create(req.body);
    return successResponse(res, {
      statusCode: 201,
      message: 'Producto creado exitosamente',
      data: producto,
    });
  } catch (err) { next(err); }
};

/**
 * PUT /api/v1/products/:id  (admin)
 */
exports.update = async (req, res, next) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return next(new AppError('Producto no encontrado', 404));

    await producto.update(req.body);
    return successResponse(res, { message: 'Producto actualizado', data: producto });
  } catch (err) { next(err); }
};

/**
 * DELETE /api/v1/products/:id  (admin – soft delete)
 */
exports.remove = async (req, res, next) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return next(new AppError('Producto no encontrado', 404));

    await producto.update({ activo: false });
    return successResponse(res, { message: 'Producto eliminado correctamente' });
  } catch (err) { next(err); }
};

/**
 * GET /api/v1/products/categories/stats
 */
exports.categoryStats = async (_req, res, next) => {
  try {
    const { sequelize } = require('../models');
    const stats = await Producto.findAll({
      attributes: ['categoria', [sequelize.fn('COUNT', sequelize.col('id')), 'total']],
      where:  { activo: true },
      group:  ['categoria'],
      raw:    true,
    });
    return successResponse(res, { data: stats });
  } catch (err) { next(err); }
};
