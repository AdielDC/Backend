const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AlertasInventario = sequelize.define('AlertasInventario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  inventario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tipo_alerta: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['stock_bajo', 'stock_critico']],
    },
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fecha_alerta: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  vista: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  resuelta: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  resuelta_por: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  fecha_resolucion: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'ALERTAS_INVENTARIO',
  timestamps: false,
  indexes: [
    { fields: ['inventario_id', 'vista'] },
    { fields: ['fecha_alerta'] },
  ],
});

module.exports = AlertasInventario;