require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const app = express();
const { testConnection, sequelize } = require('./config/database');

// Configurar CORS
const corsOptions = {
  origin: true,  // Permite cualquier origin (solo temporal para pruebas)
  credentials: true
};

app.use(cors(corsOptions)); 

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuariosRoutes');
const inventarioRoutes = require('./routes/inventarioRoutes');
const recepcionRoutes = require('./routes/recepcionRoutes');
const entregaRoutes = require('./routes/entregaRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const marcaRoutes = require('./routes/marcaRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const variedadRoutes = require('./routes/variedadRoutes');
const presentacionRoutes = require('./routes/presentacionRoutes');
const clienteConfigRoutes = require('./routes/clienteConfigRoutes');
const alertaRoutes = require('./routes/alertaRoutes');

// ==================== RUTAS ====================

// Rutas públicas (sin autenticación)
app.use('/api/auth', authRoutes);

// Rutas protegidas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/recepciones', recepcionRoutes);
app.use('/api/entregas', entregaRoutes);
app.use('/api/cliente-config', clienteConfigRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/marcas', marcaRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/variedades', variedadRoutes);
app.use('/api/presentaciones', presentacionRoutes);
app.use('/api/alertas', alertaRoutes);

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Envasadora Ancestral API'
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Envasadora Ancestral - Sistema de Gestión de Inventarios',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      setup: process.env.NODE_ENV === 'development' ? '/api/setup' : 'disabled',
      usuarios: '/api/usuarios',
      inventario: '/api/inventario',
      recepciones: '/api/recepciones',
      entregas: '/api/entregas',
      clientes: '/api/clientes',
      marcas: '/api/marcas',
      proveedores: '/api/proveedores',
      categorias: '/api/categorias',
      variedades: '/api/variedades',
      presentaciones: '/api/presentaciones',
      alertas: '/api/alertas',
      health: '/health'
    }
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Ruta no encontrada',
    path: req.path,
    method: req.method
  });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack 
    })
  });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    await testConnection();
    
    // Sincronizar modelos (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
      console.log('✅ Modelos sincronizados con la base de datos');
    }
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🚀 Servidor de Envasadora Ancestral iniciado');
      console.log('📊 Puerto:', PORT);
      console.log('🌍 Ambiente:', process.env.NODE_ENV || 'development');
      console.log('🔗 URL:', `http://localhost:${PORT}`);
      console.log('📡 API:', `http://localhost:${PORT}/api`);
      console.log('🔐 Auth:', `http://localhost:${PORT}/api/auth`);
      if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
        console.log('⚙️  Setup:', `http://localhost:${PORT}/api/setup`);
      }
      console.log('🔒 CORS habilitado para: localhost:3000, localhost:5173');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log('⚠️  SIGTERM recibido, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('⚠️  SIGINT recibido, cerrando servidor...');
  process.exit(0);
});

startServer();

module.exports = app;
