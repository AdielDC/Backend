const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DetalleRecepcion = sequelize.define('DetalleRecepcion', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  recepcion_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  inventario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unidad: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  notas: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  creado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'DETALLE_RECEPCION',
  timestamps: false,
  indexes: [
    { fields: ['recepcion_id', 'inventario_id'] },
  ],
});

module.exports = DetalleRecepcion;