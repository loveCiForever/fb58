const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate, isAdmin } = require('../middleware/auth');

// User routes
router.post('/', authenticate, bookingController.createBooking);
router.get('/user', authenticate, bookingController.getUserBookings);
router.get('/user/:id', authenticate, bookingController.getBookingById);
router.put('/:id/payment', authenticate, bookingController.updatePaymentProof);
router.put('/:id/cancel', authenticate, bookingController.cancelBooking);

// Admin routes
router.get('/all', authenticate, isAdmin, bookingController.getAllBookings);
router.put('/:id/status', authenticate, isAdmin, bookingController.updateBookingStatus);

module.exports = router;