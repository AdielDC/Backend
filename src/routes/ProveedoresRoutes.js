const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplier.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/', supplierController.getAllSuppliers);
router.get('/active', supplierController.getActiveSuppliers);
router.get('/:id', supplierController.getSupplier);
router.post('/', authorize(['admin', 'operator']), supplierController.createSupplier);
router.put('/:id', authorize(['admin', 'operator']), supplierController.updateSupplier);
router.patch('/:id/deactivate', authorize(['admin']), supplierController.deactivateSupplier);
router.patch('/:id/activate', authorize(['admin']), supplierController.activateSupplier);
router.delete('/:id', authorize(['admin']), supplierController.deleteSupplier);

module.exports = router;