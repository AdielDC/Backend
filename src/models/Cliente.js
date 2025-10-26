const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre del cliente es requerido' },
      len: { args: [2, 100], msg: 'El nombre debe tener entre 2 y 100 caracteres' }
    }
  },
  persona_contacto: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      len: { args: [0, 100], msg: 'El nombre de contacto no debe exceder 100 caracteres' }
    }
  },
  direccion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      len: { args: [0, 20], msg: 'El teléfono no debe exceder 20 caracteres' }
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      isEmail: { msg: 'Debe proporcionar un correo electrónico válido' }
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
  tableName: 'CLIENTE',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: 'actualizado_en'
});

module.exports = Cliente;