const express = require('express');
const router = express.Router();
const presentacionController = require('../controllers/presentacionController');

router.get('/', presentacionController.obtenerPresentaciones);
router.post('/', presentacionController.crearPresentacion);

module.exports = router;