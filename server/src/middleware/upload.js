const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ApiError = require('../utils/ApiError');

// Check if uploads directory exists, if not create it
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create subdirectories for different upload types
const dirs = ['payments', 'fields', 'profiles'];
dirs.forEach(dir => {
    const dirPath = path.join(uploadsDir, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
});

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = uploadsDir;

        // Determine appropriate subdirectory based on upload type
        if (req.uploadType === 'payment') {
            uploadPath = path.join(uploadsDir, 'payments');
        } else if (req.uploadType === 'field') {
            uploadPath = path.join(uploadsDir, 'fields');
        } else if (req.uploadType === 'profile') {
            uploadPath = path.join(uploadsDir, 'profiles');
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Generate unique filename with timestamp and original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|webp|WEBP)$/)) {
        return cb(new ApiError('Only image files are allowed', 400), false);
    }
    cb(null, true);
};

// Create upload middleware
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024  // 5MB max file size
    },
    fileFilter: fileFilter
});

// Middleware to set upload type before calling multer
const uploadPaymentProof = (req, res, next) => {
    req.uploadType = 'payment';
    upload.single('paymentProof')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return next(new ApiError('File size too large. Maximum size is 5MB', 400));
            }
            return next(new ApiError(err.message, 400));
        } else if (err) {
            return next(err);
        }
        next();
    });
};

const uploadFieldImage = (req, res, next) => {
    req.uploadType = 'field';
    upload.single('fieldImage')(req, res, function (err) {
        if (err) {
            return handleUploadError(err, next);
        }
        next();
    });
};

const uploadProfileImage = (req, res, next) => {
    req.uploadType = 'profile';
    upload.single('profileImage')(req, res, function (err) {
        if (err) {
            return handleUploadError(err, next);
        }
        next();
    });
};

// Helper to handle upload errors
const handleUploadError = (err, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return next(new ApiError('File size too large. Maximum size is 5MB', 400));
        }
        return next(new ApiError(err.message, 400));
    }
    return next(err);
};

module.exports = {
    uploadPaymentProof,
    uploadFieldImage,
    uploadProfileImage
}; 