// models/ClienteTipo.js
// Modelo para la relación Cliente-Tipo (Nacional/Exportación)

module.exports = (sequelize, DataTypes) => {
  const ClienteTipo = sequelize.define('ClienteTipo', {
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
    tipo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [['Nacional', 'Exportación']]
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
    tableName: 'CLIENTE_TIPO',
    timestamps: false,
    indexes: [
      {
        unique: true,
        name: 'uk_cli_tipo',  // ← Nombre corto para el índice
        fields: ['cliente_id', 'tipo']
      }
    ]
  });

  ClienteTipo.associate = (models) => {
    ClienteTipo.belongsTo(models.Cliente, {
      foreignKey: 'cliente_id',
      as: 'cliente'
    });
  };

  return ClienteTipo;
};