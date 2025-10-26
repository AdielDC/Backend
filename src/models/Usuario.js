const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre es requerido' },
      len: { args: [2, 100], msg: 'El nombre debe tener entre 2 y 100 caracteres' }
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
      msg: 'Este correo electrónico ya está registrado'
    },
    validate: {
      isEmail: { msg: 'Debe proporcionar un correo electrónico válido' },
      notEmpty: { msg: 'El correo electrónico es requerido' }
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La contraseña es requerida' },
      len: { args: [6, 255], msg: 'La contraseña debe tener al menos 6 caracteres' }
    }
  },
  rol: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'visualizador',
    validate: {
      isIn: {
        args: [['admin', 'operador', 'visualizador']],
        msg: 'El rol debe ser: admin, operador o visualizador'
      }
    },
    comment: 'admin, operador, visualizador'
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
  tableName: 'USUARIO',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: 'actualizado_en',
  hooks: {
    beforeCreate: async (usuario) => {
      if (usuario.password) {
        usuario.password = await bcrypt.hash(usuario.password, 10);
      }
    },
    beforeUpdate: async (usuario) => {
      if (usuario.changed('password')) {
        usuario.password = await bcrypt.hash(usuario.password, 10);
      }
    }
  }
});

// Método de instancia para validar contraseña
Usuario.prototype.validarPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Método de instancia para ocultar la contraseña en respuestas JSON
Usuario.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = Usuario;