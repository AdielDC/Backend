const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LotesProduccion = sequelize.define('LotesProduccion', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  marca_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  variedad_agave_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  presentacion_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  codigo_lote: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  fecha_produccion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  botellas_producidas: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  botellas_restantes: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  proceso_añejamiento: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  meses_añejamiento: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  grados_alcohol: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['activo', 'añejando', 'completado', 'cerrado']],
    },
  },
  notas: {
    type: DataTypes.TEXT,
    allowNull: true,
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
  tableName: 'LOTES_PRODUCCION',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['codigo_lote'] },
    { fields: ['cliente_id', 'estado'] },
    { fields: ['fecha_produccion'] },
  ],
});

module.exports = LotesProduccion;