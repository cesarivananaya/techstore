'use strict';
const { Pedido, Producto, User } = require('../models');
const { successResponse, paginatedResponse } = require('../utils/apiResponse');
const AppError = require('../utils/AppError');
const { sequelize } = require('../models');

/**
 * POST /api/v1/orders
 */
exports.create = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { items, direccionEnvio, metodoPago, cupon } = req.body;

    // Verificar stock y construir snapshot de items
    const itemsSnapshot = [];
    let subtotal = 0;

    for (const item of items) {
      const producto = await Producto.findByPk(item.productoId, { transaction: t });
      if (!producto)            throw new AppError(`Producto ${item.productoId} no encontrado`, 404);
      if (!producto.activo)     throw new AppError(`Producto ${producto.nombre} no disponible`, 400);
      if (!producto.tieneStock(item.cantidad)) {
        throw new AppError(`Stock insuficiente para ${producto.nombre}`, 400);
      }

      const subtotalItem = Number(producto.precio) * item.cantidad;
      subtotal += subtotalItem;

      itemsSnapshot.push({
        productoId: producto.id,
        nombre:     producto.nombre,
        imagen:     producto.imagenes?.[0]?.url || null,
        precio:     Number(producto.precio),
        cantidad:   item.cantidad,
        subtotal:   subtotalItem,
      });

      // Reducir stock dentro de la transacción
      await producto.reducirStock(item.cantidad);
    }

    // TODO: validar cupón si viene
    const descuento  = 0;
    const costoEnvio = subtotal >= 999 ? 0 : 50;
    const impuestos  = 0;
    const total      = subtotal - descuento + costoEnvio + impuestos;

    const pedido = await Pedido.create({
      userId:     req.user.id,
      items:      itemsSnapshot,
      direccionEnvio,
      metodoPago,
      subtotal,
      descuento,
      costoEnvio,
      impuestos,
      total,
      historialEstados: [{ estado: 'pendiente', fecha: new Date(), nota: 'Pedido creado' }],
    }, { transaction: t });

    await t.commit();

    return successResponse(res, {
      statusCode: 201,
      message: 'Pedido creado exitosamente',
      data: pedido,
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

/**
 * GET /api/v1/orders/me   – Pedidos del usuario actual
 */
exports.getMine = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Pedido.findAndCountAll({
      where:  { userId: req.user.id },
      order:  [['createdAt', 'DESC']],
      limit:  parseInt(limit),
      offset,
    });

    return paginatedResponse(res, { data: rows, total: count, page, limit });
  } catch (err) { next(err); }
};

/**
 * GET /api/v1/orders/:id
 */
exports.getOne = async (req, res, next) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id, {
      include: [{ model: User, as: 'usuario', attributes: ['id', 'nombre', 'email'] }],
    });

    if (!pedido) return next(new AppError('Pedido no encontrado', 404));

    // El usuario sólo puede ver sus propios pedidos (admin puede ver todos)
    if (req.user.role !== 'admin' && pedido.userId !== req.user.id) {
      return next(new AppError('No autorizado', 403));
    }

    return successResponse(res, { data: pedido });
  } catch (err) { next(err); }
};

/**
 * GET /api/v1/orders  (admin)
 */
exports.getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, estado } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where  = estado ? { estado } : {};

    const { count, rows } = await Pedido.findAndCountAll({
      where,
      include: [{ model: User, as: 'usuario', attributes: ['id', 'nombre', 'email'] }],
      order:   [['createdAt', 'DESC']],
      limit:   parseInt(limit),
      offset,
    });

    return paginatedResponse(res, { data: rows, total: count, page, limit });
  } catch (err) { next(err); }
};

/**
 * PATCH /api/v1/orders/:id/status  (admin)
 */
exports.updateStatus = async (req, res, next) => {
  try {
    const { estado, nota } = req.body;
    const ESTADOS = ['pendiente','procesando','enviado','entregado','cancelado','reembolsado'];

    if (!ESTADOS.includes(estado)) {
      return next(new AppError(`Estado inválido. Válidos: ${ESTADOS.join(', ')}`, 400));
    }

    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) return next(new AppError('Pedido no encontrado', 404));

    pedido.agregarEstado(estado, nota);
    await pedido.save();

    return successResponse(res, { message: 'Estado actualizado', data: pedido });
  } catch (err) { next(err); }
};

/**
 * PATCH /api/v1/orders/:id/pay
 */
exports.markAsPaid = async (req, res, next) => {
  try {
    const { transaccionId } = req.body;
    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) return next(new AppError('Pedido no encontrado', 404));

    await pedido.update({
      estadoPago:    'pagado',
      transaccionId,
      fechaPago:     new Date(),
      estado:        'procesando',
    });

    return successResponse(res, { message: 'Pago registrado', data: pedido });
  } catch (err) { next(err); }
};
