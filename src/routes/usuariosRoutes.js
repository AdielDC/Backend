const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuariosControlller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Todas las rutas requieren autenticación
router.use(authenticate);

// Rutas de administrador
router.get('/', authorize(['admin']), usuarioController.getAllUsers);
router.get('/stats', authorize(['admin']), usuarioController.getUserStats);
router.post('/', authorize(['admin']), usuarioController.createUser);
router.delete('/:id', authorize(['admin']), usuarioController.deleteUser);
router.put('/:id/deactivate', authorize(['admin']), usuarioController.deactivateUser);
router.put('/:id/activate', authorize(['admin']), usuarioController.activateUser);

// Rutas que pueden usar usuarios autenticados
router.get('/:id', usuarioController.getUser);
router.put('/:id', usuarioController.updateUser);
router.put('/:id/password', usuarioController.changeUserPassword);

module.exports = router;