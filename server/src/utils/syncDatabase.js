const { sequelize } = require('../models');
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

// Function to synchronize database
const syncDatabase = async (force = false) => {
    try {
        await sequelize.sync({ force });
        logger.info(`Database synchronized ${force ? 'with tables recreated' : ''}`);
        return true;
    } catch (error) {
        logger.error('Error synchronizing database:', error);
        return false;
    }
};

// Function to check database connection
const checkDatabaseConnection = async () => {
    try {
        await sequelize.authenticate();
        logger.info('Database connection established successfully');
        return true;
    } catch (error) {
        logger.error('Unable to connect to the database:', error);
        return false;
    }
};

// If this script is run directly
if (require.main === module) {
    const force = process.argv.includes('--force');

    (async () => {
        const isConnected = await checkDatabaseConnection();

        if (isConnected) {
            await syncDatabase(force);
            process.exit(0);
        } else {
            process.exit(1);
        }
    })();
}

module.exports = {
    syncDatabase,
    checkDatabaseConnection
}; 