const express = require('express');
const router = express.Router();
const marcaController = require('../controllers/marcaController');

const marcaRoutes = express.Router();

marcaRoutes.get('/', marcaController.obtenerMarcas);
marcaRoutes.post('/', marcaController.crearMarca);
marcaRoutes.put('/:id', marcaController.actualizarMarca);

module.exports = router;
module.exports = { marcaRoutes };   