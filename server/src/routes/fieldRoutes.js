const express = require('express');
const router = express.Router();
const fieldController = require('../controllers/fieldController');
const { authenticate, authorizeAdmin, requireVerifiedUser } = require('../middlewares/auth');

// Public routes
router.get('/', fieldController.getAllFields);
router.get('/:id', fieldController.getFieldById);
router.get('/:id/available-slots/:date', fieldController.getAvailableTimeSlots);

// Admin-only routes
router.post('/', authenticate, requireVerifiedUser, authorizeAdmin, fieldController.createField);
router.put('/:id', authenticate, requireVerifiedUser, authorizeAdmin, fieldController.updateField);
router.delete('/:id', authenticate, requireVerifiedUser, authorizeAdmin, fieldController.deleteField);

module.exports = router; 