const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Proveedor = sequelize.define('Proveedor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre del proveedor es requerido' }
    }
  },
  contacto: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      isEmail: { msg: 'Debe proporcionar un correo electrónico válido' }
    }
  },
  direccion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tipo_insumos: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Botellas, Tapones, etc'
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
  tableName: 'PROVEEDOR',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: 'actualizado_en'
});

module.exports = Proveedor;