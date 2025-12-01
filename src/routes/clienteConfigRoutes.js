// routes/clienteConfigRoutes.js
const express = require('express');
const router = express.Router();
const clienteConfigController = require('../controllers/clienteConfigController');

// GET /api/cliente-config/todos - Obtener configuración de todos los clientes
router.get('/todos', clienteConfigController.obtenerTodasConfiguraciones);

// GET /api/cliente-config/:id - Obtener configuración de un cliente específico
router.get('/:id', clienteConfigController.obtenerConfiguracionCliente);

// PUT /api/cliente-config/:id - Actualizar toda la configuración de un cliente
router.put('/:id', clienteConfigController.actualizarConfiguracionCompleta);

// PUT /api/cliente-config/:id/variedades - Actualizar solo variedades
router.put('/:id/variedades', clienteConfigController.actualizarVariedadesCliente);

// PUT /api/cliente-config/:id/presentaciones - Actualizar solo presentaciones
router.put('/:id/presentaciones', clienteConfigController.actualizarPresentacionesCliente);

// PUT /api/cliente-config/:id/tipos - Actualizar solo tipos
router.put('/:id/tipos', clienteConfigController.actualizarTiposCliente);

module.exports = router;