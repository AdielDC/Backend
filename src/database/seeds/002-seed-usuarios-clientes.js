'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Hash de contraseña para usuarios de prueba
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Seed Usuarios
    await queryInterface.bulkInsert('Usuarios', [
      {
        nombre: 'Administrador Sistema',
        email: 'admin@mezcal.com',
        password: hashedPassword,
        rol: 'admin',
        activo: true,
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        nombre: 'Juan Pérez',
        email: 'juan@mezcal.com',
        password: hashedPassword,
        rol: 'operador',
        activo: true,
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        nombre: 'María González',
        email: 'maria@mezcal.com',
        password: hashedPassword,
        rol: 'visualizador',
        activo: true,
        creado_en: new Date(),
        actualizado_en: new Date()
      }
    ], {});

    // Seed Clientes
    await queryInterface.bulkInsert('Clientes', [
      {
        nombre: 'Mezcalero Artesanal',
        persona_contacto: 'Roberto Martínez',
        direccion: 'Calle Principal 123, Oaxaca',
        telefono: '951-123-4567',
        email: 'contacto@mezcaleroartesanal.com',
        activo: true,
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        nombre: 'Destilados del Valle',
        persona_contacto: 'Ana Sánchez',
        direccion: 'Av. Reforma 456, Santiago Matatlán',
        telefono: '951-234-5678',
        email: 'info@destiladosdelvalle.com',
        activo: true,
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        nombre: 'Sabores Ancestrales',
        persona_contacto: 'Carlos López',
        direccion: 'Camino Real 789, Tlacolula',
        telefono: '951-345-6789',
        email: 'ventas@saboresancestrales.com',
        activo: true,
        creado_en: new Date(),
        actualizado_en: new Date()
      }
    ], {});

    // Seed Proveedores
    await queryInterface.bulkInsert('Proveedores', [
      {
        nombre: 'Vidriera Mexicana',
        contacto: 'Pedro Ramírez',
        telefono: '55-1234-5678',
        email: 'ventas@vidrieramexicana.com',
        direccion: 'Zona Industrial, Ciudad de México',
        tipo_insumos: 'Botellas de vidrio',
        activo: true,
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        nombre: 'Vidriera Premium',
        contacto: 'Laura Torres',
        telefono: '55-2345-6789',
        email: 'contacto@vidrerapremium.com',
        direccion: 'Parque Industrial Norte, Monterrey',
        tipo_insumos: 'Botellas de exportación',
        activo: true,
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        nombre: 'Corchos Oaxaca',
        contacto: 'Miguel Hernández',
        telefono: '951-456-7890',
        email: 'info@corchosoaxaca.com',
        direccion: 'Centro, Oaxaca de Juárez',
        tipo_insumos: 'Tapones de corcho',
        activo: true,
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        nombre: 'Etiquetas del Sur',
        contacto: 'Sofia Morales',
        telefono: '951-567-8901',
        email: 'ventas@etiquetasdelsur.com',
        direccion: 'Col. Reforma, Oaxaca',
        tipo_insumos: 'Etiquetas y cintillos',
        activo: true,
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        nombre: 'Sellos Premium',
        contacto: 'Jorge Castro',
        telefono: '33-1234-5678',
        email: 'contacto@sellospremium.com',
        direccion: 'Guadalajara, Jalisco',
        tipo_insumos: 'Sellos térmicos',
        activo: true,
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        nombre: 'Gráficas Modernas',
        contacto: 'Diana Ruiz',
        telefono: '951-678-9012',
        email: 'info@graficasmodernas.com',
        direccion: 'Santa María Atzompa, Oaxaca',
        tipo_insumos: 'Etiquetas impresas',
        activo: true,
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        nombre: 'Empaques Ecológicos',
        contacto: 'Ricardo Flores',
        telefono: '951-789-0123',
        email: 'ventas@empaquesecologicos.com',
        direccion: 'Zona Industrial, Oaxaca',
        tipo_insumos: 'Cajas de cartón',
        activo: true,
        creado_en: new Date(),
        actualizado_en: new Date()
      }
    ], {});

    // Seed Marcas (dependientes de Clientes)
    await queryInterface.bulkInsert('Marcas', [
      {
        nombre: 'Don Aurelio',
        descripcion: 'Mezcal artesanal de alta calidad',
        cliente_id: 1, // Mezcalero Artesanal
        activo: true,
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        nombre: 'Valle Sagrado',
        descripcion: 'Mezcal premium de los valles centrales',
        cliente_id: 2, // Destilados del Valle
        activo: true,
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        nombre: 'Ancestral',
        descripcion: 'Mezcal tradicional de Oaxaca',
        cliente_id: 3, // Sabores Ancestrales
        activo: true,
        creado_en: new Date(),
        actualizado_en: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Marcas', null, {});
    await queryInterface.bulkDelete('Proveedores', null, {});
    await queryInterface.bulkDelete('Clientes', null, {});
    await queryInterface.bulkDelete('Usuarios', null, {});
  }
};