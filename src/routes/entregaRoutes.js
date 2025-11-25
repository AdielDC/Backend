const express = require('express');
const router = express.Router();
const entregaController = require('../controllers/entregaController');

router.get('/datos-formulario', entregaController.obtenerDatosFormulario);
router.get('/formulario-datos', entregaController.obtenerDatosFormulario);
router.get('/', entregaController.obtenerEntregas);
router.get('/:id', entregaController.obtenerEntrega);
router.post('/', entregaController.crearEntrega);
router.put('/:id', entregaController.actualizarEntrega);
router.delete('/:id', entregaController.eliminarEntrega);

module.exports = router;