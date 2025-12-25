const express = require('express');
const router = express.Router();
const presentacionController = require('../controllers/presentacionController');

// CRUD de presentaciones
router.get('/', presentacionController.obtenerPresentaciones);
router.get('/:id', presentacionController.obtenerPresentacionPorId);
router.post('/', presentacionController.crearPresentacion);
router.put('/:id', presentacionController.actualizarPresentacion);
router.delete('/:id', presentacionController.eliminarPresentacion);

module.exports = router;