const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const { authenticate, isAdmin } = require('../middleware/auth');

// User routes
router.post('/', authenticate, supportController.createSupportRequest);
router.get('/user', authenticate, supportController.getUserSupportRequests);
router.get('/user/:id', authenticate, supportController.getSupportRequestById);

// Admin routes
router.get('/all', authenticate, isAdmin, supportController.getAllSupportRequests);
router.put('/:id', authenticate, isAdmin, supportController.updateSupportRequest);

module.exports = router;