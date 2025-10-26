const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CategoriaInsumo = sequelize.define('CategoriaInsumo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'El nombre de la categoría es requerido' }
    },
    comment: 'Botellas, Tapones, Cintillos, Sellos Térmicos, Etiquetas, Cajas'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  unidad_medida: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'piezas, hojas, rollos, unidades'
  },
  creado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'CATEGORIA_INSUMO',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: false,
  indexes: [
    {
      unique: true,
      fields: ['nombre']
    }
  ]
});

module.exports = CategoriaInsumo;