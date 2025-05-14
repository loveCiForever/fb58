const express = require('express');
const router = express.Router();
const fieldController = require('../controllers/fieldController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', fieldController.getAllFields);
router.get('/:id', fieldController.getFieldById);
router.get('/:fieldId/available-slots/:date', fieldController.getAvailableTimeSlots);

// Admin routes
router.post('/', authenticate, isAdmin, fieldController.createField);
router.put('/:id', authenticate, isAdmin, fieldController.updateField);

module.exports = router;