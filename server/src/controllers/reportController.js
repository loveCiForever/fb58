const { Booking, BookingService, Field, Service, sequelize } = require('../models');
const { Op } = require('sequelize');

// Admin: Generate revenue report
exports.getRevenueReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Validate dates
        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start date and end date are required' });
        }

        // Set up date range filter
        const dateFilter = {
            date: {
                [Op.between]: [startDate, endDate]
            },
            paymentStatus: {
                [Op.in]: ['deposit_paid', 'fully_paid']
            }
        };

        // Get total field revenue
        const fieldRevenue = await Booking.findAll({
            where: dateFilter,
            attributes: [
                [sequelize.fn('SUM', sequelize.col('totalPrice')), 'totalRevenue']
            ],
            raw: true
        });

        // Get revenue by field
        const revenueByField = await Booking.findAll({
            where: dateFilter,
            attributes: [
                'fieldId',
                [sequelize.fn('SUM', sequelize.col('totalPrice')), 'revenue'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'bookings']
            ],
            include: [
                {
                    model: Field,
                    attributes: ['name']
                }
            ],
            group: ['fieldId', 'Field.id'],
            raw: true,
            nest: true
        });

        // Get revenue by service
        const serviceRevenue = await BookingService.findAll({
            include: [
                {
                    model: Booking,
                    where: dateFilter,
                    attributes: []
                },
                {
                    model: Service,
                    attributes: ['name', 'category']
                }
            ],
            attributes: [
                'serviceId',
                [sequelize.fn('SUM', sequelize.col('BookingService.totalPrice')), 'revenue'],
                [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity']
            ],
            group: ['serviceId', 'Service.id'],
            raw: true,
            nest: true
        });

        // Get revenue by date
        const revenueByDate = await Booking.findAll({
            where: dateFilter,
            attributes: [
                'date',
                [sequelize.fn('SUM', sequelize.col('totalPrice')), 'revenue'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'bookings']
            ],
            group: ['date'],
            order: [['date', 'ASC']],
            raw: true
        });

        const totalRevenue = fieldRevenue[0]?.totalRevenue || 0;

        // Calculate service revenue total
        let totalServiceRevenue = 0;
        serviceRevenue.forEach(service => {
            totalServiceRevenue += parseFloat(service.revenue);
        });

        return res.status(200).json({
            startDate,
            endDate,
            totalRevenue,
            fieldRevenueOnly: totalRevenue - totalServiceRevenue,
            serviceRevenueOnly: totalServiceRevenue,
            revenueByField,
            serviceRevenue,
            revenueByDate
        });
    } catch (error) {
        console.error('Revenue report error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}; 