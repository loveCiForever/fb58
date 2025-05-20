const Field = require('../models/Field');
const logger = require('../config/logger');

// Get all fields
exports.getAllFields = async (req, res) => {
    try {
        const fields = await Field.find()
            .select('-__v')
            .sort({ createdAt: -1 });

        logger.info('Retrieved all fields successfully');

        res.status(200).json({
            success: true,
            message: 'Fetching data successful',
            data: {
                fields: fields.map(field => ({
                    id: field._id,
                    name: field.name,
                    short_description: field.short_description,
                    full_description: field.full_description,
                    grass_type: field.grass_type,
                    price: field.price,
                    capacity: field.capacity,
                    status: field.status
                }))
            }
        });
    } catch (error) {
        logger.error('Error fetching fields:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching fields',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Create a new field
exports.createField = async (req, res) => {
    try {
        const {
            name,
            short_description,
            full_description,
            grass_type,
            price,
            capacity
        } = req.body;

        // Create new field
        const field = await Field.create({
            name,
            short_description,
            full_description,
            grass_type,
            price,
            capacity,
            createdBy: req.user.id
        });

        logger.info(`Field ${field._id} created by user ${req.user.id}`);

        res.status(201).json({
            success: true,
            message: 'Field created successfully',
            data: {
                field: {
                    id: field._id,
                    name: field.name,
                    short_description: field.short_description,
                    full_description: field.full_description,
                    grass_type: field.grass_type,
                    price: field.price,
                    capacity: field.capacity,
                    status: field.status
                }
            }
        });
    } catch (error) {
        logger.error('Error creating field:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating field',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}; 