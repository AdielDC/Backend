const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const VariedadesAgave = sequelize.define('VariedadesAgave', {
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
      isIn: [['Espadín', 'Tobalá', 'Cuishe', 'Arroqueño']],
    },
  },
  region: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  creado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'VARIEDADES_AGAVE',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['nombre'] },
  ],
});

module.exports = VariedadesAgave;