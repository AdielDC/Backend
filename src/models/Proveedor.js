const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Proveedor = sequelize.define('Proveedor', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  contacto: {
    type: DataTypes.STRING(100),
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
  direccion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tipo_insumos: {
    type: DataTypes.TEXT,
    allowNull: true,
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
  tableName: 'PROVEEDOR',
  timestamps: false,
});

module.exports = Proveedor;