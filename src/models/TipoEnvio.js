const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TipoEnvio = sequelize.define('TipoEnvio', {
  id_tipo_envio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['nacional', 'exportación']],
    },
  },
}, {
  tableName: 'Tipos_Envio',
  timestamps: false,
});

module.exports = TipoEnvio;