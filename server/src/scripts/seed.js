const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Field = require('../models/Field');
const logger = require('../config/logger');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        logger.info('MongoDB Connected');
    } catch (error) {
        logger.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const createAdmin = async () => {
    try {
        // Check if admin exists
        const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
        if (adminExists) {
            logger.info('Admin account already exists');
            return adminExists;
        }

        // Validate required environment variables
        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.ADMIN_NAME) {
            throw new Error('Missing required environment variables for admin account');
        }

        logger.info('Creating admin account with email:', process.env.ADMIN_EMAIL);

        // Create hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

        // Create admin account
        const admin = await User.create({
            name: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            password: hashedPassword,
            phone: process.env.ADMIN_PHONE || '0123456789',
            role: 'admin',
            isVerified: true
        });

        logger.info('Admin account created successfully:', {
            id: admin._id,
            email: admin.email,
            name: admin.name,
            role: admin.role
        });

        return admin;
    } catch (error) {
        logger.error('Error creating admin account:', error);
        throw error;
    }
};

const createFields = async (adminId) => {
    try {
        // Check if fields exist
        const fieldsCount = await Field.countDocuments();
        if (fieldsCount > 0) {
            logger.info('Fields already exist');
            return;
        }

        // Create sample fields
        const fields = [
            {
                name: 'My Dinh Stadium',
                short_description: 'Professional 5-a-side football field',
                full_description: 'High-quality artificial turf 5-a-side football field with floodlights and changing rooms',
                type: '5-a-side',
                price: 200000,
                priceWithLights: 250000,
                openTime: '06:00',
                closeTime: '23:00',
                status: 'available',
                image: 'field1.jpg',
                capacity: {
                    players: 10,
                    seats: 20
                },
                createdBy: adminId
            },
            {
                name: 'Hang Day Stadium',
                short_description: 'Professional 5-a-side football field',
                full_description: 'Artificial turf 5-a-side football field with floodlights and rest area',
                type: '5-a-side',
                price: 200000,
                priceWithLights: 250000,
                openTime: '06:00',
                closeTime: '23:00',
                status: 'available',
                image: 'field2.jpg',
                capacity: {
                    players: 10,
                    seats: 20
                },
                createdBy: adminId
            },
            {
                name: 'Thong Nhat Stadium',
                short_description: 'Professional 7-a-side football field',
                full_description: 'High-quality artificial turf 7-a-side football field with floodlights and spacious changing rooms',
                type: '7-a-side',
                price: 300000,
                priceWithLights: 350000,
                openTime: '06:00',
                closeTime: '23:00',
                status: 'available',
                image: 'field3.jpg',
                capacity: {
                    players: 14,
                    seats: 30
                },
                createdBy: adminId
            },
            {
                name: 'Thanh Long Stadium',
                short_description: 'Professional 7-a-side football field',
                full_description: 'Artificial turf 7-a-side football field with floodlights and comfortable rest area',
                type: '7-a-side',
                price: 300000,
                priceWithLights: 350000,
                openTime: '06:00',
                closeTime: '23:00',
                status: 'available',
                image: 'field4.jpg',
                capacity: {
                    players: 14,
                    seats: 30
                },
                createdBy: adminId
            },
            {
                name: 'National Stadium',
                short_description: 'Professional 11-a-side football field',
                full_description: 'Natural grass 11-a-side football field with floodlights, changing rooms, and spectator stands',
                type: '11-a-side',
                price: 500000,
                priceWithLights: 600000,
                openTime: '06:00',
                closeTime: '23:00',
                status: 'available',
                image: 'field5.jpg',
                capacity: {
                    players: 22,
                    seats: 100
                },
                createdBy: adminId
            }
        ];

        // Create fields
        await Field.insertMany(fields);
        logger.info('Sample fields created successfully');
    } catch (error) {
        logger.error('Error creating sample fields:', error);
        throw error;
    }
};

const seed = async () => {
    try {
        await connectDB();
        const admin = await createAdmin();
        await createFields(admin._id);
        logger.info('Seeding completed successfully');
        process.exit(0);
    } catch (error) {
        logger.error('Error seeding database:', error);
        process.exit(1);
    }
};

seed(); 