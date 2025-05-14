const path = require('path');

module.exports = {
    development: {
        dialect: 'sqlite',
        storage: path.join(__dirname, '../../database/booking_system.db'),
        logging: false
    },
    test: {
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false
    },
    production: {
        dialect: 'sqlite',
        storage: path.join(__dirname, '../../database/booking_system.db'),
        logging: false
    }
};