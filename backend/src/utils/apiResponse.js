'use strict';

/**
 * Respuesta exitosa
 */
const successResponse = (res, { statusCode = 200, message = 'OK', data = null, meta = null }) => {
  const body = { success: true, message };
  if (data !== null) body.data = data;
  if (meta !== null) body.meta = meta;
  return res.status(statusCode).json(body);
};

/**
 * Respuesta de error
 */
const errorResponse = (res, { statusCode = 500, message = 'Error interno', errors = null }) => {
  const body = { success: false, message };
  if (errors !== null) body.errors = errors;
  return res.status(statusCode).json(body);
};

/**
 * Respuesta paginada
 */
const paginatedResponse = (res, { data, total, page, limit }) => {
  return res.status(200).json({
    success: true,
    data,
    meta: {
      total,
      page:       parseInt(page),
      limit:      parseInt(limit),
      totalPages: Math.ceil(total / limit),
      hasNext:    page * limit < total,
      hasPrev:    page > 1,
    },
  });
};

module.exports = { successResponse, errorResponse, paginatedResponse };
