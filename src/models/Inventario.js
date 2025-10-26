const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Inventario = sequelize.define('Inventario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  categoria_insumo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  proveedor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['Nacional', 'Exportación']],
    },
  },
  codigo_lote: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  stock_minimo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unidad: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['piezas', 'hojas', 'rollos', 'unidades']],
    },
  },
  ultima_actualizacion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
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
  tableName: 'INVENTARIO',
  timestamps: false,
  indexes: [
    { fields: ['cliente_id', 'categoria_insumo_id'] },
    { unique: true, fields: ['codigo_lote'] },
    { fields: ['marca_id', 'variedad_agave_id', 'presentacion_id'] },
  ],
});

module.exports = Inventario;