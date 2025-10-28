require('dotenv').config();
const express = require('express');
const cors = require('cors'); // ← AGREGAR ESTA LÍNEA
const app = express();
const { testConnection, sequelize } = require('./config/database');

// ========== CONFIGURACIÓN DE CORS ========== 
// ← AGREGAR ESTE BLOQUE ANTES DE LOS MIDDLEWARES
const corsOptions = {
  origin: [
    'http://localhost:3000',  // Create React App
    'http://localhost:5173'   // Vite
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); // ← AGREGAR ESTA LÍNEA

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar y montar rutas
const inventarioRoutes = require('./routes/inventarioRoutes');
const recepcionRoutes = require('./routes/recepcionRoutes');
const entregaRoutes = require('./routes/entregaRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const marcaRoutes = require('./routes/marcaRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const variedadRoutes = require('./routes/variedadRoutes');
const presentacionRoutes = require('./routes/presentacionRoutes');

app.use('/api/inventario', inventarioRoutes);
app.use('/api/recepciones', recepcionRoutes);
app.use('/api/entregas', entregaRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/marcas', marcaRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/variedades', variedadRoutes);
app.use('/api/presentaciones', presentacionRoutes);

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
      console.log('🚀 Servidor corriendo en puerto', PORT);
      console.log('📍 Ambiente:', process.env.NODE_ENV || 'development');
      console.log('🌐 URL:', `http://localhost:${PORT}`);
      console.log('📡 API:', `http://localhost:${PORT}/api`);
      console.log('🔐 CORS habilitado para: localhost:3000, localhost:5173'); // ← AGREGADO
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();