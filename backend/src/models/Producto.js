'use strict';
const { DataTypes, Model, Op } = require('sequelize');

/**
 * Modelo Producto
 * Tabla: productos
 */
class Producto extends Model {
  /** ¿Hay suficiente stock? */
  tieneStock(cantidad = 1) {
    return this.stock >= cantidad;
  }

  /** Reduce el stock y aumenta vendidos */
  async reducirStock(cantidad) {
    if (!this.tieneStock(cantidad)) throw new Error('Stock insuficiente');
    this.stock    -= cantidad;
    this.vendidos += cantidad;
    await this.save();
  }

  /** Incrementa el contador de vistas */
  async incrementarVistas() {
    await this.increment('vistas');
  }
}

const initProducto = (sequelize) => {
  Producto.init(
    {
      id: {
        type:         DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey:   true,
      },
      nombre: {
        type:      DataTypes.STRING(200),
        allowNull: false,
        validate:  { notEmpty: true, len: [2, 200] },
      },
      slug: {
        type:   DataTypes.STRING(250),
        unique: true,
      },
      descripcion: {
        type:      DataTypes.TEXT,
        allowNull: false,
      },
      precio: {
        type:      DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate:  { min: 0 },
      },
      precioAnterior: {
        type:      DataTypes.DECIMAL(10, 2),
        allowNull: true,
        field:     'precio_anterior',
      },
      descuento: {
        type:         DataTypes.INTEGER,
        defaultValue: 0,
        validate:     { min: 0, max: 100 },
      },
      categoria: {
        type:      DataTypes.ENUM(
          'smartphones', 'laptops', 'tablets', 'audio',
          'wearables', 'camaras', 'accesorios', 'hogar', 'gaming'
        ),
        allowNull: false,
      },
      subcategoria: {
        type:      DataTypes.STRING(100),
        allowNull: true,
      },
      marca: {
        type:      DataTypes.STRING(100),
        allowNull: false,
      },
      modelo: {
        type:      DataTypes.STRING(100),
        allowNull: true,
      },
      sku: {
        type:      DataTypes.STRING(100),
        allowNull: false,
        unique:    true,
      },
      stock: {
        type:         DataTypes.INTEGER,
        defaultValue: 0,
        validate:     { min: 0 },
      },
      stockMinimo: {
        type:         DataTypes.INTEGER,
        defaultValue: 5,
        field:        'stock_minimo',
      },
      /** JSONB nativo de PostgreSQL para especificaciones dinámicas */
      especificaciones: {
        type:         DataTypes.JSONB,
        defaultValue: {},
      },
      /** Array de objetos: [{ url, alt, esPrincipal }] */
      imagenes: {
        type:         DataTypes.JSONB,
        defaultValue: [],
      },
      /** Array de strings */
      caracteristicas: {
        type:         DataTypes.ARRAY(DataTypes.TEXT),
        defaultValue: [],
      },
      etiquetas: {
        type:         DataTypes.ARRAY(DataTypes.TEXT),
        defaultValue: [],
      },
      /** JSONB: { duracion, unidad, descripcion } */
      garantia: {
        type:         DataTypes.JSONB,
        defaultValue: {},
      },
      /** JSONB: { valor, unidad } */
      peso: {
        type:         DataTypes.JSONB,
        defaultValue: {},
      },
      /** JSONB: { largo, ancho, alto, unidad } */
      dimensiones: {
        type:         DataTypes.JSONB,
        defaultValue: {},
      },
      ratingPromedio: {
        type:         DataTypes.DECIMAL(3, 2),
        defaultValue: 0,
        field:        'rating_promedio',
      },
      ratingCantidad: {
        type:         DataTypes.INTEGER,
        defaultValue: 0,
        field:        'rating_cantidad',
      },
      destacado: {
        type:         DataTypes.BOOLEAN,
        defaultValue: false,
      },
      nuevo: {
        type:         DataTypes.BOOLEAN,
        defaultValue: true,
      },
      activo: {
        type:         DataTypes.BOOLEAN,
        defaultValue: true,
      },
      vendidos: {
        type:         DataTypes.INTEGER,
        defaultValue: 0,
      },
      vistas: {
        type:         DataTypes.INTEGER,
        defaultValue: 0,
      },
      /** JSONB: { titulo, descripcion, keywords } */
      metaData: {
        type:         DataTypes.JSONB,
        defaultValue: {},
        field:        'meta_data',
      },
    },
    {
      sequelize,
      modelName:  'Producto',
      tableName:  'productos',
      underscored: true,
      timestamps:  true,
      hooks: {
        /** Genera slug automáticamente */
        beforeCreate(producto) { producto.slug = generarSlug(producto.nombre, producto.id); },
        beforeUpdate(producto) {
          if (producto.changed('nombre')) {
            producto.slug = generarSlug(producto.nombre, producto.id);
          }
          /** Recalcula descuento */
          if (producto.precioAnterior && producto.precio) {
            producto.descuento = Math.round(
              ((producto.precioAnterior - producto.precio) / producto.precioAnterior) * 100
            );
          }
        },
      },
      indexes: [
        { fields: ['slug'] },
        { fields: ['sku'] },
        { fields: ['categoria', 'activo'] },
        { fields: ['destacado', 'activo'] },
      ],
    }
  );

  return Producto;
};

/** Genera slug a partir del nombre */
function generarSlug(nombre, id) {
  const base = nombre
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return `${base}-${id ? id.slice(0, 8) : Date.now()}`;
}

module.exports = { Producto, initProducto };
