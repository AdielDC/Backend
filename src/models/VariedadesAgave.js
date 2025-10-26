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
  creado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'VARIEDADES_AGAVE',
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


module.exports = VariedadesAgave;