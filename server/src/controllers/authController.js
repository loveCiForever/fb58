const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../config/email');
const verificationEmailTemplate = require('../templates/verificationEmail');
const logger = require('../config/logger');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// Register new user
exports.register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Generate verification token
        const verificationToken = crypto.randomBytes(20).toString('hex');
        const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        // Create new user
        const user = await User.create({
            name,
            email,
            phone,
            password,
            verificationToken,
            verificationTokenExpires
        });

        // Send verification email
        const verificationUrl = `${req.protocol}://${req.get('host')}/api/users/verify/${verificationToken}`;
        const html = verificationEmailTemplate(name, verificationUrl);

        await sendEmail(
            user.email,
            'Account Verification',
            html
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please verify your account.',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    isVerified: user.isVerified,
                    role: user.role
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Verify account
exports.verifyAccount = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token'
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        const authToken = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Account verified successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    isVerified: user.isVerified,
                    role: user.role
                },
                token: authToken
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if password matches
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if account is verified
        if (!user.isVerified) {
            return res.status(401).json({
                success: false,
                message: 'Please verify your account first'
            });
        }

        // Generate new token
        const token = generateToken(user._id);

        // Check if user is already logged in on another device
        if (user.activeToken) {
            try {
                // Verify if the old token is still valid
                jwt.verify(user.activeToken, process.env.JWT_SECRET);
                // If valid, we'll proceed with new login and invalidate the old session
                console.log('Previous session found, proceeding with new login');
            } catch (error) {
                // If token is invalid, we can proceed with new login
                console.log('Previous session expired, proceeding with new login');
            }
        }

        // Update user's active token and last login
        user.activeToken = token;
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Login successful. Previous session has been terminated.',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    isVerified: user.isVerified,
                    role: user.role
                },
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Logout user
exports.logout = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get current token from request
        const currentToken = req.headers.authorization.split(' ')[1];

        // Check if the current token matches the active token
        if (user.activeToken !== currentToken) {
            return res.status(401).json({
                success: false,
                message: 'Invalid session'
            });
        }

        // Clear active token and last login
        user.activeToken = null;
        user.lastLogin = null;
        await user.save();

        logger.info(`User ${user._id} logged out successfully`);

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        logger.error('Error during logout:', error);
        res.status(500).json({
            success: false,
            message: 'Error during logout',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}; 