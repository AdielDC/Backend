const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MovimientosInventario = sequelize.define('MovimientosInventario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  inventario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'INVENTARIO',
      key: 'id'
    }
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'USUARIO',
      key: 'id'
    }
  },
  tipo_movimiento: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: {
        args: [['entrada', 'salida', 'ajuste', 'desperdicio']],
        msg: 'El tipo de movimiento debe ser: entrada, salida, ajuste o desperdicio'
      }
    },
    comment: 'entrada, salida, ajuste, desperdicio'
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La cantidad es requerida' }
    }
  },
  stock_anterior: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  stock_nuevo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  recepcion_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'RECEPCION',
      key: 'id'
    }
  },
  entrega_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'ENTREGA',
      key: 'id'
    }
  },
  razon: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  referencia: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'número de orden, factura, etc'
  },
  fecha_movimiento: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  creado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'MOVIMIENTOS_INVENTARIO',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: false,
  indexes: [
    {
      fields: ['inventario_id', 'fecha_movimiento']
    },
    {
      fields: ['tipo_movimiento']
    },
    {
      fields: ['recepcion_id']
    },
    {
      fields: ['entrega_id']
    }
  ]
});

module.exports = MovimientosInventario;