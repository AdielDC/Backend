const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cliente = require('./Cliente');
const TipoEnvio = require('./TipoEnvio');

const Insumo = sequelize.define('Insumo', {
  id_insumo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tipo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['BOTELLA 750 ML Y CAJA', 'TAPONES CONICOS NATURALES O NEGROS', 'CUERITOS NEGROS O NATURALES', 'SELLOS TERMICOS', 'ETIQUETA FRENTE EXPORTACION', 'ETIQUETA TRASERA EXPORTACION', 'STICKER PARA CAJA', 'CODIGO DE BARRAS PARA CAJAS', 'BOLSAS DE PAPEL', 'CORCHO CON TAPA NATURAL O NEGRA', 'CINTILLO', 'ETIQUETA FRENTE NACIONAL', 'ETIQUETA TRASERA NACIONAL']],
    },
  },
  variedad: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['Espadín', 'Ensamble', 'San Martín', 'Tepeztate', 'Arroqueño', 'Ensamble Madurado']],
    },
  },
  presentacion: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['50ml', '200ml', '375ml', '700ml', '750ml', '1000ml']],
    },
  },
  stock_actual: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  stock_minimo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha_vencimiento: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  atributos_adicionales: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'Insumos',
  timestamps: false,
  indexes: [
    { fields: ['id_cliente', 'tipo', 'presentacion'] },
  ],
});

Insumo.belongsTo(Cliente, {
  foreignKey: {
    name: 'id_cliente',
    allowNull: false,
  },
  onDelete: 'RESTRICT', // Evita eliminación de Cliente si hay Insumos asociados
  onUpdate: 'CASCADE',
});

Insumo.belongsTo(TipoEnvio, {
  foreignKey: {
    name: 'id_tipo_envio',
    allowNull: false,
  },
  onDelete: 'RESTRICT', // Evita eliminación de TipoEnvio si hay Insumos asociados
  onUpdate: 'CASCADE',
});

module.exports = Insumo;