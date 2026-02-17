'use strict';
const Joi = require('joi');

/**
 * Middleware genérico que valida req.body contra un schema Joi
 */
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (!error) return next();

  const errors = error.details.map((d) => d.message);
  return res.status(422).json({ success: false, message: 'Datos inválidos', errors });
};

// ── Auth ─────────────────────────────────────────────────────────────────────

const registerSchema = Joi.object({
  nombre:   Joi.string().min(2).max(120).required().messages({
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'any.required': 'El nombre es obligatorio',
  }),
  email:    Joi.string().email().required().messages({
    'string.email': 'Email inválido',
    'any.required': 'El email es obligatorio',
  }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min':     'La contraseña debe tener al menos 8 caracteres',
      'string.pattern.base': 'Debe incluir mayúscula, minúscula y número',
      'any.required':   'La contraseña es obligatoria',
    }),
  telefono: Joi.string().optional().allow(''),
});

const loginSchema = Joi.object({
  email:    Joi.string().email().required(),
  password: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required(),
});

// ── Productos ─────────────────────────────────────────────────────────────────

const CATEGORIAS_VALIDAS = [
  'smartphones', 'laptops', 'tablets', 'audio',
  'wearables', 'camaras', 'accesorios', 'hogar', 'gaming',
];

const productoSchema = Joi.object({
  nombre:          Joi.string().min(2).max(200).required(),
  descripcion:     Joi.string().min(10).required(),
  precio:          Joi.number().positive().required(),
  precioAnterior:  Joi.number().positive().optional(),
  categoria:       Joi.string().valid(...CATEGORIAS_VALIDAS).required(),
  subcategoria:    Joi.string().optional().allow(''),
  marca:           Joi.string().required(),
  modelo:          Joi.string().optional().allow(''),
  sku:             Joi.string().required(),
  stock:           Joi.number().integer().min(0).required(),
  stockMinimo:     Joi.number().integer().min(0).optional(),
  especificaciones: Joi.object().optional(),
  imagenes:        Joi.array().items(
    Joi.object({ url: Joi.string().uri().required(), alt: Joi.string().optional(), esPrincipal: Joi.boolean().optional() })
  ).optional(),
  caracteristicas: Joi.array().items(Joi.string()).optional(),
  etiquetas:       Joi.array().items(Joi.string()).optional(),
  destacado:       Joi.boolean().optional(),
  nuevo:           Joi.boolean().optional(),
});

// ── Pedidos ─────────────────────────────────────────────────────────────────

const pedidoSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({
      productoId: Joi.string().uuid().required(),
      cantidad:   Joi.number().integer().min(1).required(),
    })
  ).min(1).required(),
  direccionEnvio: Joi.object({
    nombreCompleto: Joi.string().required(),
    telefono:       Joi.string().required(),
    calle:          Joi.string().required(),
    numero:         Joi.string().optional().allow(''),
    colonia:        Joi.string().optional().allow(''),
    ciudad:         Joi.string().required(),
    estado:         Joi.string().required(),
    codigoPostal:   Joi.string().required(),
    pais:           Joi.string().optional(),
    referencias:    Joi.string().optional().allow(''),
  }).required(),
  metodoPago: Joi.object({
    tipo: Joi.string().valid('tarjeta', 'paypal', 'oxxo', 'transferencia').required(),
    ultimosDigitos: Joi.string().optional(),
    marca:          Joi.string().optional(),
  }).required(),
  cupon: Joi.string().optional().allow(''),
});

module.exports = {
  validate,
  schemas: {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    productoSchema,
    pedidoSchema,
  },
};
