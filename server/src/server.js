require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');
const { seedInitialData } = require('./utils/seedData');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Graceful shutdown function
const gracefulShutdown = async (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);

    try {
        // Close database connection
        await sequelize.close();
        logger.info('Database connection closed');

        // Exit process
        process.exit(0);
    } catch (error) {
        logger.error('Error during shutdown:', error);
        process.exit(1);
    }
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Capture uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('UNCAUGHT EXCEPTION:', error);
    process.exit(1);
});

// Capture unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('UNHANDLED REJECTION:', reason);
    // Close server & exit process
    process.exit(1);
});

// Start server function
const startServer = async () => {
    try {
        // Check database connection
        await sequelize.authenticate();
        logger.info('Database connection established successfully');

        // Sync database models
        const syncOptions = { alter: NODE_ENV === 'development' };
        await sequelize.sync(syncOptions);
        logger.info('Database synchronized successfully');

        // Seed initial data if in development mode
        if (NODE_ENV === 'development') {
            await seedInitialData();
            logger.info('Initial data seeded successfully');
        }

        // Start the server
        app.listen(PORT, () => {
            logger.info(`Server is running in ${NODE_ENV} mode on port ${PORT}`);
            logger.info(`API is available at http://localhost:${PORT}/api`);
        });
    } catch (error) {
        logger.error('Error starting server:', error);
        process.exit(1);
    }
};

// Start the server
startServer();