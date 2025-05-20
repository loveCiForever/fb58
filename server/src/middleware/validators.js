const { body, validationResult } = require('express-validator');

// Middleware để xử lý kết quả validation
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: errors.array()
        });
    }
    next();
};

// Update profile validation
const updateProfileValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('phone')
        .optional()
        .trim()
        .matches(/^[0-9]{10}$/)
        .withMessage('Phone number must be 10 digits'),
    validateRequest
];

// Change password validation
const changePasswordValidation = [
    body('currentPassword')
        .trim()
        .notEmpty()
        .withMessage('Please enter your current password'),
    body('newPassword')
        .trim()
        .notEmpty()
        .withMessage('Please enter a new password')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
        .custom((value, { req }) => {
            if (value === req.body.currentPassword) {
                throw new Error('New password must be different from current password');
            }
            return true;
        }),
    validateRequest
];

// Create field validation
const createFieldValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Field name must be between 2 and 100 characters'),
    body('short_description')
        .trim()
        .isLength({ min: 10, max: 200 })
        .withMessage('Short description must be between 10 and 200 characters'),
    body('full_description')
        .trim()
        .isLength({ min: 50 })
        .withMessage('Full description must be at least 50 characters long'),
    body('grass_type')
        .isIn(['natural', 'artificial'])
        .withMessage('Grass type must be either natural or artificial'),
    body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('capacity.players')
        .isInt({ min: 1 })
        .withMessage('Number of players must be at least 1'),
    body('capacity.seats')
        .isInt({ min: 0 })
        .withMessage('Number of seats cannot be negative'),
    validateRequest
];

// Create booking validation
const createBookingValidation = [
    body('field')
        .notEmpty().withMessage('Field ID is required')
        .isMongoId().withMessage('Invalid field ID'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isDate().withMessage('Invalid date format')
        .custom((value) => {
            const bookingDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            bookingDate.setHours(0, 0, 0, 0);

            if (bookingDate < today) {
                throw new Error('Cannot book for past dates');
            }

            const maxDate = new Date();
            maxDate.setDate(maxDate.getDate() + 30);
            if (bookingDate > maxDate) {
                throw new Error('Cannot book more than 30 days in advance');
            }

            return true;
        }),
    body('shift')
        .notEmpty().withMessage('Shift is required')
        .isIn(['SHIFT_1', 'SHIFT_2', 'SHIFT_3', 'SHIFT_4', 'SHIFT_5', 'SHIFT_6', 'SHIFT_7', 'SHIFT_8'])
        .withMessage('Invalid shift'),
    body('team1')
        .notEmpty().withMessage('Team 1 name is required')
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('Team 1 name must be between 2 and 50 characters'),
    body('team2')
        .notEmpty().withMessage('Team 2 name is required')
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('Team 2 name must be between 2 and 50 characters'),
    validateRequest
];

// Cancel booking validation
const cancelBookingValidation = [
    body('cancellationReason')
        .notEmpty()
        .withMessage('Cancellation reason is required')
        .trim()
        .isLength({ min: 10, max: 500 })
        .withMessage('Cancellation reason must be between 10 and 500 characters'),
    validateRequest
];

// Reject booking validation
const rejectBookingValidation = [
    body('rejectionReason')
        .notEmpty()
        .withMessage('Rejection reason is required')
        .trim()
        .isLength({ min: 10, max: 500 })
        .withMessage('Rejection reason must be between 10 and 500 characters'),
    validateRequest
];

module.exports = {
    validateRequest,
    updateProfileValidation,
    changePasswordValidation,
    createFieldValidation,
    createBookingValidation,
    cancelBookingValidation,
    rejectBookingValidation
}; 