const express = require('express');
const router = express.Router();
const entregaController = require('../controllers/entregaController');

const entregaRoutes = express.Router();

entregaRoutes.get('/formulario-datos', entregaController.obtenerDatosFormulario);
entregaRoutes.get('/', entregaController.obtenerEntregas);
entregaRoutes.get('/:id', entregaController.obtenerEntrega);
entregaRoutes.post('/', entregaController.crearEntrega);
entregaRoutes.put('/:id', entregaController.actualizarEntrega);
entregaRoutes.delete('/:id', entregaController.eliminarEntrega);

module.exports = router;
module.exports = {entregaRoutes};