const bcrypt = require('bcryptjs'); const jwt = require('jsonwebtoken'); const { User, UserSession } = require('../models'); const { generateVerificationCode, generateToken, generateDeviceId, getDeviceInfo, createUserSession, enforceSingleDevicePolicy, invalidateSession } = require('../utils/auth'); const { sendEmail } = require('../utils/emailService');

/**
 * Register a new user
 * @route POST /api/users/register
 */
const register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists',
                data: {}
            });
        }

        // Generate verification code
        const verificationCode = generateVerificationCode();

        // Create user
        const user = await User.create({
            name,
            email,
            phone,
            password,
            verificationCode
        });

        // Gửi mã xác nhận qua email
        try {
            await sendEmail(email, 'verifyAccount', {
                name: user.name,
                code: verificationCode
            });
            console.log(`Đã gửi mã xác nhận cho ${email}: ${verificationCode}`);
        } catch (emailError) {
            console.error('Lỗi gửi email xác nhận:', emailError);
            // Vẫn tiếp tục mặc dù email có thể không gửi được
        }

        // Return success
        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please verify your account.',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    isVerified: user.isVerified,
                    role: user.role
                }
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.',
            data: {}
        });
    }
};

/**
 * Verify account with verification code
 * @route POST /api/users/verify
 */
const verifyAccount = async (req, res) => {
    try {
        const { email, code } = req.body;

        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
                data: {}
            });
        }

        // Check if already verified
        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'Account already verified',
                data: {}
            });
        }

        // Verify code
        if (user.verificationCode !== code) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification code',
                data: {}
            });
        }

        // Generate device ID
        const deviceId = generateDeviceId(req);
        const deviceInfo = getDeviceInfo(req);

        // Update user
        user.isVerified = true;
        user.verificationCode = null;
        await user.save();

        // Generate token
        const token = generateToken(user, deviceId);

        // Create user session
        await createUserSession(user.id, token, deviceId, deviceInfo);

        // Enforce single device policy
        await enforceSingleDevicePolicy(user.id, deviceId);

        // Return success
        res.status(200).json({
            success: true,
            message: 'Account verified successfully',
            data: {
                user: {
                    id: user.id,
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
        console.error('Account verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Account verification failed. Please try again.',
            data: {}
        });
    }
};

/**
 * User login
 * @route POST /api/users/login
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
                data: {}
            });
        }

        // Check if verified
        if (!user.isVerified) {
            return res.status(401).json({
                success: false,
                message: 'Account not verified. Please verify your account first.',
                data: {}
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
                data: {}
            });
        }

        // Generate device ID
        const deviceId = generateDeviceId(req);
        const deviceInfo = getDeviceInfo(req);

        // Generate token
        const token = generateToken(user, deviceId);

        // Create user session
        await createUserSession(user.id, token, deviceId, deviceInfo);

        // Enforce single device policy
        await enforceSingleDevicePolicy(user.id, deviceId);

        // Return success
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
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
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.',
            data: {}
        });
    }
};

/**
 * User logout
 * @route POST /api/users/logout
 */
const logout = async (req, res) => {
    try {
        // Clear session
        await invalidateSession(req.token);

        // Return success
        res.status(200).json({
            success: true,
            message: 'Logout successful',
            data: {}
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Logout failed. Please try again.',
            data: {}
        });
    }
};

/**
 * Get user profile
 * @route GET /api/users/profile
 */
const getProfile = async (req, res) => {
    try {
        // Return user profile
        res.status(200).json({
            success: true,
            message: 'User profile retrieved successfully',
            data: {
                user: {
                    id: req.user.id,
                    name: req.user.name,
                    email: req.user.email,
                    phone: req.user.phone,
                    isVerified: req.user.isVerified,
                    role: req.user.role
                }
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve profile. Please try again.',
            data: {}
        });
    }
};

/**
 * Update user profile
 * @route PUT /api/users/profile
 */
const updateProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;

        // Update user
        await req.user.update({ name, phone });

        // Return success
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: {
                    id: req.user.id,
                    name: req.user.name,
                    email: req.user.email,
                    phone: req.user.phone,
                    isVerified: req.user.isVerified,
                    role: req.user.role
                }
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile. Please try again.',
            data: {}
        });
    }
};

