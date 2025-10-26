const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Inventario = sequelize.define('Inventario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  categoria_insumo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'CATEGORIA_INSUMO',
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
  marca_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'MARCA',
      key: 'id'
    }
  },
  variedad_agave_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'VARIEDADES_AGAVE',
      key: 'id'
    }
  },
  presentacion_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'PRESENTACION',
      key: 'id'
    }
  },
  proveedor_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'PROVEEDOR',
      key: 'id'
    }
  },
  tipo: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      isIn: {
        args: [['Nacional', 'Exportación']],
        msg: 'El tipo debe ser Nacional o Exportación'
      }
    },
    comment: 'Nacional, Exportación'
  },
  codigo_lote: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'El código de lote es requerido' }
    }
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'El stock no puede ser negativo' }
    }
  },
  stock_minimo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: { args: [0], msg: 'El stock mínimo no puede ser negativo' }
    }
  },
  unidad: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'piezas, hojas, rollos, unidades'
  },
  ultima_actualizacion: {
    type: DataTypes.DATEONLY,
    allowNull: true
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
  tableName: 'INVENTARIO',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: 'actualizado_en',
  indexes: [
    {
      fields: ['cliente_id', 'categoria_insumo_id']
    },
    {
      unique: true,
      fields: ['codigo_lote']
    },
    {
      fields: ['marca_id', 'variedad_agave_id', 'presentacion_id']
    }
  ],
  hooks: {
    beforeUpdate: (inventario) => {
      if (inventario.changed('stock')) {
        inventario.ultima_actualizacion = new Date();
      }
    }
  }
});

module.exports = Inventario;