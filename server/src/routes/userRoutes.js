const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, requireVerifiedUser } = require('../middlewares/auth');

// Public routes
router.post('/register', userController.register);
router.post('/verify', userController.verifyAccount);
router.post('/resend-verification', userController.resendVerification);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

// Protected routes
router.post('/logout', authenticate, userController.logout);
router.get('/profile', authenticate, requireVerifiedUser, userController.getProfile);
router.put('/profile', authenticate, requireVerifiedUser, userController.updateProfile);
router.put('/change-password', authenticate, requireVerifiedUser, userController.changePassword);

module.exports = router; 