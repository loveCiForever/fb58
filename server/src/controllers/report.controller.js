import Booking from "../models/booking.model.js";
import Field from "../models/field.model.js";

// Generate revenue report
export const generateRevenueReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.badRequest("Start date and end date are required");
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        // Get all confirmed bookings within the date range
        const bookings = await Booking.find({
            date: {
                $gte: start,
                $lte: end,
            },
            bookingStatus: "confirmed",
        }).populate("field", "name");

        // Calculate total revenue
        const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

        // Group revenue by field
        const revenueByField = await Booking.aggregate([
            {
                $match: {
                    date: {
                        $gte: start,
                        $lte: end,
                    },
                    bookingStatus: "confirmed",
                },
            },
            {
                $group: {
                    _id: "$field",
                    revenue: { $sum: "$totalPrice" },
                    bookings: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: "fields",
                    localField: "_id",
                    foreignField: "_id",
                    as: "Field",
                },
            },
            {
                $unwind: "$Field",
            },
            {
                $project: {
                    fieldId: "$_id",
                    revenue: 1,
                    bookings: 1,
                    "Field.name": 1,
                    _id: 0,
                },
            },
        ]);

        // Group revenue by date
        const revenueByDate = await Booking.aggregate([
            {
                $match: {
                    date: {
                        $gte: start,
                        $lte: end,
                    },
                    bookingStatus: "confirmed",
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$date",
                        },
                    },
                    revenue: { $sum: "$totalPrice" },
                    bookings: { $sum: 1 },
                },
            },
            {
                $project: {
                    date: "$_id",
                    revenue: 1,
                    bookings: 1,
                    _id: 0,
                },
            },
            {
                $sort: { date: 1 },
            },
        ]);

        res.success("Revenue report generated successfully", {
            data: {
                startDate,
                endDate,
                totalRevenue,
                fieldRevenueOnly: totalRevenue,
                revenueByField,
                revenueByDate,
            },
        });
    } catch (error) {
        res.error("Error generating revenue report", error);
    }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        // Get total users (assuming User model exists)
        const totalUsers = await User.countDocuments();

        // Get total fields
        const totalFields = await Field.countDocuments();

        // Get total bookings
        const totalBookings = await Booking.countDocuments();

        // Get booking statistics
        const bookingStats = await Booking.aggregate([
            {
                $group: {
                    _id: "$bookingStatus",
                    count: { $sum: 1 },
                },
            },
        ]);

        // Get recent bookings
        const recentBookings = await Booking.find()
            .populate("field", "name")
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .limit(10);

        // Get revenue statistics for the last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const revenueStats = await Booking.aggregate([
            {
                $match: {
                    date: { $gte: sixMonthsAgo },
                    bookingStatus: "confirmed",
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m",
                            date: "$date",
                        },
                    },
                    totalRevenue: { $sum: "$totalPrice" },
                    bookingCount: { $sum: 1 },
                },
            },
            {
                $project: {
                    period: "$_id",
                    totalRevenue: 1,
                    bookingCount: 1,
                    _id: 0,
                },
            },
            {
                $sort: { period: 1 },
            },
        ]);

        // Get field popularity
        const fieldPopularity = await Booking.aggregate([
            {
                $match: {
                    bookingStatus: "confirmed",
                },
            },
            {
                $group: {
                    _id: "$field",
                    bookingCount: { $sum: 1 },
                    totalRevenue: { $sum: "$totalPrice" },
                },
            },
            {
                $lookup: {
                    from: "fields",
                    localField: "_id",
                    foreignField: "_id",
                    as: "Field",
                },
            },
            {
                $unwind: "$Field",
            },
            {
                $project: {
                    fieldName: "$Field.name",
                    bookingCount: 1,
                    totalRevenue: 1,
                    _id: 0,
                },
            },
            {
                $sort: { bookingCount: -1 },
            },
            {
                $limit: 5,
            },
        ]);

        // Get peak times
        const peakTimes = await Booking.aggregate([
            {
                $match: {
                    bookingStatus: "confirmed",
                },
            },
            {
                $group: {
                    _id: "$shift.name",
                    bookingCount: { $sum: 1 },
                },
            },
            {
                $project: {
                    shift: "$_id",
                    bookingCount: 1,
                    _id: 0,
                },
            },
            {
                $sort: { bookingCount: -1 },
            },
            {
                $limit: 5,
            },
        ]);

        res.success("Dashboard statistics retrieved successfully", {
            data: {
                overview: {
                    totalUsers,
                    totalFields,
                    totalBookings,
                },
                recentBookings,
                bookingStats: bookingStats.reduce((acc, stat) => {
                    acc[stat._id] = stat.count;
                    return acc;
                }, {}),
                revenueStats,
                fieldPopularity,
                peakTimes,
            },
        });
    } catch (error) {
        res.error("Error retrieving dashboard statistics", error);
    }
}; 