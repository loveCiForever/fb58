const jwt = require('jsonwebtoken');
const { User, UserSession } = require('../models');
const { validateSession } = require('../utils/auth');

/**
 * Authentication middleware
 * Verifies JWT token and adds user to request
 */
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.',
                data: {}
            });
        }

        const token = authHeader.split(' ')[1];

        // Validate session
        const session = await validateSession(token);
        if (!session) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired session. Please login again.',
                data: {}
            });
        }

        // Get user
        const user = await User.findByPk(session.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found.',
                data: {}
            });
        }

        // Check if this is the current active device
        if (user.deviceId !== session.deviceId) {
            return res.status(401).json({
                success: false,
                message: 'You have been logged out because you logged in from another device.',
                data: { forceLogout: true }
            });
        }

        // Set user on request object
        req.user = user;
        req.session = session;
        req.token = token;

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({
            success: false,
            message: 'Authentication failed. Please try again.',
            data: {}
        });
    }
};

/**
 * Authorization middleware for admin-only routes
 */
const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied. Admin permission required.',
            data: {}
        });
    }
};

/**
 * Middleware to check if user is verified
 */
const requireVerifiedUser = (req, res, next) => {
    if (req.user && req.user.isVerified) {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Account not verified. Please verify your account first.',
            data: {}
        });
    }
};

module.exports = {
    authenticate,
    authorizeAdmin,
    requireVerifiedUser
}; 