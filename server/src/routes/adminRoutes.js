const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getDashboardReport,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getAllFields,
    getFieldById,
    createField,
    updateField,
    deleteField
} = require('../controllers/adminController');

// Admin dashboard report
router.get('/dashboard', protect, authorize('admin'), getDashboardReport);

// User Management Routes
router.get('/users', protect, authorize('admin'), getAllUsers);
router.get('/users/:id', protect, authorize('admin'), getUserById);
router.put('/users/:id', protect, authorize('admin'), updateUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

// Field Management Routes
router.get('/fields', protect, authorize('admin'), getAllFields);
router.get('/fields/:id', protect, authorize('admin'), getFieldById);
router.post('/fields', protect, authorize('admin'), createField);
router.put('/fields/:id', protect, authorize('admin'), updateField);
router.delete('/fields/:id', protect, authorize('admin'), deleteField);

module.exports = router; 