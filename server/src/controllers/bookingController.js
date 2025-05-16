const Booking = require('../models/Booking');
const Field = require('../models/Field');
const User = require('../models/User');
const logger = require('../config/logger');
const { sendBookingConfirmation, sendBookingCancellation, sendBookingRejection } = require('../services/emailService');

// Create a new booking
exports.createBooking = async (req, res) => {
    try {
        const { field, date, shift, team1, team2 } = req.body;
        const userId = req.user.id;

        // Kiểm tra sân có tồn tại
        const fieldExists = await Field.findById(field);
        if (!fieldExists) {
            return res.status(404).json({
                success: false,
                message: 'Field not found'
            });
        }

        // Kiểm tra ca có còn trống không
        const isAvailable = await Booking.isShiftAvailable(field, date, shift);
        if (!isAvailable) {
            return res.status(400).json({
                success: false,
                message: 'This shift is already booked'
            });
        }

        // Tính giá tiền
        const totalPrice = fieldExists.price * 2; // Mỗi ca 2 tiếng

        // Tạo booking mới
        const booking = new Booking({
            field,
            user: userId,
            date,
            shift,
            team1,
            team2,
            totalPrice
        });

        await booking.save();

        // Gửi email xác nhận
        try {
            const user = await User.findById(userId);
            await sendBookingConfirmation(user, booking, fieldExists);
        } catch (emailError) {
            logger.error('Error sending confirmation email:', emailError);
        }

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: {
                id: booking._id,
                field,
                date: booking.date,
                shift: booking.shift,
                team1,
                team2,
                totalPrice,
                bookingStatus: booking.bookingStatus,
                paymentStatus: booking.paymentStatus
            }
        });
    } catch (error) {
        logger.error('Error creating booking:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating booking',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get user's bookings
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('field', 'name')
            .sort({ date: -1, 'shift.startTime': 1 });

        res.json({
            success: true,
            data: bookings
        });
    } catch (error) {
        logger.error('Error getting user bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting bookings',
            error: error.message
        });
    }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
    try {
        const { cancellationReason } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this booking'
            });
        }

        if (booking.bookingStatus !== 'confirmed') {
            return res.status(400).json({
                success: false,
                message: 'Only confirmed bookings can be cancelled'
            });
        }

        booking.bookingStatus = 'cancelled';
        booking.cancellationReason = cancellationReason;
        await booking.save();

        res.json({
            success: true,
            message: 'Booking cancelled successfully',
            data: booking
        });
    } catch (error) {
        logger.error('Error cancelling booking:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling booking',
            error: error.message
        });
    }
};

// Thêm hàm mới để admin xác nhận booking
exports.confirmBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        if (booking.bookingStatus !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Booking is not in pending status'
            });
        }

        booking.bookingStatus = 'confirmed';
        await booking.save();

        // Gửi email xác nhận
        try {
            const field = await Field.findById(booking.field);
            await sendBookingConfirmation(booking.user.email, {
                fieldName: field.name,
                date: new Date(booking.date).toLocaleDateString(),
                shift: booking.shift,
                team1: booking.team1,
                team2: booking.team2,
                totalPrice: booking.totalPrice
            });
        } catch (emailError) {
            logger.error('Error sending confirmation email:', emailError);
        }

        res.json({
            success: true,
            message: 'Booking confirmed successfully',
            data: booking
        });
    } catch (error) {
        logger.error('Error confirming booking:', error);
        res.status(500).json({
            success: false,
            message: 'Error confirming booking',
            error: error.message
        });
    }
};

// Thêm hàm mới để admin từ chối booking
exports.rejectBooking = async (req, res) => {
    try {
        const { rejectionReason } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        if (booking.bookingStatus !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Booking is not in pending status'
            });
        }

        booking.bookingStatus = 'rejected';
        booking.rejectionReason = rejectionReason;
        await booking.save();

        // Gửi email từ chối
        try {
            const field = await Field.findById(booking.field);
            await sendBookingRejection(booking.user.email, {
                fieldName: field.name,
                date: new Date(booking.date).toLocaleDateString(),
                shift: booking.shift,
                team1: booking.team1,
                team2: booking.team2,
                rejectionReason
            });
        } catch (emailError) {
            logger.error('Error sending rejection email:', emailError);
        }

        res.json({
            success: true,
            message: 'Booking rejected successfully',
            data: booking
        });
    } catch (error) {
        logger.error('Error rejecting booking:', error);
        res.status(500).json({
            success: false,
            message: 'Error rejecting booking',
            error: error.message
        });
    }
};

