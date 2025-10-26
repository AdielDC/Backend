const express = require('express');
const router = express.Router();
const variedadController = require('../controllers/variedadAgaveController');
const variedadRoutes = express.Router();

variedadRoutes.get('/', variedadController.obtenerVariedades);
variedadRoutes.post('/', variedadController.crearVariedad);
module.exports = router;
module.exports = variedadRoutes;