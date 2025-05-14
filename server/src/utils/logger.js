const winston = require('winston');
const path = require('path');

// Define log formats
const formats = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(info => {
        return `${info.timestamp} ${info.level}: ${info.message} ${info.stack || (typeof info.meta === 'object' ? JSON.stringify(info.meta) : info.meta || '')
            }`;
    })
);

// Create logger instance
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: formats,
    transports: [
        // Console transport
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                formats
            )
        }),
        // File transport for all logs
        new winston.transports.File({
            filename: path.join('logs', 'combined.log'),
            maxsize: 10485760, // 10MB
            maxFiles: 5
        }),
        // Separate file for error logs
        new winston.transports.File({
            filename: path.join('logs', 'error.log'),
            level: 'error',
            maxsize: 10485760, // 10MB
            maxFiles: 5
        })
    ],
    // Prevent exit on error
    exitOnError: false
});

// Create log directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
}

module.exports = logger; 