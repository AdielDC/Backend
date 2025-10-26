const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/delivery.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/', deliveryController.getAllDeliveries);
router.get('/waste-report', deliveryController.getWasteReport);
router.get('/:id', deliveryController.getDelivery);
router.post('/', authorize(['admin', 'operator']), deliveryController.createDelivery);
router.put('/:id', authorize(['admin', 'operator']), deliveryController.updateDelivery);
router.patch('/:id/complete', authorize(['admin', 'operator']), deliveryController.completeDelivery);
router.patch('/:id/cancel', authorize(['admin', 'operator']), deliveryController.cancelDelivery);
router.delete('/:id', authorize(['admin']), deliveryController.deleteDelivery);

module.exports = router;