const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

const clienteRoutes = express.Router();

clienteRoutes.get('/', clienteController.obtenerClientes);
clienteRoutes.get('/:id', clienteController.obtenerCliente);
clienteRoutes.post('/', clienteController.crearCliente);
clienteRoutes.put('/:id', clienteController.actualizarCliente);
clienteRoutes.delete('/:id', clienteController.eliminarCliente);

module.exports = router;
module.exports = { clienteRoutes };