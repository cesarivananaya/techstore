'use strict';
const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const config = require('../config');

/**
 * Modelo User
 * Tabla: users
 */
class User extends Model {
  /** Verifica la contraseña contra el hash almacenado */
  async checkPassword(plain) {
    return bcrypt.compare(plain, this.password);
  }

  /** Retorna el usuario sin campos sensibles */
  toSafeJSON() {
    const { password, resetPasswordToken, resetPasswordExpire, ...safe } = this.toJSON();
    return safe;
  }
}

const initUser = (sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      nombre: {
        type: DataTypes.STRING(120),
        allowNull: false,
        validate: { notEmpty: true, len: [2, 120] },
      },
      email: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
        set(value) { this.setDataValue('email', value.toLowerCase().trim()); },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: { len: [8, 255] },
      },
      role: {
        type: DataTypes.ENUM('user', 'admin', 'vendedor'),
        defaultValue: 'user',
        allowNull: false,
      },
      telefono: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      avatar: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      verificado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      tokenVerificacion: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'token_verificacion',
      },
      tokenVerificacionExpira: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'token_verificacion_expira',
      },
      resetPasswordToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'reset_password_token',
      },
      resetPasswordExpire: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'reset_password_expire',
      },
      ultimoAcceso: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'ultimo_acceso',
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true,
      timestamps: true,
      hooks: {
        /** Hash de contraseña antes de crear o actualizar */
        beforeCreate: async (user) => {
          if (user.password) {
            // Check if password looks like a hash (starts with $2a$ or $2b$) 
            // This prevents double hashing if seed provides hashed password
            if (!user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
              const salt = await bcrypt.genSalt(config.security.bcryptRounds);
              user.password = await bcrypt.hash(user.password, salt);
            }
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed('password')) {
            const salt = await bcrypt.genSalt(config.security.bcryptRounds);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
      defaultScope: {
        attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpire'] },
      },
      scopes: {
        withPassword: {
          attributes: { include: ['password'] }, // Asegura que password vuelva
        },
      },
    }
  );

  return User;
};

module.exports = { User, initUser };
