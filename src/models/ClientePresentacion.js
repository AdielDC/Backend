// models/ClientePresentacion.js
// Modelo para la relación Cliente-Presentación

module.exports = (sequelize, DataTypes) => {
  const ClientePresentacion = sequelize.define('ClientePresentacion', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'CLIENTE',
        key: 'id'
      }
    },
    presentacion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'PRESENTACION',
        key: 'id'
      }
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    creado_en: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'CLIENTE_PRESENTACION',
    timestamps: false,
    indexes: [
      {
        unique: true,
        name: 'uk_cli_pres',  // ← Nombre corto para el índice
        fields: ['cliente_id', 'presentacion_id']
      }
    ]
  });

  ClientePresentacion.associate = (models) => {
    ClientePresentacion.belongsTo(models.Cliente, {
      foreignKey: 'cliente_id',
      as: 'cliente'
    });
    ClientePresentacion.belongsTo(models.Presentacion, {
      foreignKey: 'presentacion_id',
      as: 'presentacion'
    });
  };

  return ClientePresentacion;
};