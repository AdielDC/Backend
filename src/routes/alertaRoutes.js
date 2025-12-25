// alertaRoutes.js - Rutas para gestión de alertas de inventario
// Ubicación: src/routes/alertaRoutes.js

const express = require('express');
const router = express.Router();
const alertaController = require('../controllers/alertaController');

// IMPORTANTE: Si tienes middleware de autenticación, descomenta la siguiente línea
// const { verificarToken } = require('../middleware/auth');
// router.use(verificarToken);

// RUTAS DE ALERTAS
// IMPORTANTE: El orden de las rutas importa - las más específicas primero

// Obtener contador de alertas no vistas
router.get('/count/no-vistas', alertaController.obtenerCountNoVistas);

// Obtener todas las alertas con filtros opcionales
router.get('/', alertaController.obtenerAlertas);

// Marcar todas las alertas como vistas
router.put('/marcar-todas-vistas', alertaController.marcarTodasComoVistas);

// Marcar alerta específica como vista
router.put('/:id/vista', alertaController.marcarComoVista);

// Resolver una alerta específica
router.put('/:id/resolver', alertaController.resolverAlerta);

// Crear alerta manualmente (útil para pruebas)
router.post('/', alertaController.crearAlerta);

// Eliminar una alerta
router.delete('/:id', alertaController.eliminarAlerta);

module.exports = router;