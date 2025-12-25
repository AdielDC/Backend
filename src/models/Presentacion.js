const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Presentacion = sequelize.define('Presentacion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  volumen: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El volumen es requerido' }
    },
    comment: '50ml, 200ml, 375ml, 500ml, 750ml, 1000ml'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  creado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  actualizado_en: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'PRESENTACION',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: 'actualizado_en' // ✅ Ahora Sequelize manejará automáticamente este campo
});

module.exports = Presentacion;