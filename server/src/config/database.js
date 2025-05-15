const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

module.exports = {
    development: {
        dialect: 'sqlite',
        storage: process.env.DATABASE_PATH || path.join(__dirname, '../../database/football-field.sqlite'),
        logging: console.log,
        define: {
            timestamps: true,
            underscored: true
        }
    },
    test: {
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
        define: {
            timestamps: true,
            underscored: true
        }
    },
    production: {
        dialect: 'sqlite',
        storage: process.env.DATABASE_PATH || path.join(__dirname, '../../database/football-field.sqlite'),
        logging: false,
        define: {
            timestamps: true,
            underscored: true
        }
    }
}; 