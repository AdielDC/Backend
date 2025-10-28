const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');

router.get('/', proveedorController.obtenerProveedores);
router.post('/', proveedorController.crearProveedor);
router.put('/:id', proveedorController.actualizarProveedor);

module.exports = router;