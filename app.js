// src/app.js
const express = require('express');
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar y montar rutas
const inventarioRoutes = require('./src/routes/inventarioRoutes');
const recepcionRoutes = require('./src/routes/recepcionRoutes');
const entregaRoutes = require('./src/routes/entregaRoutes');
const clienteRoutes = require('./src/routes/clienteRoutes');
const marcaRoutes = require('./src/routes/marcaRoutes');
const proveedorRoutes = require('./src/routes/proveedorRoutes');
const categoriaRoutes = require('./src/routes/categoriaRoutes');
const variedadRoutes = require('./src/routes/variedadRoutes');
const presentacionRoutes = require('./src/routes/presentacionRoutes');

app.use('/api/inventario', inventarioRoutes);
app.use('/api/recepciones', recepcionRoutes);
app.use('/api/entregas', entregaRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/marcas', marcaRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/variedades', variedadRoutes);
app.use('/api/presentaciones', presentacionRoutes);

module.exports = app;