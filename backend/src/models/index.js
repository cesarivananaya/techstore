'use strict';
const { sequelize }          = require('../config/database');
const { User,     initUser }     = require('./User');
const { Producto, initProducto } = require('./Producto');
const { Pedido,   initPedido }   = require('./Pedido');

// ── Inicializar modelos ──────────────────────────────────────────────────────
initUser(sequelize);
initProducto(sequelize);
initPedido(sequelize);

// ── Asociaciones ─────────────────────────────────────────────────────────────
// Un usuario tiene muchos pedidos
User.hasMany(Pedido, { foreignKey: 'userId', as: 'pedidos' });
Pedido.belongsTo(User, { foreignKey: 'userId', as: 'usuario' });

// ── Exportar modelos y la instancia de Sequelize ─────────────────────────────
module.exports = {
  sequelize,
  User,
  Producto,
  Pedido,
};
