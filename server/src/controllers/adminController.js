const User = require('../models/User');
const Field = require('../models/Field');
const Booking = require('../models/Booking');
const logger = require('../config/logger');

// Get admin dashboard report
exports.getDashboardReport = async (req, res) => {
    try {
        // Get total counts
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalFields = await Field.countDocuments();
        const totalBookings = await Booking.countDocuments();

        // Get recent bookings (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentBookings = await Booking.find({
            createdAt: { $gte: sevenDaysAgo }
        }).populate('field', 'name').populate('user', 'name email');

        // Get booking statistics
        const bookingStats = await Booking.aggregate([
            {
                $group: {
                    _id: '$bookingStatus',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get revenue statistics
        const revenueStats = await Booking.aggregate([
            {
                $match: {
                    bookingStatus: 'confirmed',
                    paymentStatus: 'paid'
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$date' },
                        month: { $month: '$date' }
                    },
                    totalRevenue: { $sum: '$totalPrice' },
                    bookingCount: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': -1, '_id.month': -1 }
            },
            {
                $limit: 12 // Last 12 months
            }
        ]);

        // Get field popularity
        const fieldPopularity = await Booking.aggregate([
            {
                $match: {
                    bookingStatus: 'confirmed'
                }
            },
            {
                $group: {
                    _id: '$field',
                    bookingCount: { $sum: 1 },
                    totalRevenue: { $sum: '$totalPrice' }
                }
            },
            {
                $lookup: {
                    from: 'fields',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'fieldInfo'
                }
            },
            {
                $unwind: '$fieldInfo'
            },
            {
                $project: {
                    fieldName: '$fieldInfo.name',
                    bookingCount: 1,
                    totalRevenue: 1
                }
            },
            {
                $sort: { bookingCount: -1 }
            }
        ]);

        // Get peak booking times
        const peakTimes = await Booking.aggregate([
            {
                $match: {
                    bookingStatus: 'confirmed'
                }
            },
            {
                $group: {
                    _id: '$shift',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        res.json({
            success: true,
            data: {
                overview: {
                    totalUsers,
                    totalFields,
                    totalBookings
                },
                recentBookings: recentBookings.map(booking => ({
                    id: booking._id,
                    field: booking.field.name,
                    user: {
                        name: booking.user.name,
                        email: booking.user.email
                    },
                    date: booking.date,
                    shift: booking.shift,
                    totalPrice: booking.totalPrice,
                    bookingStatus: booking.bookingStatus,
                    paymentStatus: booking.paymentStatus
                })),
                bookingStats: bookingStats.reduce((acc, stat) => {
                    acc[stat._id] = stat.count;
                    return acc;
                }, {}),
                revenueStats: revenueStats.map(stat => ({
                    period: `${stat._id.year}-${stat._id.month}`,
                    totalRevenue: stat.totalRevenue,
                    bookingCount: stat.bookingCount
                })),
                fieldPopularity,
                peakTimes: peakTimes.map(time => ({
                    shift: time._id,
                    bookingCount: time.count
                }))
            }
        });
    } catch (error) {
        logger.error('Error getting dashboard report:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting dashboard report',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// User Management
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password');
        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        logger.error('Error getting users:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting users',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        logger.error('Error getting user:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting user',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { name, email, phone, isVerified } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, phone, isVerified },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        logger.error('Error updating user:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        logger.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Field Management
exports.getAllFields = async (req, res) => {
    try {
        const fields = await Field.find();
        res.json({
            success: true,
            data: fields
        });
    } catch (error) {
        logger.error('Error getting fields:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting fields',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.getFieldById = async (req, res) => {
    try {
        const field = await Field.findById(req.params.id);
        if (!field) {
            return res.status(404).json({
                success: false,
                message: 'Field not found'
            });
        }
        res.json({
            success: true,
            data: field
        });
    } catch (error) {
        logger.error('Error getting field:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting field',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.createField = async (req, res) => {
    try {
        const field = await Field.create({
            ...req.body,
            createdBy: req.user._id
        });
        res.status(201).json({
            success: true,
            data: field
        });
    } catch (error) {
        logger.error('Error creating field:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating field',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.updateField = async (req, res) => {
    try {
        const field = await Field.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!field) {
            return res.status(404).json({
                success: false,
                message: 'Field not found'
            });
        }
        res.json({
            success: true,
            data: field
        });
    } catch (error) {
        logger.error('Error updating field:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating field',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.deleteField = async (req, res) => {
    try {
        const field = await Field.findByIdAndDelete(req.params.id);
        if (!field) {
            return res.status(404).json({
                success: false,
                message: 'Field not found'
            });
        }
        res.json({
            success: true,
            message: 'Field deleted successfully'
        });
    } catch (error) {
        logger.error('Error deleting field:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting field',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}; 