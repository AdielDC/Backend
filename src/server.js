const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection, sequelize } = require('./config/database');

// Importar rutas
const inventarioRoutes = require('./routes/inventarioRoutes');
const recepcionRoutes = require('./routes/recepcionRoutes');
const entregaRoutes = require('./routes/entregaRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const marcaRoutes = require('./routes/marcaRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const variedadRoutes = require('./routes/variedadRoutes');
const presentacionRoutes = require('./routes/presentacionRoutes');
const app = express();

// ==================== MIDDLEWARES ====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ==================== RUTAS ====================
app.get('/', (req, res) => {
  res.json({
    message: 'API de Inventario de Mezcal',
    version: '1.0.0',
    endpoints: {
      inventario: '/api/inventario',
      recepciones: '/api/recepciones',
      entregas: '/api/entregas',
      clientes: '/api/clientes',
      marcas: '/api/marcas',
      proveedores: '/api/proveedores',
      categorias: '/api/categorias',
      variedades: '/api/variedades',
      presentaciones: '/api/presentaciones'
    }
  });
});

// Montar rutas
app.use('/api/inventario', inventarioRoutes);
app.use('/api/recepciones', recepcionRoutes);
app.use('/api/entregas', entregaRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/marcas', marcaRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/variedades', variedadRoutes);
app.use('/api/presentaciones', presentacionRoutes);

// ==================== MANEJO DE ERRORES ====================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// ==================== INICIAR SERVIDOR ====================
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    await testConnection();
    
    // Sincronizar modelos (solo en desarrollo, usar migraciones en producción)
    if (process.env.NODE_ENV === 'development') {
      // alter: true actualiza las tablas sin eliminar datos
      // force: true elimina y recrea las tablas (¡cuidado!)
      await sequelize.sync({ alter: false });
      console.log('✅ Modelos sincronizados con la base de datos');
    }
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;