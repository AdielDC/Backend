// database/seeds/20240101000001-seed-catalogos.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Seed Categorías de Insumo
    await queryInterface.bulkInsert('CategoriasInsumo', [
      {
        nombre: 'Botellas',
        descripcion: 'Botellas de vidrio para envasado de mezcal',
        unidad_medida: 'piezas',
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        nombre: 'Tapones',
        descripcion: 'Tapones de corcho y sintéticos',
        unidad_medida: 'piezas',
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        nombre: 'Cintillos',
        descripcion: 'Cintillos de seguridad para botellas',
        unidad_medida: 'piezas',
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        nombre: 'Sellos Térmicos',
        descripcion: 'Sellos térmicos retráctiles',
        unidad_medida: 'piezas',
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        nombre: 'Etiquetas',
        descripcion: 'Etiquetas adhesivas y de papel',
        unidad_medida: 'piezas',
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        nombre: 'Cajas',
        descripcion: 'Cajas de cartón para empaque',
        unidad_medida: 'piezas',
        creado_en: new Date(),
        actualizado_en: new Date()
      }
    ], {});

    // Seed Presentaciones
    await queryInterface.bulkInsert('Presentaciones', [
      {
        volumen: '50ml',
        descripcion: 'Presentación miniatura',
        activo: true,
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        volumen: '200ml',
        descripcion: 'Presentación pequeña',
        activo: true,
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        volumen: '375ml',
        descripcion: 'Media botella',
        activo: true,
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        volumen: '500ml',
        descripcion: 'Medio litro',
        activo: true,
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        volumen: '750ml',
        descripcion: 'Botella estándar',
        activo: true,
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        volumen: '1000ml',
        descripcion: 'Litro completo',
        activo: true,
        creado_en: new Date(),
        actualizado_en: new Date()
      }
    ], {});

    // Seed Variedades de Agave
    await queryInterface.bulkInsert('VariedadesAgave', [
      {
        nombre: 'Espadín',
        region: 'Valles Centrales',
        descripcion: 'Variedad más común, representa el 90% de la producción',
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        nombre: 'Tobalá',
        region: 'Sierra Sur',
        descripcion: 'Agave silvestre de alto valor, sabor complejo',
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        nombre: 'Cuishe',
        region: 'Valles Centrales',
        descripcion: 'Agave silvestre con notas herbales',
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        nombre: 'Arroqueño',
        region: 'Sierra Sur',
        descripcion: 'Agave silvestre de gran tamaño, sabor robusto',
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        nombre: 'Tepeztate',
        region: 'Sierra Mixe',
        descripcion: 'Agave silvestre raro, tarda 25 años en madurar',
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        nombre: 'Madrecuixe',
        region: 'Valles Centrales',
        descripcion: 'Agave silvestre con sabor intenso',
        creado_en: new Date(),
        actualizado_en: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('VariedadesAgave', null, {});
    await queryInterface.bulkDelete('Presentaciones', null, {});
    await queryInterface.bulkDelete('CategoriasInsumo', null, {});
  }
};