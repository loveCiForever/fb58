const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { User, UserSession, sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * Generate a random verification code
 * @returns {string} 6-digit code
 */
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate a JWT token
 * @param {object} user - User object
 * @param {string} deviceId - Device ID
 * @returns {string} JWT token
 */
const generateToken = (user, deviceId) => {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
        deviceId
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

/**
 * Generate a unique device ID
 * @param {object} req - Express request object
 * @returns {string} Device ID
 */
const generateDeviceId = (req) => {
    const userAgent = req.headers['user-agent'] || '';
    const ip = req.ip || req.connection.remoteAddress;
    const random = crypto.randomBytes(8).toString('hex');

    return crypto
        .createHash('sha256')
        .update(`${userAgent}${ip}${random}`)
        .digest('hex');
};

/**
 * Get device info from request
 * @param {object} req - Express request object
 * @returns {object} Device information
 */
const getDeviceInfo = (req) => {
    return {
        userAgent: req.headers['user-agent'],
        ip: req.ip || req.connection.remoteAddress,
        timestamp: new Date()
    };
};

/**
 * Create a new user session
 * @param {number} userId - User ID
 * @param {string} token - JWT token
 * @param {string} deviceId - Device ID
 * @param {object} deviceInfo - Device information
 * @returns {Promise<object>} Created session
 */
const createUserSession = async (userId, token, deviceId, deviceInfo) => {
    // Calculate expiry date from JWT_EXPIRES_IN
    const expiresInMs = ms(process.env.JWT_EXPIRES_IN || '7d');
    const expiresAt = new Date(Date.now() + expiresInMs);

    // Create session in database
    const session = await UserSession.create({
        userId,
        token,
        deviceId,
        deviceInfo,
        ipAddress: deviceInfo.ip,
        lastActivity: new Date(),
        expiresAt
    });

    // Update the user's deviceId and deviceInfo
    await User.update(
        {
            deviceId,
            deviceInfo,
            lastLogin: new Date()
        },
        { where: { id: userId } }
    );

    return session;
};

/**
 * Handle single device login policy - invalidate other sessions
 * @param {number} userId - User ID
 * @param {string} deviceId - Current device ID
 * @returns {Promise<void>}
 */
const enforceSingleDevicePolicy = async (userId, deviceId) => {
    // Invalidate all other active sessions for this user
    await UserSession.invalidateOtherSessions(userId, deviceId);
};

/**
 * Validate a session
 * @param {string} token - JWT token
 * @returns {Promise<object|null>} User session or null
 */
const validateSession = async (token) => {
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the session
        const session = await UserSession.findOne({
            where: {
                userId: decoded.id,
                deviceId: decoded.deviceId,
                token,
                isActive: true,
                expiresAt: { [Op.gt]: new Date() }
            }
        });

        if (!session) {
            return null;
        }

        // Update last activity
        await session.update({ lastActivity: new Date() });

        return session;
    } catch (error) {
        return null;
    }
};

/**
 * Invalidate a session (logout)
 * @param {string} token - JWT token
 * @returns {Promise<boolean>} Success status
 */
const invalidateSession = async (token) => {
    try {
        // Find the session
        const session = await UserSession.findOne({
            where: { token }
        });

        if (!session) {
            return false;
        }

        // Update session and user
        await session.update({ isActive: false });
        await User.update(
            { deviceId: null, deviceInfo: null },
            { where: { id: session.userId } }
        );

        return true;
    } catch (error) {
        console.error('Error invalidating session:', error);
        return false;
    }
};

// Utility to parse duration strings like '7d', '24h' to milliseconds
function ms(val) {
    const regex = /^(\d+)([smhdw])$/;
    const match = val.match(regex);

    if (!match) return 0;

    const num = parseInt(match[1], 10);
    const type = match[2];

    switch (type) {
        case 's': return num * 1000; // seconds
        case 'm': return num * 60 * 1000; // minutes
        case 'h': return num * 60 * 60 * 1000; // hours
        case 'd': return num * 24 * 60 * 60 * 1000; // days
        case 'w': return num * 7 * 24 * 60 * 60 * 1000; // weeks
        default: return 0;
    }
}

module.exports = {
    generateVerificationCode,
    generateToken,
    generateDeviceId,
    getDeviceInfo,
    createUserSession,
    enforceSingleDevicePolicy,
    validateSession,
    invalidateSession
}; 