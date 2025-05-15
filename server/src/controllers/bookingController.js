const { Booking, User, Field, Service, BookingService } = require('../models');
const { Op } = require('sequelize');
const ApiError = require('../utils/apiError');
const { validateTimeOverlap } = require('../utils/dateTimeHelper');
const { sendEmail } = require('../utils/emailService');

// Create a new booking
exports.createBooking = async (req, res, next) => {
    try {
        const {
            fieldId,
            date,
            startTime,
            endTime,
            services,
            notes
        } = req.body;

        // Get the user ID from the authenticated user
        const userId = req.user.id;

        // Validate field exists
        const field = await Field.findByPk(fieldId);
        if (!field) {
            return next(new ApiError('Field not found', 404));
        }

        // Check if the field is available for the requested time
        const isAvailable = await checkFieldAvailability(fieldId, date, startTime, endTime);
        if (!isAvailable) {
            return next(new ApiError('Field is not available for the selected time slot', 400));
        }

        // Calculate field booking price
        const fieldPrice = calculateFieldPrice(field, startTime, endTime);

        // Calculate services price if any
        let servicesPrice = 0;
        let serviceItems = [];

        if (services && services.length > 0) {
            const serviceIds = services.map(service => service.id);
            serviceItems = await Service.findAll({
                where: { id: { [Op.in]: serviceIds } }
            });

            if (serviceItems.length !== serviceIds.length) {
                return next(new ApiError('One or more services not found', 404));
            }

            servicesPrice = serviceItems.reduce((total, service) => {
                const requestedService = services.find(s => s.id === service.id);
                return total + (service.price * (requestedService.quantity || 1));
            }, 0);
        }

        // Calculate total price
        const totalPrice = fieldPrice + servicesPrice;

        // Create the booking
        const booking = await Booking.create({
            userId,
            fieldId,
            date,
            startTime,
            endTime,
            totalPrice,
            paymentStatus: 'pending',
            notes
        });

        // Add services to booking if any
        if (serviceItems.length > 0) {
            const bookingServices = serviceItems.map(service => {
                const requestedService = services.find(s => s.id === service.id);
                return {
                    bookingId: booking.id,
                    serviceId: service.id,
                    quantity: requestedService.quantity || 1,
                    price: service.price
                };
            });

            await BookingService.bulkCreate(bookingServices);
        }

        // Lấy thông tin người dùng để gửi email
        const user = await User.findByPk(userId);

        // Tính thời hạn thanh toán (24 giờ sau khi đặt sân)
        const paymentDeadline = new Date();
        paymentDeadline.setHours(paymentDeadline.getHours() + 24);
        const formattedDeadline = paymentDeadline.toLocaleString('vi-VN');

        // Gửi email xác nhận đặt sân
        try {
            await sendEmail(user.email, 'bookingConfirmation', {
                name: user.name,
                booking: {
                    bookingReference: booking.bookingReference,
                    fieldName: field.name,
                    date: booking.date,
                    startTime: booking.startTime,
                    endTime: booking.endTime,
                    totalPrice: booking.totalPrice.toLocaleString('vi-VN'),
                    paymentDeadline: formattedDeadline
                }
            });
            console.log(`Đã gửi xác nhận đặt sân cho ${user.email}`);
        } catch (emailError) {
            console.error('Lỗi gửi email xác nhận đặt sân:', emailError);
            // Vẫn tiếp tục vì đặt sân đã thành công
        }

        res.status(201).json({
            success: true,
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

// Get all bookings (admin)
exports.getAllBookings = async (req, res, next) => {
    try {
        const { status, date, fieldId, userId } = req.query;
        const queryOptions = {};

        // Filter options
        if (status) queryOptions.status = status;
        if (date) queryOptions.date = date;
        if (fieldId) queryOptions.fieldId = fieldId;
        if (userId) queryOptions.userId = userId;

        const bookings = await Booking.findAll({
            where: queryOptions,
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] },
                { model: Field, as: 'field', attributes: ['id', 'name', 'type', 'price'] },
                { model: Service, as: 'services', through: { attributes: ['quantity', 'price'] } }
            ],
            order: [['date', 'DESC'], ['startTime', 'ASC']]
        });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        next(error);
    }
};

// Get user bookings
exports.getUserBookings = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { status } = req.query;

        const queryOptions = { userId };
        if (status) queryOptions.status = status;

        const bookings = await Booking.findAll({
            where: queryOptions,
            include: [
                { model: Field, as: 'field', attributes: ['id', 'name', 'type', 'price'] },
                { model: Service, as: 'services', through: { attributes: ['quantity', 'price'] } }
            ],
            order: [['date', 'DESC'], ['startTime', 'ASC']]
        });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        next(error);
    }
};

