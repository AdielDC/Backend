const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');

// ========== RUTAS ESPECÍFICAS (DEBEN IR PRIMERO) ==========
// Estas rutas deben estar antes de las rutas con parámetros /:id

// Obtener items con stock bajo
router.get('/stock-bajo', inventarioController.getStockBajo);

// Obtener alertas de inventario
router.get('/alertas', inventarioController.obtenerAlertas);

// Obtener opciones para filtros
router.get('/opciones-filtros', inventarioController.obtenerOpcionesFiltros);

// Registrar movimiento de inventario (entrada/salida)
router.post('/movimiento', inventarioController.registrarMovimiento);

// Obtener historial de movimientos de un item
router.get('/:id/movimientos', inventarioController.obtenerHistorialMovimientos);

// Marcar alerta como vista
router.put('/alertas/:id/vista', inventarioController.marcarAlertaVista);

// ========== RUTAS GENERALES DE CRUD ==========

// Obtener todo el inventario con filtros
router.get('/', inventarioController.obtenerInventario);

// Obtener un item específico del inventario
router.get('/:id', inventarioController.obtenerItemInventario);

// Crear nuevo item de inventario
router.post('/', inventarioController.crearItemInventario);

// Actualizar item de inventario
router.put('/:id', inventarioController.actualizarItemInventario);

// Eliminar item de inventario (soft delete)
router.delete('/:id', inventarioController.delete);

module.exports = router;