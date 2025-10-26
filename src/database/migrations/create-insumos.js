// database/migrations/YYYYMMDDHHMMSS-create-insumos.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Insumos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      category: {
        type: Sequelize.ENUM('Botellas', 'Tapones', 'Cintillos', 'Sellos Térmicos', 'Etiquetas', 'Cajas'),
        allowNull: false
      },
      client: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      brand: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      variety: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      presentation: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('Nacional', 'Exportación'),
        allowNull: false
      },
      batch: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      minStock: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      unit: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      supplier: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      lastUpdate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Índices para mejorar las consultas
    await queryInterface.addIndex('Insumos', ['category']);
    await queryInterface.addIndex('Insumos', ['client']);
    await queryInterface.addIndex('Insumos', ['brand']);
    await queryInterface.addIndex('Insumos', ['batch']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Insumos');
  }
};