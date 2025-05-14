/**
 * Custom error class for API errors
 * Used to create operational errors that will be sent to clients
 * 
 * @class ApiError
 * @extends Error
 */
class ApiError extends Error {
    /**
     * Create an API error
     * 
     * @param {string} message - Error message
     * @param {number} statusCode - HTTP status code
     * @param {boolean} isOperational - Whether this is an operational error
     */
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ApiError; 