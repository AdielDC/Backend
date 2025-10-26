const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DetalleEntrega = sequelize.define('DetalleEntrega', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  entrega_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ENTREGA',
      key: 'id'
    }
  },
  inventario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'INVENTARIO',
      key: 'id'
    }
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: { args: [1], msg: 'La cantidad debe ser mayor a 0' }
    }
  },
  cantidad_desperdicio: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'La cantidad de desperdicio no puede ser negativa' }
    }
  },
  unidad: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  notas: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  creado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'DETALLE_ENTREGA',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: false,
  indexes: [
    {
      fields: ['entrega_id', 'inventario_id']
    }
  ]
});

module.exports = DetalleEntrega;