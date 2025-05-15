const { Field, Booking, sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * Get all fields with optional filters
 * @route GET /api/fields
 */
const getAllFields = async (req, res) => {
    try {
        const { size, type, available, date } = req.query;

        // Build query filters
        const filters = {};

        if (size) {
            filters.size = size;
        }

        if (type) {
            filters.type = type;
        }

        // Only include active fields
        filters.isActive = true;

        // Get all fields
        const fields = await Field.findAll({
            where: filters,
            attributes: [
                'id',
                'name',
                'address',
                'description',
                'size',
                'type',
                'pricePerHour',
                'openTime',
                'closeTime',
                'images',
                'facilities',
                'averageRating',
                'totalReviews'
            ],
            order: [['name', 'ASC']]
        });

        // Return fields
        res.status(200).json({
            success: true,
            message: 'Fields retrieved successfully',
            data: { fields }
        });
    } catch (error) {
        console.error('Get all fields error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve fields. Please try again.',
            data: {}
        });
    }
};

/**
 * Get field by ID
 * @route GET /api/fields/:id
 */
const getFieldById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find field
        const field = await Field.findByPk(id);

        if (!field) {
            return res.status(404).json({
                success: false,
                message: 'Field not found',
                data: {}
            });
        }

        // Return field
        res.status(200).json({
            success: true,
            message: 'Field retrieved successfully',
            data: { field }
        });
    } catch (error) {
        console.error('Get field by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve field. Please try again.',
            data: {}
        });
    }
};

/**
 * Get available time slots for a field on a specific date
 * @route GET /api/fields/:id/available-slots/:date
 */
const getAvailableTimeSlots = async (req, res) => {
    try {
        const { id, date } = req.params;

        // Find field
        const field = await Field.findByPk(id);

        if (!field) {
            return res.status(404).json({
                success: false,
                message: 'Field not found',
                data: {}
            });
        }

        // Get field opening hours
        const openTime = field.openTime;
        const closeTime = field.closeTime;

        // Get all bookings for the field on the specified date
        const bookings = await Booking.findAll({
            where: {
                fieldId: id,
                date,
                status: {
                    [Op.notIn]: ['cancelled']
                }
            },
            attributes: ['startTime', 'endTime'],
            order: [['startTime', 'ASC']]
        });

        // Generate all possible time slots
        const allTimeSlots = generateTimeSlots(openTime, closeTime);

        // Filter out booked time slots
        const availableTimeSlots = filterAvailableTimeSlots(allTimeSlots, bookings);

        // Return available time slots
        res.status(200).json({
            success: true,
            message: 'Available time slots retrieved successfully',
            data: {
                fieldId: field.id,
                fieldName: field.name,
                date,
                availableTimeSlots
            }
        });
    } catch (error) {
        console.error('Get available time slots error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve available time slots. Please try again.',
            data: {}
        });
    }
};

/**
 * Create a new field (admin only)
 * @route POST /api/fields
 */
const createField = async (req, res) => {
    try {
        const {
            name,
            address,
            description,
            size,
            type,
            pricePerHour,
            openTime,
            closeTime,
            images,
            facilities
        } = req.body;

        // Create field
        const field = await Field.create({
            name,
            address,
            description,
            size,
            type,
            pricePerHour,
            openTime,
            closeTime,
            images: images || [],
            facilities: facilities || []
        });

        // Return created field
        res.status(201).json({
            success: true,
            message: 'Field created successfully',
            data: { field }
        });
    } catch (error) {
        console.error('Create field error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create field. Please try again.',
            data: {}
        });
    }
};

/**
 * Update field (admin only)
 * @route PUT /api/fields/:id
 */
