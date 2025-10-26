const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CategoriaInsumo = sequelize.define('CategoriaInsumo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isIn: [['Botellas', 'Tapones', 'Cintillos', 'Sellos Térmicos', 'Etiquetas', 'Cajas']],
    },
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  unidad_medida: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['piezas', 'hojas', 'rollos', 'unidades']],
    },
  },
  creado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'CATEGORIA_INSUMO',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['nombre'] },
  ],
});

module.exports = CategoriaInsumo;