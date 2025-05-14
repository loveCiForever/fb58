const jwt = require('jsonwebtoken');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

/**
 * Generate JWT token for authenticated user
 * 
 * @param {object} user - User object
 * @returns {string} JWT token
 */
const generateToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role
    };

    return jwt.sign(
        payload,
        process.env.JWT_SECRET || 'your_default_secret_key_for_dev',
        { expiresIn: '1d' }
    );
};

/**
 * Authenticate users by validating JWT token
 */
const authenticate = catchAsync(async (req, res, next) => {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError('Access denied. No token provided', 401);
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    try {
        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'your_default_secret_key_for_dev'
        );

        // Find user by id
        const user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            throw new ApiError('User with this token no longer exists', 401);
        }

        // Add user to request
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            throw new ApiError('Invalid token', 401);
        }
        if (error.name === 'TokenExpiredError') {
            throw new ApiError('Token expired', 401);
        }
        throw error;
    }
});

/**
 * Check if the user is an admin
 */
const isAdmin = catchAsync(async (req, res, next) => {
    if (!req.user) {
        throw new ApiError('Authentication required', 401);
    }

    if (req.user.role !== 'admin') {
        throw new ApiError('Access denied. Admin privileges required', 403);
    }

    next();
});

/**
 * Check if the user is a staff member or admin
 */
const isStaffOrAdmin = catchAsync(async (req, res, next) => {
    if (!req.user) {
        throw new ApiError('Authentication required', 401);
    }

    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
        throw new ApiError('Access denied. Staff privileges required', 403);
    }

    next();
});

module.exports = {
    generateToken,
    authenticate,
    isAdmin,
    isStaffOrAdmin
};