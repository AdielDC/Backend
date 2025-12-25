const express = require('express');
const router = express.Router();
const variedadController = require('../controllers/variedadAgaveController');

// Rutas de variedades de agave
router.get('/', variedadController.obtenerVariedades);
router.post('/', variedadController.crearVariedad);
router.put('/:id', variedadController.actualizarVariedad);
router.delete('/:id', variedadController.eliminarVariedad);

module.exports = router;