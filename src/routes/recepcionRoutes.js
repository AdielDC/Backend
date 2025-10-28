const express = require('express');
const router = express.Router();
const recepcionController = require('../controllers/recepcionController');

// Usamos 'router' directamente para definir las rutas
router.get('/formulario-datos', recepcionController.obtenerDatosFormulario);
router.get('/', recepcionController.obtenerRecepciones);
router.get('/:id', recepcionController.obtenerRecepcion);
router.post('/', recepcionController.crearRecepcion);
router.put('/:id', recepcionController.actualizarRecepcion);
router.delete('/:id', recepcionController.eliminarRecepcion);

module.exports = router; // Exportamos solo el router con las rutas definidas