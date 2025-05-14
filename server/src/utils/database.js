const { sequelize } = require('../models');

// Function to seed initial data
exports.seedInitialData = async () => {
    try {
        // Check if we have any admin users
        const { User, Field, Service } = require('../models');

        // Create admin user if none exists
        const adminCount = await User.count({ where: { role: 'admin' } });
        if (adminCount === 0) {
            await User.create({
                name: 'Admin User',
                email: 'admin@example.com',
                phone: '0123456789',
                password: 'admin123',
                role: 'admin',
                isVerified: true
            });
            console.log('Admin user created successfully');
        }

        // Create sample fields if none exist
        const fieldCount = await Field.count();
        if (fieldCount === 0) {
            await Field.bulkCreate([
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
            ]);
            console.log('Sample fields created successfully');
        }

        // Create sample services if none exist
        const serviceCount = await Service.count();
        if (serviceCount === 0) {
            await Service.bulkCreate([
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
                    name: 'Water (Case)',
                    description: 'A case of 24 water bottles',
                    price: 100000,
                    category: 'drinks',
                    status: 'active'
                },
                {
                    name: 'Jersey Set',
                    description: 'Set of jerseys for your team',
                    price: 150000,
                    category: 'equipment',
                    status: 'active'
                }
            ]);
            console.log('Sample services created successfully');
        }

        return true;
    } catch (error) {
        console.error('Error seeding data:', error);
        return false;
    }
};

// Function to check database connection
exports.checkDatabaseConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        return true;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return false;
    }
}; 