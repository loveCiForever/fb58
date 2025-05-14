const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);

// Admin routes
router.post('/', authenticate, isAdmin, serviceController.createService);
router.put('/:id', authenticate, isAdmin, serviceController.updateService);
router.delete('/:id', authenticate, isAdmin, serviceController.deleteService);

module.exports = router;