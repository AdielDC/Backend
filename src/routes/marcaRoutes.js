const express = require('express');
const router = express.Router();
const marcaController = require('../controllers/marcaController');

router.get('/', marcaController.obtenerMarcas);
router.post('/', marcaController.crearMarca);
router.put('/:id', marcaController.actualizarMarca);

module.exports = router;