// Lấy danh sách tất cả booking (admin)
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('field', 'name')
            .populate('user', 'email name')
            .sort({ date: -1, 'shift.startTime': 1 });

        res.json({
            success: true,
            data: bookings
        });
    } catch (error) {
        logger.error('Error getting all bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting bookings',
            error: error.message
        });
    }
};

// Lấy danh sách ca còn trống cho một sân vào một ngày
exports.getAvailableShifts = async (req, res) => {
    try {
        const { fieldId, date } = req.query;

        if (!fieldId || !date) {
            return res.status(400).json({
                success: false,
                message: 'Field ID and date are required'
            });
        }

        // Kiểm tra sân có tồn tại
        const field = await Field.findById(fieldId);
        if (!field) {
            return res.status(404).json({
                success: false,
                message: 'Field not found'
            });
        }

        // Lấy tất cả booking của sân trong ngày
        const bookingDate = new Date(date);
        bookingDate.setUTCHours(0, 0, 0, 0);

        const bookings = await Booking.find({
            field: fieldId,
            date: {
                $gte: bookingDate,
                $lt: new Date(bookingDate.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        // Lấy danh sách ca từ model Booking
        const shifts = await Booking.getShifts();

        // Tạo map các ca với thông tin trạng thái
        const availableShifts = shifts.map(shift => {
            const booking = bookings.find(b => b.shift.name === shift.name);
            return {
                shift: shift.name,
                startTime: shift.startTime,
                endTime: shift.endTime,
                isAvailable: !booking || booking.bookingStatus === 'cancelled' || booking.bookingStatus === 'rejected',
                price: field.price * 2 // Mỗi ca 2 tiếng
            };
        }).filter(shift => shift.isAvailable);

        res.json({
            success: true,
            data: {
                field: {
                    id: field._id,
                    name: field.name
                },
                date: date,
                availableShifts: availableShifts
            }
        });
    } catch (error) {
        logger.error('Error getting available shifts:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting available shifts',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Lấy thông tin tất cả các ca của một sân trong một ngày
exports.getFieldShifts = async (req, res) => {
    try {
        const { fieldId, date } = req.query;

        if (!fieldId || !date) {
            return res.status(400).json({
                success: false,
                message: 'Field ID and date are required'
            });
        }

        // Kiểm tra sân có tồn tại
        const field = await Field.findById(fieldId);
        if (!field) {
            return res.status(404).json({
                success: false,
                message: 'Field not found'
            });
        }

        // Lấy tất cả booking của sân trong ngày
        const bookingDate = new Date(date);
        bookingDate.setUTCHours(0, 0, 0, 0);

        const bookings = await Booking.find({
            field: fieldId,
            date: {
                $gte: bookingDate,
                $lt: new Date(bookingDate.getTime() + 24 * 60 * 60 * 1000)
            }
        }).populate('user', 'name email');

        // Lấy danh sách ca từ model Booking
        const shifts = await Booking.getShifts();

        // Tạo map các ca với thông tin booking
        const shiftsWithBookings = shifts.map(shift => {
            const booking = bookings.find(b => b.shift.name === shift.name);
            return {
                shift: shift.name,
                startTime: shift.startTime,
                endTime: shift.endTime,
                isAvailable: !booking || booking.bookingStatus === 'cancelled' || booking.bookingStatus === 'rejected',
                booking: booking && booking.bookingStatus !== 'cancelled' && booking.bookingStatus !== 'rejected' ? {
                    id: booking._id,
                    team1: booking.team1,
                    team2: booking.team2,
                    bookingStatus: booking.bookingStatus,
                    user: {
                        name: booking.user.name,
                        email: booking.user.email
                    }
                } : null
            };
        });

        res.json({
            success: true,
            data: {
                field: {
                    id: field._id,
                    name: field.name
                },
                date: date,
                shifts: shiftsWithBookings
            }
        });
    } catch (error) {
        logger.error('Error getting field shifts:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting field shifts',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}; 