// Get booking by ID
exports.getBookingById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findByPk(id, {
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] },
                { model: Field, as: 'field', attributes: ['id', 'name', 'type', 'price', 'location'] },
                { model: Service, as: 'services', through: { attributes: ['quantity', 'price'] } }
            ]
        });

        if (!booking) {
            return next(new ApiError('Booking not found', 404));
        }

        // Check if user is authorized to view this booking
        if (!req.user.isAdmin && booking.userId !== req.user.id) {
            return next(new ApiError('Not authorized to access this booking', 403));
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

// Update booking status
exports.updateBookingStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, cancelReason } = req.body;

        const booking = await Booking.findByPk(id);

        if (!booking) {
            return next(new ApiError('Booking not found', 404));
        }

        // Only admin can update status except for cancellations
        if (!req.user.isAdmin && (status !== 'cancelled' || booking.userId !== req.user.id)) {
            return next(new ApiError('Not authorized to update this booking', 403));
        }

        // Update status logic
        booking.status = status;

        // Handle cancellation
        if (status === 'cancelled') {
            booking.cancelledAt = new Date();
            booking.cancelReason = cancelReason;
        }

        await booking.save();

        // Lấy thông tin người dùng và sân bóng để gửi email
        const user = await User.findByPk(booking.userId);
        const field = await Field.findByPk(booking.fieldId);

        // Gửi email thông báo trạng thái đặt sân đã thay đổi
        try {
            const statusMessages = {
                'confirmed': 'Đặt sân đã được xác nhận',
                'cancelled': 'Đặt sân đã bị hủy',
                'completed': 'Đặt sân đã hoàn thành'
            };

            const emailSubject = `${statusMessages[status]} - Hệ thống đặt sân bóng`;
            const emailContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <h2 style="color: #4caf50; text-align: center;">${statusMessages[status]}</h2>
                    <p>Xin chào ${user.name},</p>
                    <p>Đặt sân của bạn với thông tin sau đã được ${status === 'confirmed' ? 'xác nhận' : status === 'cancelled' ? 'hủy' : 'hoàn thành'}:</p>
                    <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
                        <p><strong>Mã đặt sân:</strong> ${booking.bookingReference}</p>
                        <p><strong>Sân bóng:</strong> ${field.name}</p>
                        <p><strong>Ngày:</strong> ${booking.date}</p>
                        <p><strong>Thời gian:</strong> ${booking.startTime} - ${booking.endTime}</p>
                        ${status === 'cancelled' ? `<p><strong>Lý do hủy:</strong> ${booking.cancelReason || 'Không có lý do được cung cấp'}</p>` : ''}
                    </div>
                    ${status === 'confirmed' ? '<p>Vui lòng thanh toán đúng hạn để hoàn tất đặt sân.</p>' : ''}
                    <p>Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi.</p>
                    <p style="margin-top: 30px; text-align: center; font-size: 12px; color: #808080;">
                        © ${new Date().getFullYear()} Hệ thống đặt sân bóng. Tất cả các quyền được bảo lưu.
                    </p>
                </div>
            `;

            // Chỉ gửi email khi trạng thái là confirmed, cancelled hoặc completed
            if (['confirmed', 'cancelled', 'completed'].includes(status)) {
                await sendEmail(user.email, 'custom', {
                    subject: emailSubject,
                    html: emailContent
                });
                console.log(`Đã gửi email thông báo trạng thái ${status} cho ${user.email}`);
            }
        } catch (emailError) {
            console.error('Lỗi gửi email thông báo trạng thái đặt sân:', emailError);
            // Vẫn tiếp tục vì cập nhật trạng thái đặt sân đã thành công
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

// Update payment status
exports.updatePaymentStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { paymentStatus, paymentProof } = req.body;

        const booking = await Booking.findByPk(id);

        if (!booking) {
            return next(new ApiError('Booking not found', 404));
        }

        // Only admin can update payment status directly
        // Regular users can only upload payment proof
        if (!req.user.isAdmin && req.user.id !== booking.userId) {
            return next(new ApiError('Not authorized to update this booking', 403));
        }

        if (req.user.isAdmin) {
            booking.paymentStatus = paymentStatus;
        }

        // Handle payment proof upload
        if (paymentProof) {
            booking.paymentProof = paymentProof;
            if (!req.user.isAdmin) {
                booking.paymentStatus = 'pending'; // Reset to pending for admin verification
            }
        }

        await booking.save();

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

// Delete booking (admin only or user can cancel)
exports.deleteBooking = async (req, res, next) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findByPk(id);

        if (!booking) {
            return next(new ApiError('Booking not found', 404));
        }

        // Only admin can delete bookings
        // Users can only cancel bookings
        if (!req.user.isAdmin && req.user.id === booking.userId) {
            booking.status = 'cancelled';
            booking.cancelledAt = new Date();
            booking.cancelReason = 'Cancelled by user';
            await booking.save();
        } else if (req.user.isAdmin) {
            await booking.destroy();
        } else {
            return next(new ApiError('Not authorized to delete this booking', 403));
        }

        res.status(200).json({
            success: true,
            message: req.user.isAdmin ? 'Booking deleted successfully' : 'Booking cancelled successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Helper function to check field availability
const checkFieldAvailability = async (fieldId, date, startTime, endTime) => {
    // Find any overlapping bookings
    const overlappingBookings = await Booking.findAll({
        where: {
            fieldId,
            date,
            status: {
                [Op.notIn]: ['cancelled']
            },
            [Op.or]: [
                {
                    startTime: {
                        [Op.lt]: endTime
                    },
                    endTime: {
                        [Op.gt]: startTime
                    }
                }
            ]
        }
    });

    return overlappingBookings.length === 0;
};

// Helper function to calculate field booking price
const calculateFieldPrice = (field, startTime, endTime) => {
    // Parse times to calculate duration in hours
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const durationHours = (end - start) / (1000 * 60 * 60);

    // Calculate price based on field hourly rate
    return field.price * durationHours;
}; 