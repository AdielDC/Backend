const express = require('express');
const router = express.Router();
const presentacionController = require('../controllers/presentacionController');
const presentacionRoutes = express.Router();

presentacionRoutes.get('/', presentacionController.obtenerPresentaciones);
presentacionRoutes.post('/', presentacionController.crearPresentacion);
module.exports = router;
module.exports = {presentacionRoutes};