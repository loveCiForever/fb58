const User = require('../models/User');
const bcrypt = require('bcryptjs');
const logger = require('../config/logger');

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update user fields
        user.name = name || user.name;
        user.phone = phone || user.phone;

        await user.save();

        logger.info(`User ${userId} updated their profile`);

        res.json({
            success: true,
            message: 'Profile updated successfully',
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
        logger.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Change password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;
        const user = await User.findById(userId).select('+password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify current password
        if (!user.password) {
            return res.status(400).json({
                success: false,
                message: 'User has no password set'
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password and invalidate sessions
        user.password = hashedPassword;
        user.activeToken = null;
        user.lastLogin = null;

        await user.save();

        logger.info(`User ${userId} changed their password`);

        res.json({
            success: true,
            message: 'Password changed successfully',
            data: {}
        });
    } catch (error) {
        logger.error('Error changing password:', error);
        res.status(500).json({
            success: false,
            message: 'Error changing password',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    updateProfile,
    changePassword
}; 