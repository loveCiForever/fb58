/**
 * Middleware to format all API responses
 * Format: { success: boolean, message: string, data: any }
 */
const formatResponse = (req, res, next) => {
    // Store the original res.json function
    const originalJson = res.json;

    // Override res.json
    res.json = function (data) {
        // Check if the response is already formatted
        if (data && (data.success !== undefined || data.error)) {
            return originalJson.call(this, data);
        }

        // Format the response
        let formattedResponse = {
            success: res.statusCode < 400,
            message: data.message || (res.statusCode < 400 ? 'fetching data successful' : 'operation failed'),
            data: {}
        };

        // If there's a message, keep it separate and remove from data to avoid duplication
        if (data.message) {
            formattedResponse.message = data.message;
            const { message, ...rest } = data;
            formattedResponse.data = rest;
        } else {
            // If no message, all content goes to data
            formattedResponse.data = data;
        }

        // If it's an error response (4xx, 5xx), handle differently
        if (res.statusCode >= 400) {
            formattedResponse.success = false;

            if (data.message) {
                formattedResponse.message = data.message;
            } else if (typeof data === 'string') {
                formattedResponse.message = data;
            } else {
                formattedResponse.message = 'An error occurred';
            }

            // Include error details if available
            if (data.error) {
                formattedResponse.error = data.error;
            }

            // For validation errors
            if (data.errors) {
                formattedResponse.errors = data.errors;
            }
        }

        // Call the original json function with our formatted response
        return originalJson.call(this, formattedResponse);
    };

    // Continue to the next middleware
    next();
};

module.exports = formatResponse; 