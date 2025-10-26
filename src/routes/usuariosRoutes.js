const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.use(authenticate);

// Rutas públicas para usuarios autenticados
router.get('/stats', authorize(['admin']), userController.getUserStats);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.put('/:id/change-password', userController.changeUserPassword);

// Rutas solo para admin
router.get('/', authorize(['admin']), userController.getAllUsers);
router.post('/', authorize(['admin']), userController.createUser);
router.patch('/:id/deactivate', authorize(['admin']), userController.deactivateUser);
router.patch('/:id/activate', authorize(['admin']), userController.activateUser);
router.delete('/:id', authorize(['admin']), userController.deleteUser);

module.exports = router;