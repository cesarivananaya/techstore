'use strict';
const { DataTypes, Model } = require('sequelize');

/**
 * Modelo Pedido
 * Tabla: pedidos
 */
class Pedido extends Model {
  /** Recalcula totales a partir de los items */
  calcularTotal() {
    const subtotal   = this.items.reduce((s, i) => s + Number(i.subtotal), 0);
    this.subtotal    = subtotal;
    this.total       = subtotal - Number(this.descuento) + Number(this.costoEnvio) + Number(this.impuestos);
  }

  /** Registra un cambio de estado en el historial */
  agregarEstado(estado, nota = '') {
    const historial = [...(this.historialEstados || [])];
    historial.push({ estado, fecha: new Date(), nota });
    this.historialEstados = historial;
    this.estado = estado;
    if (estado === 'enviado'   && !this.fechaEnvio)     this.fechaEnvio     = new Date();
    if (estado === 'entregado' && !this.fechaEntrega)   this.fechaEntrega   = new Date();
  }
}

const initPedido = (sequelize) => {
  Pedido.init(
    {
      id: {
        type:         DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey:   true,
      },
      numeroPedido: {
        type:      DataTypes.STRING(30),
        unique:    true,
        field:     'numero_pedido',
      },
      /** FK a users.id */
      userId: {
        type:      DataTypes.UUID,
        allowNull: false,
        field:     'user_id',
      },
      /**
       * Snapshot de los productos al momento de la compra
       * [{productoId, nombre, imagen, precio, cantidad, subtotal}]
       */
      items: {
        type:         DataTypes.JSONB,
        defaultValue: [],
      },
      /** Dirección completa como JSONB */
      direccionEnvio: {
        type:      DataTypes.JSONB,
        allowNull: false,
        field:     'direccion_envio',
      },
      /** Método de pago como JSONB { tipo, ultimosDigitos, marca } */
      metodoPago: {
        type:      DataTypes.JSONB,
        allowNull: false,
        field:     'metodo_pago',
      },
      subtotal: {
        type:         DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      descuento: {
        type:         DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      costoEnvio: {
        type:         DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        field:        'costo_envio',
      },
      impuestos: {
        type:         DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      total: {
        type:         DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      estado: {
        type:         DataTypes.ENUM(
          'pendiente', 'procesando', 'enviado', 'entregado', 'cancelado', 'reembolsado'
        ),
        defaultValue: 'pendiente',
      },
      estadoPago: {
        type:         DataTypes.ENUM('pendiente', 'pagado', 'fallido', 'reembolsado'),
        defaultValue: 'pendiente',
        field:        'estado_pago',
      },
      transaccionId: {
        type:      DataTypes.STRING(200),
        allowNull: true,
        field:     'transaccion_id',
      },
      /** Historial de cambios de estado [{estado, fecha, nota}] */
      historialEstados: {
        type:         DataTypes.JSONB,
        defaultValue: [],
        field:        'historial_estados',
      },
      /** Datos de rastreo { numeroGuia, paqueteria, url } */
      rastreo: {
        type:         DataTypes.JSONB,
        defaultValue: {},
      },
      fechaPago: {
        type:      DataTypes.DATE,
        allowNull: true,
        field:     'fecha_pago',
      },
      fechaEnvio: {
        type:      DataTypes.DATE,
        allowNull: true,
        field:     'fecha_envio',
      },
      fechaEntrega: {
        type:      DataTypes.DATE,
        allowNull: true,
        field:     'fecha_entrega',
      },
      notas: {
        type:      DataTypes.TEXT,
        allowNull: true,
      },
      /** Cupón aplicado { codigo, descuento } */
      cupon: {
        type:         DataTypes.JSONB,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName:  'Pedido',
      tableName:  'pedidos',
      underscored: true,
      timestamps:  true,
      hooks: {
        /** Genera número de pedido único antes de crear */
        beforeCreate: async (pedido) => {
          const now  = new Date();
          const yyyy = now.getFullYear();
          const mm   = String(now.getMonth() + 1).padStart(2, '0');
          const dd   = String(now.getDate()).padStart(2, '0');
          const rand = Math.floor(Math.random() * 9000) + 1000;
          pedido.numeroPedido = `ORD-${yyyy}${mm}${dd}-${rand}`;
        },
      },
      indexes: [
        { fields: ['user_id'] },
        { fields: ['numero_pedido'] },
        { fields: ['estado'] },
        { fields: ['created_at'] },
      ],
    }
  );

  return Pedido;
};

module.exports = { Pedido, initPedido };