const updateField = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            address,
            description,
            size,
            type,
            pricePerHour,
            openTime,
            closeTime,
            images,
            facilities,
            isActive
        } = req.body;

        // Find field
        const field = await Field.findByPk(id);

        if (!field) {
            return res.status(404).json({
                success: false,
                message: 'Field not found',
                data: {}
            });
        }

        // Update field
        await field.update({
            name,
            address,
            description,
            size,
            type,
            pricePerHour,
            openTime,
            closeTime,
            images,
            facilities,
            isActive
        });

        // Return updated field
        res.status(200).json({
            success: true,
            message: 'Field updated successfully',
            data: { field }
        });
    } catch (error) {
        console.error('Update field error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update field. Please try again.',
            data: {}
        });
    }
};

/**
 * Delete field (admin only)
 * @route DELETE /api/fields/:id
 */
const deleteField = async (req, res) => {
    try {
        const { id } = req.params;

        // Find field
        const field = await Field.findByPk(id);

        if (!field) {
            return res.status(404).json({
                success: false,
                message: 'Field not found',
                data: {}
            });
        }

        // Check if field has bookings
        const bookingCount = await Booking.count({
            where: { fieldId: id }
        });

        if (bookingCount > 0) {
            // Soft delete - mark as inactive
            await field.update({ isActive: false });

            return res.status(200).json({
                success: true,
                message: 'Field marked as inactive because it has bookings',
                data: {}
            });
        }

        // Hard delete
        await field.destroy();

        // Return success
        res.status(200).json({
            success: true,
            message: 'Field deleted successfully',
            data: {}
        });
    } catch (error) {
        console.error('Delete field error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete field. Please try again.',
            data: {}
        });
    }
};

/**
 * Helper function to generate all possible time slots for a field
 * @param {string} openTime - Field opening time (HH:MM)
 * @param {string} closeTime - Field closing time (HH:MM)
 * @returns {Array} Array of time slot objects with startTime and endTime
 */
const generateTimeSlots = (openTime, closeTime) => {
    const slots = [];
    const interval = 60; // 1 hour interval in minutes

    // Convert open time and close time to minutes
    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);

    const openInMinutes = openHour * 60 + openMinute;
    const closeInMinutes = closeHour * 60 + closeMinute;

    // Generate slots
    for (let start = openInMinutes; start < closeInMinutes; start += interval) {
        const end = start + interval;
        if (end <= closeInMinutes) {
            slots.push({
                startTime: formatTime(start),
                endTime: formatTime(end)
            });
        }
    }

    return slots;
};

/**
 * Helper function to format minutes to time string (HH:MM)
 * @param {number} minutes - Minutes to format
 * @returns {string} Formatted time string (HH:MM)
 */
const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

/**
 * Helper function to filter available time slots
 * @param {Array} allTimeSlots - Array of all possible time slots
 * @param {Array} bookings - Array of booked time slots
 * @returns {Array} Array of available time slots
 */
const filterAvailableTimeSlots = (allTimeSlots, bookings) => {
    // If no bookings, all slots are available
    if (!bookings.length) {
        return allTimeSlots;
    }

    return allTimeSlots.filter(slot => {
        const isSlotBooked = bookings.some(booking => {
            // Convert slot and booking times to minute values for easier comparison
            const slotStart = timeToMinutes(slot.startTime);
            const slotEnd = timeToMinutes(slot.endTime);
            const bookingStart = timeToMinutes(booking.startTime);
            const bookingEnd = timeToMinutes(booking.endTime);

            // Check if slot overlaps with booking
            return (slotStart < bookingEnd && slotEnd > bookingStart);
        });

        return !isSlotBooked;
    });
};

/**
 * Helper function to convert time string (HH:MM:SS) to minutes
 * @param {string} time - Time string to convert
 * @returns {number} Time in minutes
 */
const timeToMinutes = (time) => {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return (hours * 60) + (minutes || 0) + ((seconds || 0) / 60);
};

module.exports = {
    getAllFields,
    getFieldById,
    getAvailableTimeSlots,
    createField,
    updateField,
    deleteField
}; 