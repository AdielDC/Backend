const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// MARCA
const Marca = sequelize.define('Marca', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre de la marca es requerido' }
    }
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'CLIENTE',
      key: 'id'
    }
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  creado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  actualizado_en: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'MARCA',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: 'actualizado_en'
});

module.exports = Marca;