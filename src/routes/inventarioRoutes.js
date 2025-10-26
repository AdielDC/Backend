const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');
// const authMiddleware = require('../middleware/auth'); // Descomentar cuando tengas autenticación

// Obtener opciones de filtros
router.get('/filtros', inventarioController.obtenerOpcionesFiltros);

// Obtener alertas
router.get('/alertas', inventarioController.obtenerAlertas);
router.patch('/alertas/:id/vista', inventarioController.marcarAlertaVista);

// CRUD de inventario
router.get('/', inventarioController.obtenerInventario);
router.get('/:id', inventarioController.obtenerItemInventario);
router.post('/', inventarioController.crearItemInventario);
router.put('/:id', inventarioController.actualizarItemInventario);

// Movimientos de inventario
router.post('/movimientos', inventarioController.registrarMovimiento);
router.get('/:id/historial', inventarioController.obtenerHistorialMovimientos);

module.exports = router;