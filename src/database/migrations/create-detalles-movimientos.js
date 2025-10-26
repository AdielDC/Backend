// database/migrations/20240101000006-create-detalles-movimientos.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Tabla Detalles de Recepción
    await queryInterface.createTable('DetallesRecepcion', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      recepcionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'recepcion_id',
        references: {
          model: 'Recepciones',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      inventarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'inventario_id',
        references: {
          model: 'Inventarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      unidad: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      notas: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'creado_en'
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'actualizado_en'
      }
    });

    // Tabla Detalles de Entrega
    await queryInterface.createTable('DetallesEntrega', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      entregaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'entrega_id',
        references: {
          model: 'Entregas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      inventarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'inventario_id',
        references: {
          model: 'Inventarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      cantidadDesperdicio: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'cantidad_desperdicio'
      },
      unidad: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      notas: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'creado_en'
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'actualizado_en'
      }
    });

    // Tabla Movimientos de Inventario
    await queryInterface.createTable('MovimientosInventario', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      inventarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'inventario_id',
        references: {
          model: 'Inventarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'usuario_id',
        references: {
          model: 'Usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      tipoMovimiento: {
        type: Sequelize.ENUM('entrada', 'salida', 'ajuste', 'desperdicio'),
        allowNull: false,
        field: 'tipo_movimiento'
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      stockAnterior: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'stock_anterior'
      },
      stockNuevo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'stock_nuevo'
      },
      recepcionId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'recepcion_id',
        references: {
          model: 'Recepciones',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      entregaId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'entrega_id',
        references: {
          model: 'Entregas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      razon: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      referencia: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      fechaMovimiento: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'fecha_movimiento'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'creado_en'
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'actualizado_en'
      }
    });

    // Tabla Alertas de Inventario
    await queryInterface.createTable('AlertasInventario', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      inventarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'inventario_id',
        references: {
          model: 'Inventarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tipoAlerta: {
        type: Sequelize.ENUM('stock_bajo', 'stock_critico'),
        allowNull: false,
        field: 'tipo_alerta'
      },
      mensaje: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      fechaAlerta: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'fecha_alerta'
      },
      vista: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      resuelta: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      resueltaPor: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'resuelta_por',
        references: {
          model: 'Usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      fechaResolucion: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'fecha_resolucion'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'creado_en'
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'actualizado_en'
      }
    });

    // Índices para DetallesRecepcion
    await queryInterface.addIndex('DetallesRecepcion', ['recepcion_id', 'inventario_id']);
    
    // Índices para DetallesEntrega
    await queryInterface.addIndex('DetallesEntrega', ['entrega_id', 'inventario_id']);
    
    // Índices para MovimientosInventario
    await queryInterface.addIndex('MovimientosInventario', ['inventario_id', 'fecha_movimiento']);
    await queryInterface.addIndex('MovimientosInventario', ['tipo_movimiento']);
    await queryInterface.addIndex('MovimientosInventario', ['recepcion_id']);
    await queryInterface.addIndex('MovimientosInventario', ['entrega_id']);
    
    // Índices para AlertasInventario
    await queryInterface.addIndex('AlertasInventario', ['inventario_id', 'vista']);
    await queryInterface.addIndex('AlertasInventario', ['fecha_alerta']);
    await queryInterface.addIndex('AlertasInventario', ['resuelta']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AlertasInventario');
    await queryInterface.dropTable('MovimientosInventario');
    await queryInterface.dropTable('DetallesEntrega');
    await queryInterface.dropTable('DetallesRecepcion');
  }
};