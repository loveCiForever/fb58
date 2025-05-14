const { Field, Booking, sequelize } = require('../models');
const { Op } = require('sequelize');

// Get all fields
exports.getAllFields = async (req, res) => {
    try {
        const fields = await Field.findAll({
            order: [['name', 'ASC']]
        });
        return res.status(200).json({ fields });
    } catch (error) {
        console.error('Get fields error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get field by ID
exports.getFieldById = async (req, res) => {
    try {
        const { id } = req.params;
        const field = await Field.findByPk(id);

        if (!field) {
            return res.status(404).json({ message: 'Field not found' });
        }

        return res.status(200).json({ field });
    } catch (error) {
        console.error('Get field error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get available time slots for a field on a specific date
exports.getAvailableTimeSlots = async (req, res) => {
    try {
        const { fieldId, date } = req.params;

        // Validate field exists
        const field = await Field.findByPk(fieldId);
        if (!field) {
            return res.status(404).json({ message: 'Field not found' });
        }

        // Get all bookings for this field on the specified date
        const bookings = await Booking.findAll({
            where: {
                fieldId,
                date,
                bookingStatus: {
                    [Op.notIn]: ['cancelled', 'no_show']
                }
            },
            attributes: ['startTime', 'endTime']
        });

        // Convert field opening hours to minutes for easier calculation
        const openTimeHours = parseInt(field.openTime.split(':')[0]);
        const openTimeMinutes = parseInt(field.openTime.split(':')[1]);
        const openTimeInMinutes = openTimeHours * 60 + openTimeMinutes;

        const closeTimeHours = parseInt(field.closeTime.split(':')[0]);
        const closeTimeMinutes = parseInt(field.closeTime.split(':')[1]);
        const closeTimeInMinutes = closeTimeHours * 60 + closeTimeMinutes;

        // Create time slots (assuming 1-hour slots)
        const timeSlots = [];
        const slotDuration = 60; // 1 hour in minutes

        for (let time = openTimeInMinutes; time < closeTimeInMinutes; time += slotDuration) {
            const startHour = Math.floor(time / 60);
            const startMinute = time % 60;

            const endTime = time + slotDuration;
            const endHour = Math.floor(endTime / 60);
            const endMinute = endTime % 60;

            const startTimeStr = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
            const endTimeStr = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

            // Check if this time slot is available (not booked)
            const isAvailable = !bookings.some(booking => {
                const bookingStartHour = parseInt(booking.startTime.split(':')[0]);
                const bookingStartMinute = parseInt(booking.startTime.split(':')[1]);
                const bookingStartInMinutes = bookingStartHour * 60 + bookingStartMinute;

                const bookingEndHour = parseInt(booking.endTime.split(':')[0]);
                const bookingEndMinute = parseInt(booking.endTime.split(':')[1]);
                const bookingEndInMinutes = bookingEndHour * 60 + bookingEndMinute;

                // Check if there's an overlap
                return (
                    (time < bookingEndInMinutes && endTime > bookingStartInMinutes) ||
                    (time === bookingStartInMinutes && endTime === bookingEndInMinutes)
                );
            });

            if (isAvailable) {
                timeSlots.push({
                    startTime: startTimeStr,
                    endTime: endTimeStr
                });
            }
        }

        return res.status(200).json({
            field: field.name,
            date,
            availableTimeSlots: timeSlots
        });
    } catch (error) {
        console.error('Get available time slots error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Create a new field
exports.createField = async (req, res) => {
    try {
        const {
            name,
            description,
            type,
            price,
            priceWithLights,
            openTime,
            closeTime,
            image
        } = req.body;

        // Validate required fields
        if (!name || !type || !price || !priceWithLights || !openTime || !closeTime) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        // Create new field
        const field = await Field.create({
            name,
            description,
            type,
            price,
            priceWithLights,
            openTime,
            closeTime,
            image,
            status: 'available'
        });

        return res.status(201).json({
            message: 'Field created successfully',
            field
        });
    } catch (error) {
        console.error('Create field error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Update field
exports.updateField = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            type,
            price,
            priceWithLights,
            openTime,
            closeTime,
            status,
            image
        } = req.body;

        // Find field
        const field = await Field.findByPk(id);
        if (!field) {
            return res.status(404).json({ message: 'Field not found' });
        }

        // Update fields
        if (name) field.name = name;
        if (description !== undefined) field.description = description;
        if (type) field.type = type;
        if (price) field.price = price;
        if (priceWithLights) field.priceWithLights = priceWithLights;
        if (openTime) field.openTime = openTime;
        if (closeTime) field.closeTime = closeTime;
        if (status) field.status = status;
        if (image !== undefined) field.image = image;

        await field.save();

        return res.status(200).json({
            message: 'Field updated successfully',
            field
        });
    } catch (error) {
        console.error('Update field error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};