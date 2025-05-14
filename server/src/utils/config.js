/**
 * Application configuration
 * Centralizes all configuration variables for the application
 */
const config = {
    // Server configuration
    server: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development',
        jwtSecret: process.env.JWT_SECRET || 'your_default_secret_key_for_dev',
        jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d'
    },

    // Database configuration
    database: {
        dialect: 'sqlite',
        storage: process.env.DB_STORAGE || 'database/booking_system.db',
        logging: process.env.NODE_ENV === 'development'
    },

    // Email configuration (for future implementation)
    email: {
        from: process.env.EMAIL_FROM || 'noreply@footballbooking.com',
        service: process.env.EMAIL_SERVICE,
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    },

    // File upload configuration
    upload: {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedFileTypes: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    },

    // Payment deposit percentage
    payment: {
        depositPercentage: 30 // 30% of total booking price
    },

    // Booking settings
    booking: {
        minHours: 1,
        maxHours: 4,
        cancelTimeLimit: 24 // hours before booking time
    }
};

module.exports = config; 