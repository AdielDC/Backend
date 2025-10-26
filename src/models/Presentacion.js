const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Presentacion = sequelize.define('Presentacion', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  volumen: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['50ml', '200ml', '375ml', '500ml', '750ml', '1000ml']],
    },
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  creado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'PRESENTACION',
  timestamps: false,
});

module.exports = Presentacion;