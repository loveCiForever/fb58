require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const logger = require('../config/logger');
const connectDB = require('../config/database');

// Connect to database
connectDB();

const validateAdminCredentials = () => {
    const errors = [];

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!process.env.ADMIN_EMAIL || !emailRegex.test(process.env.ADMIN_EMAIL)) {
        errors.push('ADMIN_EMAIL must be a valid email address');
    }

    // Validate password
    if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD.length < 6) {
        errors.push('ADMIN_PASSWORD must be at least 6 characters long');
    }

    // Validate name
    if (!process.env.ADMIN_NAME || process.env.ADMIN_NAME.length < 2) {
        errors.push('ADMIN_NAME must be at least 2 characters long');
    }

    // Validate phone
    const phoneRegex = /^[0-9]{10}$/;
    if (!process.env.ADMIN_PHONE || !phoneRegex.test(process.env.ADMIN_PHONE)) {
        errors.push('ADMIN_PHONE must be a valid 10-digit phone number');
    }

    return errors;
};

const createAdminAccount = async () => {
    try {
        // Validate environment variables
        const validationErrors = validateAdminCredentials();
        if (validationErrors.length > 0) {
            logger.error('Environment variables validation failed:');
            validationErrors.forEach(error => logger.error(`- ${error}`));
            return;
        }

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
        if (existingAdmin) {
            logger.info('Admin account already exists');
            return;
        }

        // Create admin account
        const admin = await User.create({
            name: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD, // Let the model's pre-save middleware handle hashing
            phone: process.env.ADMIN_PHONE,
            role: 'admin',
            isVerified: true // Auto verify admin account
        });

        logger.info('Admin account created successfully:');
        logger.info(`- Name: ${admin.name}`);
        logger.info(`- Email: ${admin.email}`);
        logger.info(`- Phone: ${admin.phone}`);
        logger.info(`- Role: ${admin.role}`);

        // Verify the account was created correctly
        const verifyAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL }).select('+password');
        if (verifyAdmin) {
            logger.info('Admin account verified in database');
        } else {
            logger.error('Failed to verify admin account in database');
        }
    } catch (error) {
        logger.error('Error creating admin account:', error);
    } finally {
        // Close database connection
        await mongoose.connection.close();
    }
};

// Run the script
createAdminAccount();