// Response formatter middleware
const responseFormatter = (req, res, next) => {
    // Success response
    res.success = (message, data = null, statusCode = 200) => {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    };

    // Error response
    res.error = (message, error = null, statusCode = 500) => {
        return res.status(statusCode).json({
            success: false,
            message,
            error: error?.message || error,
        });
    };

    // Bad request response
    res.badRequest = (message, error = null) => {
        return res.status(400).json({
            success: false,
            message,
            error: error?.message || error,
        });
    };

    // Unauthorized response
    res.unauthorized = (message, error = null) => {
        return res.status(401).json({
            success: false,
            message,
            error: error?.message || error,
        });
    };

    // Forbidden response
    res.forbidden = (message, error = null) => {
        return res.status(403).json({
            success: false,
            message,
            error: error?.message || error,
        });
    };

    // Not found response
    res.notFound = (message, error = null) => {
        return res.status(404).json({
            success: false,
            message,
            error: error?.message || error,
        });
    };

    next();
};

export default responseFormatter; 