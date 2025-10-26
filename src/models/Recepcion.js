const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Recepcion = sequelize.define('Recepcion', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  numero_recepcion: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  fecha_recepcion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  orden_compra: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  factura: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  proveedor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  entregado_por: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  recibido_por: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  notas_adicionales: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  estado: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['pendiente', 'completado', 'cancelado']],
    },
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  tableName: 'RECEPCION',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['numero_recepcion'] },
    { fields: ['fecha_recepcion', 'cliente_id'] },
  ],
});

module.exports = Recepcion;