/**
 * Change password
 * @route PUT /api/users/change-password
 */
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Check current password
        const isMatch = await req.user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect',
                data: {}
            });
        }

        // Update password
        req.user.password = newPassword;
        await req.user.save();

        // Return success
        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
            data: {}
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to change password. Please try again.',
            data: {}
        });
    }
};

/**
 * Gửi lại mã xác nhận cho tài khoản
 * @route POST /api/users/resend-verification
 */
const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;

        // Tìm người dùng
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng',
                data: {}
            });
        }

        // Kiểm tra nếu đã xác minh
        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'Tài khoản đã được xác minh',
                data: {}
            });
        }

        // Tạo mã xác nhận mới
        const verificationCode = generateVerificationCode();
        user.verificationCode = verificationCode;
        await user.save();

        // Gửi mã xác nhận qua email
        try {
            await sendEmail(email, 'verifyAccount', {
                name: user.name,
                code: verificationCode
            });
            console.log(`Đã gửi lại mã xác nhận cho ${email}: ${verificationCode}`);
        } catch (emailError) {
            console.error('Lỗi gửi email xác nhận:', emailError);
            return res.status(500).json({
                success: false,
                message: 'Không thể gửi email xác nhận. Vui lòng thử lại.',
                data: {}
            });
        }

        // Trả về thành công
        res.status(200).json({
            success: true,
            message: 'Đã gửi lại mã xác nhận. Vui lòng kiểm tra email của bạn.',
            data: {}
        });
    } catch (error) {
        console.error('Lỗi gửi lại mã xác nhận:', error);
        res.status(500).json({
            success: false,
            message: 'Gửi lại mã xác nhận thất bại. Vui lòng thử lại.',
            data: {}
        });
    }
};

/**
 * Yêu cầu đặt lại mật khẩu
 * @route POST /api/users/forgot-password
 */
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Tìm người dùng
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng với email này',
                data: {}
            });
        }

        // Tạo mã đặt lại mật khẩu
        const resetToken = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 ký tự

        // Thời gian hết hạn (1 giờ)
        const resetExpires = new Date();
        resetExpires.setHours(resetExpires.getHours() + 1);

        // Lưu token vào DB
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetExpires;
        await user.save();

        // Gửi email đặt lại mật khẩu
        try {
            await sendEmail(email, 'resetPassword', {
                name: user.name,
                resetToken
            });
        } catch (emailError) {
            console.error('Lỗi gửi email đặt lại mật khẩu:', emailError);
            return res.status(500).json({
                success: false,
                message: 'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.',
                data: {}
            });
        }

        res.status(200).json({
            success: true,
            message: 'Hướng dẫn đặt lại mật khẩu đã được gửi tới email của bạn',
            data: {}
        });
    } catch (error) {
        console.error('Lỗi yêu cầu đặt lại mật khẩu:', error);
        res.status(500).json({
            success: false,
            message: 'Yêu cầu đặt lại mật khẩu thất bại. Vui lòng thử lại.',
            data: {}
        });
    }
};

/**
 * Đặt lại mật khẩu
 * @route POST /api/users/reset-password
 */
const resetPassword = async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;

        // Tìm người dùng
        const user = await User.findOne({
            where: {
                email,
                resetPasswordToken: token,
                resetPasswordExpires: { [Op.gt]: new Date() }
            }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn',
                data: {}
            });
        }

        // Đặt mật khẩu mới
        user.password = newPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập với mật khẩu mới.',
            data: {}
        });
    } catch (error) {
        console.error('Lỗi đặt lại mật khẩu:', error);
        res.status(500).json({
            success: false,
            message: 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.',
            data: {}
        });
    }
};

module.exports = {
    register,
    verifyAccount,
    resendVerification,
    login,
    logout,
    getProfile,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword
}; 