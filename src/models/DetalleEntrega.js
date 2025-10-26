const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DetalleEntrega = sequelize.define('DetalleEntrega', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  entrega_id: {
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
  cantidad_desperdicio: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
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
  tableName: 'DETALLE_ENTREGA',
  timestamps: false,
  indexes: [
    { fields: ['entrega_id', 'inventario_id'] },
  ],
});

module.exports = DetalleEntrega;