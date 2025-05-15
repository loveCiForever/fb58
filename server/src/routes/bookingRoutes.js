const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate: protect, authorizeAdmin: restrictTo } = require('../middlewares/auth');

// Protect all booking routes - require authentication
router.use(protect);

// User booking routes
router.post('/', bookingController.createBooking);
router.get('/my-bookings', bookingController.getUserBookings);
router.get('/:id', bookingController.getBookingById);
router.patch('/:id/status', bookingController.updateBookingStatus);
router.patch('/:id/payment', bookingController.updatePaymentStatus);

// Admin only routes
router.get('/', restrictTo, bookingController.getAllBookings);
router.delete('/:id', bookingController.deleteBooking); // Accessible by users (to cancel) and admins (to delete)

module.exports = router; 