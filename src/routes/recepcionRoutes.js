const express = require('express');
const router = express.Router();
const recepcionController = require('../controllers/recepcionController');

const recepcionRoutes = express.Router();

recepcionRoutes.get('/formulario-datos', recepcionController.obtenerDatosFormulario);
recepcionRoutes.get('/', recepcionController.obtenerRecepciones);
recepcionRoutes.get('/:id', recepcionController.obtenerRecepcion);
recepcionRoutes.post('/', recepcionController.crearRecepcion);
recepcionRoutes.put('/:id', recepcionController.actualizarRecepcion);
recepcionRoutes.delete('/:id', recepcionController.eliminarRecepcion);

module.exports = router;
module.exports = {recepcionRoutes};