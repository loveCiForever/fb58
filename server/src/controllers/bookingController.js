const { Booking, Field, User, Service, BookingService, sequelize } = require('../models');
const { Op } = require('sequelize');

// Create a new booking
exports.createBooking = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            fieldId,
            date,
            startTime,
            endTime,
            useLights,
            serviceIds = [],
            quantities = [],
            paymentMethod
        } = req.body;

        // Basic validation
        if (!fieldId || !date || !startTime || !endTime) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Field, date, start time and end time are required' });
        }

        // Check if selected serviceIds and quantities have the same length
        if (serviceIds.length !== quantities.length) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Service IDs and quantities must have the same length' });
        }

        // Get field details for pricing
        const field = await Field.findByPk(fieldId, { transaction });
        if (!field) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Field not found' });
        }

        // Check if field is available at the requested time
        const existingBooking = await Booking.findOne({
            where: {
                fieldId,
                date,
                bookingStatus: {
                    [Op.notIn]: ['cancelled', 'no_show']
                },
                [Op.or]: [
                    {
                        startTime: {
                            [Op.lt]: endTime
                        },
                        endTime: {
                            [Op.gt]: startTime
                        }
                    },
                    {
                        startTime,
                        endTime
                    }
                ]
            },
            transaction
        });

        if (existingBooking) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Field is already booked for the selected time' });
        }

        // Calculate duration in hours
        const startHours = parseInt(startTime.split(':')[0]);
        const startMinutes = parseInt(startTime.split(':')[1]);
        const endHours = parseInt(endTime.split(':')[0]);
        const endMinutes = parseInt(endTime.split(':')[1]);

        const startTimeMinutes = startHours * 60 + startMinutes;
        const endTimeMinutes = endHours * 60 + endMinutes;
        const durationHours = (endTimeMinutes - startTimeMinutes) / 60;

        // Calculate field price based on whether lights are used or not
        const fieldPrice = useLights ? field.priceWithLights : field.price;
        const fieldTotal = fieldPrice * durationHours;

        // Calculate services total
        let servicesTotal = 0;
        const bookingServices = [];

        if (serviceIds.length > 0) {
            const services = await Service.findAll({
                where: {
                    id: {
                        [Op.in]: serviceIds
                    },
                    status: 'active'
                },
                transaction
            });

            if (services.length !== serviceIds.length) {
                await transaction.rollback();
                return res.status(400).json({ message: 'One or more services are invalid or inactive' });
            }

            // Create booking services entries
            for (let i = 0; i < serviceIds.length; i++) {
                const service = services.find(s => s.id === parseInt(serviceIds[i]));
                const quantity = parseInt(quantities[i]);

                if (!service) {
                    await transaction.rollback();
                    return res.status(400).json({ message: `Service with ID ${serviceIds[i]} not found` });
                }

                if (isNaN(quantity) || quantity <= 0) {
                    await transaction.rollback();
                    return res.status(400).json({ message: 'Quantity must be a positive number' });
                }

                const serviceTotal = service.price * quantity;
                servicesTotal += serviceTotal;

                bookingServices.push({
                    serviceId: service.id,
                    quantity,
                    price: service.price,
                    totalPrice: serviceTotal
                });
            }
        }

        // Calculate total and deposit
        const totalPrice = fieldTotal + servicesTotal;
        const depositAmount = totalPrice * 0.3; // 30% deposit

        // Create booking
        const booking = await Booking.create({
            userId: req.user.id,
            fieldId,
            date,
            startTime,
            endTime,
            useLights,
            totalPrice,
            depositAmount,
            paymentMethod,
            paymentStatus: 'pending',
            bookingStatus: 'pending'
        }, { transaction });

        // Create booking services
        if (bookingServices.length > 0) {
            for (const serviceData of bookingServices) {
                await BookingService.create({
                    bookingId: booking.id,
                    serviceId: serviceData.serviceId,
                    quantity: serviceData.quantity,
                    price: serviceData.price,
                    totalPrice: serviceData.totalPrice
                }, { transaction });
            }
        }

        // Commit transaction
        await transaction.commit();

        return res.status(201).json({
            message: 'Booking created successfully',
            booking: {
                ...booking.toJSON(),
                fieldPrice: fieldTotal,
                servicesTotal,
                depositAmount
            }
        });
    } catch (error) {
        await transaction.rollback();
        console.error('Create booking error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get user's bookings
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: {
                userId: req.user.id
            },
            include: [
                {
                    model: Field,
                    attributes: ['id', 'name', 'type']
                }
            ],
            order: [
                ['date', 'DESC'],
                ['startTime', 'ASC']
            ]
        });

        return res.status(200).json({ bookings });
    } catch (error) {
        console.error('Get user bookings error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findOne({
            where: {
                id,
                userId: req.user.id
            },
            include: [
                {
                    model: Field,
                    attributes: ['id', 'name', 'type']
                },
                {
                    model: BookingService,
                    include: [
                        {
                            model: Service,
                            attributes: ['id', 'name', 'description']
                        }
                    ]
                }
            ]
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        return res.status(200).json({ booking });
    } catch (error) {
        console.error('Get booking error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Update booking payment proof
exports.updatePaymentProof = async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentProof } = req.body;

        if (!paymentProof) {
            return res.status(400).json({ message: 'Payment proof is required' });
        }

        const booking = await Booking.findOne({
            where: {
                id,
                userId: req.user.id
            }
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.paymentStatus !== 'pending') {
            return res.status(400).json({ message: 'Payment has already been processed' });
        }

        booking.paymentProof = paymentProof;
        booking.paymentStatus = 'deposit_paid'; // Change to deposit_paid; admin will verify
        await booking.save();

        return res.status(200).json({
            message: 'Payment proof uploaded successfully',
            booking
        });
    } catch (error) {
        console.error('Update payment proof error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { cancellationReason } = req.body;

        if (!cancellationReason) {
            return res.status(400).json({ message: 'Cancellation reason is required' });
        }

        const booking = await Booking.findOne({
            where: {
                id,
                userId: req.user.id
            }
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (['completed', 'cancelled', 'no_show'].includes(booking.bookingStatus)) {
            return res.status(400).json({ message: `Booking cannot be cancelled because it is already ${booking.bookingStatus}` });
        }

        // Check if cancellation is within 24 hours of booking time
        const bookingDateTime = new Date(`${booking.date}T${booking.startTime}`);
        const now = new Date();
        const hoursDifference = (bookingDateTime - now) / (1000 * 60 * 60);

        // Update booking
        booking.cancellationReason = cancellationReason;
        booking.bookingStatus = 'cancelled';

        // Handle refund status based on cancellation time
        if (booking.paymentStatus !== 'pending' && hoursDifference < 24) {
            booking.paymentStatus = 'cancelled'; // No refund for late cancellation
        } else if (booking.paymentStatus !== 'pending') {
            booking.paymentStatus = 'refunded'; // Refund for early cancellation
        }

        await booking.save();

        return res.status(200).json({
            message: 'Booking cancelled successfully',
            refundStatus: booking.paymentStatus,
            booking
        });
    } catch (error) {
        console.error('Cancel booking error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Get all bookings
exports.getAllBookings = async (req, res) => {
    try {
        const { status, date, fieldId } = req.query;

        // Build query conditions
        const whereConditions = {};

        if (status) {
            whereConditions.bookingStatus = status;
        }

        if (date) {
            whereConditions.date = date;
        }

        if (fieldId) {
            whereConditions.fieldId = fieldId;
        }

        const bookings = await Booking.findAll({
            where: whereConditions,
            include: [
                {
                    model: Field,
                    attributes: ['id', 'name', 'type']
                },
                {
                    model: User,
                    attributes: ['id', 'name', 'email', 'phone']
                }
            ],
            order: [
                ['date', 'DESC'],
                ['startTime', 'ASC']
            ]
        });

        return res.status(200).json({ bookings });
    } catch (error) {
        console.error('Get all bookings error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Update booking status
exports.updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { bookingStatus, paymentStatus, notes } = req.body;

        const booking = await Booking.findByPk(id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (bookingStatus) {
            booking.bookingStatus = bookingStatus;
        }

        if (paymentStatus) {
            booking.paymentStatus = paymentStatus;
        }

        if (notes !== undefined) {
            booking.notes = notes;
        }

        await booking.save();

        return res.status(200).json({
            message: 'Booking updated successfully',
            booking
        });
    } catch (error) {
        console.error('Update booking status error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};