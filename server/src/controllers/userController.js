const { User } = require('../models');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { generateToken } = require('../middleware/auth');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const config = require('../utils/config');

// Generate a random verification code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Register a new user
 */
exports.register = catchAsync(async (req, res) => {
    const { name, email, phone, password } = req.body;

    // Validate input
    if (!name || !email || !phone || !password) {
        throw new ApiError('All fields are required', 400);
    }

    if (!validator.isEmail(email)) {
        throw new ApiError('Invalid email format', 400);
    }

    if (password.length < 6) {
        throw new ApiError('Password must be at least 6 characters long', 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new ApiError('Email already in use', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification code
    const verificationCode = generateVerificationCode();

    // Create user
    const user = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        verificationCode,
        isVerified: false,
        role: 'user'
    });

    // Remove sensitive data
    const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isVerified: user.isVerified,
        role: user.role
    };

    // In a real-world scenario, send verification email/SMS here
    // For now, just log the code
    console.log(`Verification code for ${email}: ${verificationCode}`);

    return res.status(201).json({
        message: 'User registered successfully. Please verify your account.',
        user: userResponse
    });
});

/**
 * Verify user account with verification code
 */
exports.verifyAccount = catchAsync(async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        throw new ApiError('Email and verification code are required', 400);
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new ApiError('User not found', 404);
    }

    // Check if already verified
    if (user.isVerified) {
        throw new ApiError('Account already verified', 400);
    }

    // Verify code
    if (user.verificationCode !== code) {
        throw new ApiError('Invalid verification code', 400);
    }

    // Update user status
    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    // Generate token
    const token = generateToken(user);

    // Remove sensitive data
    const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isVerified: user.isVerified,
        role: user.role
    };

    return res.status(200).json({
        message: 'Account verified successfully',
        user: userResponse,
        token
    });
});

/**
 * User login
 */
exports.login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError('Email and password are required', 400);
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new ApiError('Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError('Invalid email or password', 401);
    }

    // Check if user is verified
    if (!user.isVerified) {
        throw new ApiError('Please verify your account first', 401);
    }

    // Generate token
    const token = generateToken(user);

    // Remove sensitive data
    const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isVerified: user.isVerified,
        role: user.role
    };

    return res.status(200).json({
        message: 'Login successful',
        user: userResponse,
        token
    });
});

/**
 * Get user profile
 */
exports.getProfile = catchAsync(async (req, res) => {
    // User is already attached to req by auth middleware
    const user = req.user;

    return res.status(200).json({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            isVerified: user.isVerified,
            role: user.role,
            createdAt: user.createdAt
        }
    });
});

/**
 * Update user profile
 */
exports.updateProfile = catchAsync(async (req, res) => {
    const { name, phone } = req.body;
    const userId = req.user.id;

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
        throw new ApiError('User not found', 404);
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;

    // Save changes
    await user.save();

    return res.status(200).json({
        message: 'Profile updated successfully',
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            isVerified: user.isVerified,
            role: user.role
        }
    });
});

/**
 * Change password
 */
exports.changePassword = catchAsync(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
        throw new ApiError('Current password and new password are required', 400);
    }

    if (newPassword.length < 6) {
        throw new ApiError('New password must be at least 6 characters long', 400);
    }

    // Find user with password
    const user = await User.findByPk(userId);
    if (!user) {
        throw new ApiError('User not found', 404);
    }

    // Check current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
        throw new ApiError('Current password is incorrect', 401);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
        message: 'Password changed successfully'
    });
});

/**
 * Forgot password - request reset
 */
exports.forgotPassword = catchAsync(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError('Email is required', 400);
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
        // Don't reveal that the user doesn't exist
        return res.status(200).json({
            message: 'If your email is registered, you will receive a password reset code'
        });
    }

    // Generate reset code
    const resetCode = generateVerificationCode();
    user.resetPasswordCode = resetCode;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // In a real-world scenario, send reset email here
    console.log(`Password reset code for ${email}: ${resetCode}`);

    return res.status(200).json({
        message: 'If your email is registered, you will receive a password reset code'
    });
});

/**
 * Reset password with code
 */
exports.resetPassword = catchAsync(async (req, res) => {
    const { email, resetCode, newPassword } = req.body;

    if (!email || !resetCode || !newPassword) {
        throw new ApiError('Email, reset code and new password are required', 400);
    }

    if (newPassword.length < 6) {
        throw new ApiError('New password must be at least 6 characters long', 400);
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new ApiError('Invalid or expired reset code', 400);
    }

    // Check reset code
    if (user.resetPasswordCode !== resetCode) {
        throw new ApiError('Invalid or expired reset code', 400);
    }

    // Check if code is expired
    if (user.resetPasswordExpires && user.resetPasswordExpires < Date.now()) {
        throw new ApiError('Reset code has expired. Please request a new one', 400);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordCode = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({
        message: 'Password has been reset successfully'
    });
}); 