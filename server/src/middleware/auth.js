const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../config/logger');

// Middleware to protect routes
exports.protect = async (req, res, next) => {
    try {
        let token;

        // Check if authorization header exists and starts with Bearer
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            logger.warn('No token provided in request');
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user and check if token matches active token
            const user = await User.findById(decoded.id);

            if (!user) {
                logger.warn(`User not found for token: ${token}`);
                return res.status(401).json({
                    success: false,
                    message: 'Not authorized to access this route'
                });
            }

            // Check if token matches active token
            if (user.activeToken !== token) {
                logger.warn(`Token mismatch for user ${user._id}`);
                return res.status(401).json({
                    success: false,
                    message: 'Session expired or invalid'
                });
            }

            req.user = user;
            next();
        } catch (error) {
            logger.error('Token verification failed:', error);
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }
    } catch (error) {
        logger.error('Error in protect middleware:', error);
        next(error);
    }
};

// Middleware to check user role
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            logger.warn(`User ${req.user._id} with role ${req.user.role} attempted to access restricted route`);
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
}; 