const express = require('express');
const router = express.Router();

// Import all route modules
const userRoutes = require('./userRoutes');
const fieldRoutes = require('./fieldRoutes');
const bookingRoutes = require('./bookingRoutes');
const serviceRoutes = require('./serviceRoutes');
const reviewRoutes = require('./reviewRoutes');
const supportRoutes = require('./supportRoutes');
const reportRoutes = require('./reportRoutes');

// API routes
router.use('/api/users', userRoutes);
router.use('/api/fields', fieldRoutes);
router.use('/api/bookings', bookingRoutes);
router.use('/api/services', serviceRoutes);
router.use('/api/reviews', reviewRoutes);
router.use('/api/support', supportRoutes);
router.use('/api/reports', reportRoutes);

// Base API route for testing
router.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the Football Field Booking API' });
});

module.exports = router; 