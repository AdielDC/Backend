const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Recepcion = sequelize.define('Recepcion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero_recepcion: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'El número de recepción es requerido' }
    }
  },
  fecha_recepcion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La fecha de recepción es requerida' },
      isDate: { msg: 'Debe proporcionar una fecha válida' }
    }
  },
  orden_compra: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  factura: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  proveedor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'PROVEEDOR',
      key: 'id'
    }
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'CLIENTE',
      key: 'id'
    }
  },
  entregado_por: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  recibido_por: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  notas_adicionales: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING(50),
    defaultValue: 'pendiente',
    validate: {
      isIn: {
        args: [['pendiente', 'completado', 'cancelado']],
        msg: 'El estado debe ser: pendiente, completado o cancelado'
      }
    },
    comment: 'pendiente, completado, cancelado'
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'USUARIO',
      key: 'id'
    }
  },
  creado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  actualizado_en: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'RECEPCION',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: 'actualizado_en',
  indexes: [
    {
      unique: true,
      fields: ['numero_recepcion']
    },
    {
      fields: ['fecha_recepcion', 'cliente_id']
    }
  ]
});

module.exports = Recepcion;