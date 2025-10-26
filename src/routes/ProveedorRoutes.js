const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');

const proveedorRoutes = express.Router();

proveedorRoutes.get('/', proveedorController.obtenerProveedores);
proveedorRoutes.post('/', proveedorController.crearProveedor);
proveedorRoutes.put('/:id', proveedorController.actualizarProveedor);

module.exports = router;
module.exports = { proveedorRoutes };