const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Entrega = sequelize.define('Entrega', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero_entrega: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'El número de entrega es requerido' }
    }
  },
  fecha_entrega: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La fecha de entrega es requerida' },
      isDate: { msg: 'Debe proporcionar una fecha válida' }
    }
  },
  orden_produccion: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  lote_produccion_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'LOTES_PRODUCCION',
      key: 'id'
    }
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  tableName: 'ENTREGA',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: 'actualizado_en',
  indexes: [
    {
      unique: true,
      fields: ['numero_entrega']
    },
    {
      fields: ['fecha_entrega', 'cliente_id']
    }
  ]
});

module.exports = Entrega;