const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createBookingValidation, cancelBookingValidation } = require('../middleware/validators');
const {
    createBooking,
    getUserBookings,
    getAllBookings,
    confirmBooking,
    rejectBooking,
    cancelBooking,
    getAvailableShifts,
    getFieldShifts
} = require('../controllers/bookingController');

// Public routes
router.get('/available-shifts', getAvailableShifts);
router.get('/field-shifts', getFieldShifts);

// Protected routes
router.use(protect);
router.post('/', createBookingValidation, createBooking);
router.get('/user', getUserBookings);
router.put('/:id/cancel', cancelBookingValidation, cancelBooking);

// Admin routes
router.use(authorize('admin'));
router.get('/', getAllBookings);
router.put('/:id/confirm', confirmBooking);
router.put('/:id/reject', rejectBooking);

module.exports = router; 