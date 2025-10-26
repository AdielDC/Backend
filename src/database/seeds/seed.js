const { sequelize } = require('../../config/database');
const {
  Usuario,
  Cliente,
  Marca,
  Presentacion,
  CategoriaInsumo,
  VariedadesAgave,
  Proveedor,
  Inventario
} = require('./models');

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seed de base de datos...');

    // Limpiar tablas (opcional, comentar si no quieres eliminar datos existentes)
    // await sequelize.sync({ force: true });

    // ==================== USUARIOS ====================
    console.log('👤 Creando usuarios...');
    const usuarios = await Usuario.bulkCreate([
      {
        nombre: 'Admin Principal',
        email: 'admin@envasadora.com',
        password: 'admin123',
        rol: 'admin'
      },
      {
        nombre: 'Operador 1',
        email: 'operador@envasadora.com',
        password: 'operador123',
        rol: 'operador'
      },
      {
        nombre: 'Visualizador',
        email: 'visualizador@envasadora.com',
        password: 'visual123',
        rol: 'visualizador'
      }
    ]);
    console.log(`✅ ${usuarios.length} usuarios creados`);

    // ==================== CLIENTES ====================
    console.log('🏢 Creando clientes...');
    const clientes = await Cliente.bulkCreate([
      {
        nombre: 'Mezcalero Artesanal',
        persona_contacto: 'Juan Pérez',
        direccion: 'Oaxaca Centro, Oaxaca',
        telefono: '951-123-4567',
        email: 'contacto@mezcalero.com'
      },
      {
        nombre: 'Destilados del Valle',
        persona_contacto: 'María García',
        direccion: 'Tlacolula, Oaxaca',
        telefono: '951-234-5678',
        email: 'info@destiladosvalle.com'
      },
      {
        nombre: 'Sabores Ancestrales',
        persona_contacto: 'Carlos López',
        direccion: 'Santiago Matatlán, Oaxaca',
        telefono: '951-345-6789',
        email: 'ventas@saboresancestrales.com'
      },
      {
        nombre: 'The Producer',
        persona_contacto: 'Ana Martínez',
        direccion: 'San Pablo Villa de Mitla, Oaxaca',
        telefono: '951-456-7890',
        email: 'producer@example.com'
      }
    ]);
    console.log(`✅ ${clientes.length} clientes creados`);

    // ==================== MARCAS ====================
    console.log('🏷️ Creando marcas...');
    const marcas = await Marca.bulkCreate([
      {
        nombre: 'Don Aurelio',
        descripcion: 'Mezcal tradicional de Oaxaca',
        cliente_id: clientes[0].id
      },
      {
        nombre: 'Valle Sagrado',
        descripcion: 'Mezcales premium del Valle de Tlacolula',
        cliente_id: clientes[1].id
      },
      {
        nombre: 'Ancestral',
        descripcion: 'Proceso ancestral de elaboración',
        cliente_id: clientes[2].id
      }
    ]);
    console.log(`✅ ${marcas.length} marcas creadas`);

    // ==================== PRESENTACIONES ====================
    console.log('📏 Creando presentaciones...');
    const presentaciones = await Presentacion.bulkCreate([
      { volumen: '50ml', descripcion: 'Miniatura' },
      { volumen: '200ml', descripcion: 'Media botella' },
      { volumen: '375ml', descripcion: 'Botella pequeña' },
      { volumen: '500ml', descripcion: 'Botella estándar pequeña' },
      { volumen: '750ml', descripcion: 'Botella estándar' },
      { volumen: '1000ml', descripcion: 'Botella grande' }
    ]);
    console.log(`✅ ${presentaciones.length} presentaciones creadas`);

    // ==================== CATEGORÍAS DE INSUMOS ====================
    console.log('📦 Creando categorías de insumos...');
    const categorias = await CategoriaInsumo.bulkCreate([
      { 
        nombre: 'Botellas', 
        descripcion: 'Botellas de vidrio de diferentes capacidades',
        unidad_medida: 'piezas'
      },
      { 
        nombre: 'Tapones', 
        descripcion: 'Tapones cónicos naturales y negros',
        unidad_medida: 'piezas'
      },
      { 
        nombre: 'Cintillos', 
        descripcion: 'Cintillos de seguridad',
        unidad_medida: 'piezas'
      },
      { 
        nombre: 'Sellos Térmicos', 
        descripcion: 'Sellos térmicos para botellas',
        unidad_medida: 'piezas'
      },
      { 
        nombre: 'Etiquetas', 
        descripcion: 'Etiquetas impresas para botellas',
        unidad_medida: 'piezas'
      },
      { 
        nombre: 'Cajas', 
        descripcion: 'Cajas de empaque',
        unidad_medida: 'piezas'
      }
    ]);
    console.log(`✅ ${categorias.length} categorías creadas`);

    // ==================== VARIEDADES DE AGAVE ====================
    console.log('🌵 Creando variedades de agave...');
    const variedades = await VariedadesAgave.bulkCreate([
      { 
        nombre: 'Espadín', 
        region: 'Valles Centrales',
        descripcion: 'Variedad más común, notas herbales'
      },
      { 
        nombre: 'Tobalá', 
        region: 'Sierra Sur',
        descripcion: 'Silvestre, notas frutales y florales'
      },
      { 
        nombre: 'Cuishe', 
        region: 'Valles Centrales',
        descripcion: 'Notas minerales y especiadas'
      },
      { 
        nombre: 'Arroqueño', 
        region: 'Sierra Mixe',
        descripción: 'Notas herbales complejas'
      },
      { 
        nombre: 'Tepeztate', 
        region: 'Sierra Norte',
        descripcion: 'Silvestre, notas ahumadas'
      }
    ]);
    console.log(`✅ ${variedades.length} variedades creadas`);

    // ==================== PROVEEDORES ====================
    console.log('🚚 Creando proveedores...');
    const proveedores = await Proveedor.bulkCreate([
      {
        nombre: 'Vidriera Mexicana',
        contacto: 'Roberto Sánchez',
        telefono: '555-111-2222',
        email: 'ventas@vidrieramex.com',
        direccion: 'Ciudad de México',
        tipo_insumos: 'Botellas'
      },
      {
        nombre: 'Vidriera Premium',
        contacto: 'Laura Torres',
        telefono: '555-222-3333',
        email: 'contacto@vidrierapremium.com',
        direccion: 'Guadalajara, Jalisco',
        tipo_insumos: 'Botellas'
      },
      {
        nombre: 'Corchos Oaxaca',
        contacto: 'Pedro Ramírez',
        telefono: '951-111-2222',
        email: 'ventas@corchosoax.com',
        direccion: 'Oaxaca de Juárez',
        tipo_insumos: 'Tapones'
      },
      {
        nombre: 'Etiquetas del Sur',
        contacto: 'Carmen Flores',
        telefono: '951-222-3333',
        email: 'info@etiquetassur.com',
        direccion: 'Oaxaca de Juárez',
        tipo_insumos: 'Etiquetas, Cintillos'
      },
      {
        nombre: 'Sellos Premium',
        contacto: 'Miguel Ángel Díaz',
        telefono: '555-333-4444',
        email: 'ventas@sellospremium.com',
        direccion: 'Monterrey, Nuevo León',
        tipo_insumos: 'Sellos Térmicos'
      },
      {
        nombre: 'Gráficas Modernas',
        contacto: 'Sofía Hernández',
        telefono: '951-333-4444',
        email: 'contacto@graficasmodernas.com',
        direccion: 'Oaxaca de Juárez',
        tipo_insumos: 'Etiquetas'
      },
      {
        nombre: 'Empaques Ecológicos',
        contacto: 'Luis Gómez',
        telefono: '555-444-5555',
        email: 'ventas@empaqueseco.com',
        direccion: 'Puebla, Puebla',
        tipo_insumos: 'Cajas'
      }
    ]);
    console.log(`✅ ${proveedores.length} proveedores creados`);

    // ==================== INVENTARIO ====================
    console.log('📊 Creando items de inventario...');
    const inventario = await Inventario.bulkCreate([
      {
        categoria_insumo_id: categorias[0].id, // Botellas
        cliente_id: clientes[0].id,
        marca_id: marcas[0].id,
        variedad_agave_id: variedades[0].id, // Espadín
        presentacion_id: presentaciones[4].id, // 750ml
        proveedor_id: proveedores[0].id,
        tipo: 'Nacional',
        codigo_lote: 'BOT-2024-001',
        stock: 450,
        stock_minimo: 300,
        unidad: 'piezas',
        ultima_actualizacion: new Date()
      },
      {
        categoria_insumo_id: categorias[0].id, // Botellas
        cliente_id: clientes[1].id,
        marca_id: marcas[1].id,
        variedad_agave_id: variedades[1].id, // Tobalá
        presentacion_id: presentaciones[3].id, // 500ml
        proveedor_id: proveedores[1].id,
        tipo: 'Exportación',
        codigo_lote: 'BOT-2024-002',
        stock: 180,
        stock_minimo: 250,
        unidad: 'piezas',
        ultima_actualizacion: new Date()
      },
      {
        categoria_insumo_id: categorias[1].id, // Tapones
        cliente_id: clientes[0].id,
        marca_id: marcas[0].id,
        variedad_agave_id: variedades[2].id, // Cuishe
        presentacion_id: presentaciones[4].id, // 750ml
        proveedor_id: proveedores[2].id,
        tipo: 'Nacional',
        codigo_lote: 'TAP-2024-001',
        stock: 520,
        stock_minimo: 400,
        unidad: 'piezas',
        ultima_actualizacion: new Date()
      },
      {
        categoria_insumo_id: categorias[2].id, // Cintillos
        cliente_id: clientes[2].id,
        marca_id: marcas[2].id,
        variedad_agave_id: variedades[0].id, // Espadín
        presentacion_id: presentaciones[5].id, // 1000ml
        proveedor_id: proveedores[3].id,
        tipo: 'Nacional',
        codigo_lote: 'CIN-2024-001',
        stock: 85,
        stock_minimo: 150,
        unidad: 'piezas',
        ultima_actualizacion: new Date()
      },
      {
        categoria_insumo_id: categorias[3].id, // Sellos Térmicos
        cliente_id: clientes[1].id,
        marca_id: marcas[1].id,
        variedad_agave_id: variedades[3].id, // Arroqueño
        presentacion_id: presentaciones[2].id, // 375ml
        proveedor_id: proveedores[4].id,
        tipo: 'Exportación',
        codigo_lote: 'SEL-2024-001',
        stock: 280,
        stock_minimo: 200,
        unidad: 'piezas',
        ultima_actualizacion: new Date()
      },
      {
        categoria_insumo_id: categorias[4].id, // Etiquetas
        cliente_id: clientes[0].id,
        marca_id: marcas[0].id,
        variedad_agave_id: variedades[0].id, // Espadín
        presentacion_id: presentaciones[1].id, // 200ml
        proveedor_id: proveedores[5].id,
        tipo: 'Nacional',
        codigo_lote: 'ETI-2024-001',
        stock: 1200,
        stock_minimo: 1000,
        unidad: 'piezas',
        ultima_actualizacion: new Date()
      },
      {
        categoria_insumo_id: categorias[5].id, // Cajas
        cliente_id: clientes[2].id,
        marca_id: marcas[2].id,
        variedad_agave_id: variedades[1].id, // Tobalá
        presentacion_id: presentaciones[4].id, // 750ml
        proveedor_id: proveedores[6].id,
        tipo: 'Exportación',
        codigo_lote: 'CAJ-2024-001',
        stock: 45,
        stock_minimo: 80,
        unidad: 'piezas',
        ultima_actualizacion: new Date()
      },
      {
        categoria_insumo_id: categorias[0].id, // Botellas
        cliente_id: clientes[1].id,
        marca_id: marcas[1].id,
        variedad_agave_id: variedades[0].id, // Espadín
        presentacion_id: presentaciones[0].id, // 50ml
        proveedor_id: proveedores[0].id,
        tipo: 'Nacional',
        codigo_lote: 'BOT-2024-003',
        stock: 25,
        stock_minimo: 100,
        unidad: 'piezas',
        ultima_actualizacion: new Date()
      }
    ]);
    console.log(`✅ ${inventario.length} items de inventario creados`);

    console.log('\n🎉 ¡Seed completado exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`   - ${usuarios.length} usuarios`);
    console.log(`   - ${clientes.length} clientes`);
    console.log(`   - ${marcas.length} marcas`);
    console.log(`   - ${presentaciones.length} presentaciones`);
    console.log(`   - ${categorias.length} categorías`);
    console.log(`   - ${variedades.length} variedades de agave`);
    console.log(`   - ${proveedores.length} proveedores`);
    console.log(`   - ${inventario.length} items de inventario`);
    
    console.log('\n🔐 Credenciales de acceso:');
    console.log('   Admin:        admin@envasadora.com / admin123');
    console.log('   Operador:     operador@envasadora.com / operador123');
    console.log('   Visualizador: visualizador@envasadora.com / visual123');

  } catch (error) {
    console.error('❌ Error al hacer seed:', error);
    throw error;
  }
}

// Ejecutar seed
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('\n✅ Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error fatal:', error);
      process.exit(1);
    });
}

module.exports = seedDatabase;