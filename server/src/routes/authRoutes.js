const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, verifyAccount, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { updateProfileValidation, changePasswordValidation } = require('../middleware/validators');
const { updateProfile, changePassword } = require('../controllers/userController');

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/verify/:token', verifyAccount);
router.post('/logout', protect, logout);

// User profile routes
router.put('/profile', protect, updateProfileValidation, updateProfile);
router.post('/change-password', protect, changePasswordValidation, changePassword);

module.exports = router; 