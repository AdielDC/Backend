const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Entrega = sequelize.define('Entrega', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  numero_entrega: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  fecha_entrega: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  orden_produccion: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  lote_produccion_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
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
  tableName: 'ENTREGA',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['numero_entrega'] },
    { fields: ['fecha_entrega', 'cliente_id'] },
  ],
});

module.exports = Entrega;