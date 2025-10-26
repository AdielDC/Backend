const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DetalleRecepcion = sequelize.define('DetalleRecepcion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  recepcion_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'RECEPCION',
      key: 'id'
    }
  },
  inventario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'INVENTARIO',
      key: 'id'
    }
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: { args: [1], msg: 'La cantidad debe ser mayor a 0' }
    }
  },
  unidad: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  notas: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  creado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'DETALLE_RECEPCION',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: false,
  indexes: [
    {
      fields: ['recepcion_id', 'inventario_id']
    }
  ]
});

module.exports = DetalleRecepcion;