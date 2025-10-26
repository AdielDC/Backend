const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MovimientosInventario = sequelize.define('MovimientosInventario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  inventario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tipo_movimiento: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['entrada', 'salida', 'ajuste', 'desperdicio']],
    },
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  stock_anterior: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  stock_nuevo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  recepcion_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  entrega_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  razon: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  referencia: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  fecha_movimiento: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  creado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'MOVIMIENTOS_INVENTARIO',
  timestamps: false,
  indexes: [
    { fields: ['inventario_id', 'fecha_movimiento'] },
    { fields: ['tipo_movimiento'] },
    { fields: ['recepcion_id'] },
    { fields: ['entrega_id'] },
  ],
});

module.exports = MovimientosInventario;