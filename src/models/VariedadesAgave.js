const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const VariedadesAgave = sequelize.define('VariedadesAgave', {
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
      notEmpty: { msg: 'El nombre de la variedad es requerido' }
    },
    comment: 'Espadín, Tobalá, Cuishe, Arroqueño, etc'
  },
  region: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  creado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  actualizado_en: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'VARIEDADES_AGAVE',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: 'actualizado_en', // ✅ Cambiado de false a 'actualizado_en'
  indexes: [
    {
      unique: true,
      fields: ['nombre']
    }
  ]
});

module.exports = VariedadesAgave;