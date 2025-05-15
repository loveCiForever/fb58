const bcrypt = require('bcryptjs');
const { sequelize, User, Field, Service } = require('../models');
const { syncDatabase } = require('./syncDatabase');
const winston = require('winston');

// Set up logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: 'football-field-api' },
    transports: [
        new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: './logs/combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

// Sample data
const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        phone: '0123456789',
        password: 'admin123',
        isVerified: true,
        role: 'admin'
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '0987654321',
        password: 'password123',
        isVerified: true,
        role: 'user'
    }
];

const fields = [
    {
        name: 'Field 1',
        address: '123 Main St, City',
        description: 'A 5-a-side artificial grass field with good lighting',
        size: '5',
        type: 'artificial',
        pricePerHour: 200000,
        openTime: '08:00',
        closeTime: '22:00',
        images: ['field1-1.jpg', 'field1-2.jpg'],
        facilities: ['parking', 'shower', 'locker']
    },
    {
        name: 'Field 2',
        address: '456 Secondary St, City',
        description: 'A 7-a-side natural grass field suitable for small teams',
        size: '7',
        type: 'natural',
        pricePerHour: 300000,
        openTime: '07:00',
        closeTime: '21:00',
        images: ['field2-1.jpg', 'field2-2.jpg'],
        facilities: ['parking', 'shower']
    },
    {
        name: 'Indoor Field',
        address: '789 Third St, City',
        description: 'Indoor 5-a-side field with air conditioning',
        size: '5',
        type: 'indoor',
        pricePerHour: 350000,
        openTime: '08:00',
        closeTime: '23:00',
        images: ['field3-1.jpg', 'field3-2.jpg'],
        facilities: ['parking', 'shower', 'locker', 'refreshments']
    },
    {
        name: 'Premier Field',
        address: '101 Main Blvd, City',
        description: 'Full size 11-a-side field with professional setup',
        size: '11',
        type: 'natural',
        pricePerHour: 500000,
        openTime: '07:00',
        closeTime: '20:00',
        images: ['field4-1.jpg', 'field4-2.jpg'],
        facilities: ['parking', 'shower', 'locker', 'restaurant']
    }
];

const services = [
    {
        name: 'Soccer Ball',
        description: 'Professional match ball',
        price: 50000,
        category: 'equipment',
        image: 'ball.jpg'
    },
    {
        name: 'Referee Service',
        description: 'Professional referee for your match',
        price: 200000,
        category: 'staff',
        image: 'referee.jpg'
    },
    {
        name: 'Bibs/Training Vests',
        description: 'Set of 7 bibs in team colors',
        price: 70000,
        category: 'equipment',
        image: 'bibs.jpg'
    },
    {
        name: 'Water Package',
        description: '10 bottles of mineral water',
        price: 50000,
        category: 'facility',
        image: 'water.jpg'
    },
    {
        name: 'Video Recording',
        description: 'Professional video recording of your match',
        price: 300000,
        category: 'other',
        image: 'video.jpg'
    }
];

/**
 * Seed database with initial data
 */
const seedDatabase = async (force = false) => {
    try {
        // Sync database
        await syncDatabase(force);
        logger.info('Database synchronized');

        // Add admin and sample user
        for (const userData of users) {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            await User.create({
                ...userData,
                password: hashedPassword
            });
        }
        logger.info('Users seeded successfully');

        // Add fields
        await Field.bulkCreate(fields);
        logger.info('Fields seeded successfully');

        // Add services
        await Service.bulkCreate(services);
        logger.info('Services seeded successfully');

        logger.info('Database seeded successfully');
        return true;
    } catch (error) {
        logger.error('Error seeding database:', error);
        return false;
    }
};

// If this script is run directly
if (require.main === module) {
    const force = process.argv.includes('--force');

    (async () => {
        const success = await seedDatabase(force);

        if (success) {
            logger.info('Database seeding completed successfully');
            process.exit(0);
        } else {
            logger.error('Database seeding failed');
            process.exit(1);
        }
    })();
}

module.exports = {
    seedDatabase
}; 