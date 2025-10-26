const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  persona_contacto: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  direccion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  creado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  actualizado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
  },
}, {
  tableName: 'CLIENTE',
  timestamps: false,
});

module.exports = Cliente;