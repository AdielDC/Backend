const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brand.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/', brandController.getAllBrands);
router.get('/active', brandController.getActiveBrands);
router.get('/client/:client_id', brandController.getBrandsByClient);
router.get('/:id', brandController.getBrand);
router.post('/', authorize(['admin', 'operator']), brandController.createBrand);
router.put('/:id', authorize(['admin', 'operator']), brandController.updateBrand);
router.patch('/:id/deactivate', authorize(['admin']), brandController.deactivateBrand);
router.patch('/:id/activate', authorize(['admin']), brandController.activateBrand);
router.delete('/:id', authorize(['admin']), brandController.deleteBrand);

module.exports = router;