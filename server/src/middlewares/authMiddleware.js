const jwt = require('jsonwebtoken');
const { User, UserSession } = require('../models');
const { validateSession } = require('../utils/auth');
const ApiError = require('../utils/apiError');

/**
 * Protect routes - Authentication middleware
 * Verifies JWT token and adds user to request
 */
exports.protect = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(new ApiError('Access denied. No token provided.', 401));
        }

        const token = authHeader.split(' ')[1];

        // Validate session
        const session = await validateSession(token);
        if (!session) {
            return next(new ApiError('Invalid or expired session. Please login again.', 401));
        }

        // Get user
        const user = await User.findByPk(session.userId);
        if (!user) {
            return next(new ApiError('User not found.', 401));
        }

        // Check if this is the current active device
        if (user.deviceId !== session.deviceId) {
            return next(
                new ApiError('You have been logged out because you logged in from another device.', 401)
            );
        }

        // Add admin flag for easier access
        user.isAdmin = user.role === 'admin';

        // Set user on request object
        req.user = user;
        req.session = session;
        req.token = token;

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        next(new ApiError('Authentication failed. Please try again.', 500));
    }
};

/**
 * Authorization middleware for role-based access control
 * @param {...string} roles - Allowed roles
 */
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // Check if user role is included in the allowed roles
        if (!roles.includes(req.user.role)) {
            return next(
                new ApiError(`Access denied. ${roles.join('/')} permission required.`, 403)
            );
        }
        next();
    };
};

/**
 * Middleware to check if user is verified
 */
exports.requireVerified = (req, res, next) => {
    if (!req.user.isVerified) {
        return next(
            new ApiError('Account not verified. Please verify your account first.', 403)
        );
    }
    next();
}; 