const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Marca = sequelize.define('Marca', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  cliente_id: {
    type: DataTypes.INTEGER,
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
  tableName: 'MARCA',
  timestamps: false,
});

module.exports = Marca;