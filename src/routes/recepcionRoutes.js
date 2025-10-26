const express = require('express');
const router = express.Router();
const recepcionController = require('../controllers/recepcionController');

router.get('/recepciones', recepcionController.getAllReceptions);
router.post('/recepciones', recepcionController.createReception);
router.put('/recepciones/:id', recepcionController.updateReception);
router.delete('/recepciones/:id', recepcionController.deleteReception);

module.exports = router;