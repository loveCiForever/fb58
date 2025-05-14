const bcrypt = require('bcryptjs');
const { User, Field, Service } = require('../models');
const logger = require('./logger');

/**
 * Seed initial admin user
 * @returns {Promise<void>}
 */
const seedAdminUser = async () => {
    try {
        const adminExists = await User.findOne({ where: { email: 'admin@example.com' } });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);

            await User.create({
                name: 'Admin User',
                email: 'admin@example.com',
                phone: '0123456789',
                password: hashedPassword,
                role: 'admin',
                isVerified: true
            });

            logger.info('Admin user seeded successfully');
        }
    } catch (error) {
        logger.error('Error seeding admin user:', error);
    }
};

/**
 * Seed initial fields
 * @returns {Promise<void>}
 */
const seedFields = async () => {
    try {
        const fieldsCount = await Field.count();

        if (fieldsCount === 0) {
            const fields = [
                {
                    name: 'Field 1',
                    description: 'Standard 5-a-side field with artificial grass',
                    type: '5-a-side',
                    price: 200000,
                    priceWithLights: 250000,
                    openTime: '07:00',
                    closeTime: '22:00',
                    status: 'available'
                },
                {
                    name: 'Field 2',
                    description: 'Standard 7-a-side field with artificial grass',
                    type: '7-a-side',
                    price: 300000,
                    priceWithLights: 350000,
                    openTime: '07:00',
                    closeTime: '22:00',
                    status: 'available'
                },
                {
                    name: 'Field 3',
                    description: 'Premium 11-a-side field with natural grass',
                    type: '11-a-side',
                    price: 500000,
                    priceWithLights: 600000,
                    openTime: '07:00',
                    closeTime: '22:00',
                    status: 'available'
                }
            ];

            await Field.bulkCreate(fields);
            logger.info('Fields seeded successfully');
        }
    } catch (error) {
        logger.error('Error seeding fields:', error);
    }
};

/**
 * Seed initial services
 * @returns {Promise<void>}
 */
const seedServices = async () => {
    try {
        const servicesCount = await Service.count();

        if (servicesCount === 0) {
            const services = [
                {
                    name: 'Football',
                    description: 'Rent a football',
                    price: 50000,
                    category: 'equipment',
                    status: 'active'
                },
                {
                    name: 'Referee',
                    description: 'Professional referee service',
                    price: 200000,
                    category: 'staff',
                    status: 'active'
                },
                {
                    name: 'Bibs Set',
                    description: 'Set of colored bibs for team identification',
                    price: 100000,
                    category: 'equipment',
                    status: 'active'
                },
                {
                    name: 'Water Dispenser',
                    description: 'Water dispenser with cups',
                    price: 70000,
                    category: 'refreshments',
                    status: 'active'
                }
            ];

            await Service.bulkCreate(services);
            logger.info('Services seeded successfully');
        }
    } catch (error) {
        logger.error('Error seeding services:', error);
    }
};

/**
 * Seed all initial data
 * @returns {Promise<void>}
 */
const seedInitialData = async () => {
    try {
        await seedAdminUser();
        await seedFields();
        await seedServices();

        logger.info('All initial data seeded successfully');
    } catch (error) {
        logger.error('Error seeding initial data:', error);
        throw error;
    }
};

module.exports = {
    seedInitialData
}; 