const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Admin routes
router.get('/revenue', authenticate, isAdmin, reportController.getRevenueReport);

module.exports = router; 