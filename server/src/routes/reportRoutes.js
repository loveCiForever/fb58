const express = require('express');
const router = express.Router();
const { authenticate, authorizeAdmin } = require('../middlewares/auth');

// For now, just create a placeholder response since we'll implement the controller later
router.get('/', authenticate, authorizeAdmin, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Report routes are set up and will be implemented soon',
        data: []
    });
});

module.exports = router; 