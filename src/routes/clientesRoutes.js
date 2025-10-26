const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/', clientController.getAllClients);
router.get('/active', clientController.getActiveClients);
router.get('/:id', clientController.getClient);
router.post('/', authorize(['admin', 'operator']), clientController.createClient);
router.put('/:id', authorize(['admin', 'operator']), clientController.updateClient);
router.patch('/:id/deactivate', authorize(['admin']), clientController.deactivateClient);
router.patch('/:id/activate', authorize(['admin']), clientController.activateClient);
router.delete('/:id', authorize(['admin']), clientController.deleteClient);

module.exports = router;