const logger = require('../utils/logger');

/**
 * Global error handling middleware
 * Handles all errors thrown in the application and formats them consistently
 */
const errorHandler = (err, req, res, next) => {
    // Log the error
    logger.error(`${err.name}: ${err.message}`, {
        path: req.path,
        method: req.method,
        stack: err.stack
    });

    // Set default error status and message
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal server error';

    // Handle specific error types
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        statusCode = 400;
        message = err.errors.map(e => e.message).join(', ');
    } else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token. Please log in again';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Your token has expired. Please log in again';
    }

    // Send the error response
    res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || undefined,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = errorHandler; 