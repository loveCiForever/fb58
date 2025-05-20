const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createFieldValidation } = require('../middleware/validators');
const { createField, getAllFields } = require('../controllers/fieldController');

// Get all fields
router.get('/', getAllFields);

// Create a new field (admin only)
router.post('/', protect, authorize('admin'), createFieldValidation, createField);

module.exports = router; 