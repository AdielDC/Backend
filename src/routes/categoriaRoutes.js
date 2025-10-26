const express = require('express');
const router = express.Router();
const CategoriaInsumoController = require('../controllers/categoriaInsumoController');
const categoriaRoutes = express.Router();

categoriaRoutes.get('/', CategoriaInsumoController.obtenerCategorias);
categoriaRoutes.post('/', CategoriaInsumoController.crearCategoria);

module.exports = router;
module.exports = categoriaRoutes;