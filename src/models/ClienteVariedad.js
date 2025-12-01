// models/ClienteVariedad.js
// Modelo para la relación Cliente-Variedad de Agave

module.exports = (sequelize, DataTypes) => {
  const ClienteVariedad = sequelize.define('ClienteVariedad', {
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
    variedad_agave_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'VARIEDADES_AGAVE',
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
    tableName: 'CLIENTE_VARIEDAD',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['cliente_id', 'variedad_agave_id']
      }
    ]
  });

  ClienteVariedad.associate = (models) => {
    ClienteVariedad.belongsTo(models.Cliente, {
      foreignKey: 'cliente_id',
      as: 'cliente'
    });
    ClienteVariedad.belongsTo(models.VariedadAgave, {
      foreignKey: 'variedad_agave_id',
      as: 'variedad'
    });
  };

  return ClienteVariedad;
};