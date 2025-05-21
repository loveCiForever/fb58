import Booking from "../models/booking.model.js";
import Field from "../models/field.model.js";

// Get available shifts
export const getAvailableShifts = async (req, res) => {
    try {
        const { fieldId, date } = req.query;
        const field = await Field.findById(fieldId);

        if (!field) {
            return res.notFound("Field not found");
        }

        // Get all bookings for the field on the specified date
        const bookings = await Booking.find({
            field: fieldId,
            date: new Date(date),
            bookingStatus: { $in: ["confirmed", "pending"] },
        });

        // Create a set of booked shifts
        const bookedShifts = new Set(bookings.map((booking) => booking.shift.name));

        // Define all possible shifts
        const allShifts = [
            "SHIFT_1",
            "SHIFT_2",
            "SHIFT_3",
            "SHIFT_4",
            "SHIFT_5",
            "SHIFT_6",
            "SHIFT_7",
            "SHIFT_8",
        ];

        // Filter out booked shifts
        const availableShifts = allShifts.filter((shift) => !bookedShifts.has(shift));

        res.success("Available shifts retrieved successfully", { data: availableShifts });
    } catch (error) {
        res.error("Error retrieving available shifts", error);
    }
};

// Create a new booking
export const createBooking = async (req, res) => {
    try {
        const { field, date, shift, team1, team2 } = req.body;
        const userId = req.user._id;

        // Check if field exists
        const fieldExists = await Field.findById(field);
        if (!fieldExists) {
            return res.notFound("Field not found");
        }

        // Check if shift is available
        const existingBooking = await Booking.findOne({
            field,
            date: new Date(date),
            "shift.name": shift,
            bookingStatus: { $in: ["confirmed", "pending"] },
        });

        if (existingBooking) {
            return res.badRequest("This shift is already booked");
        }

        // Calculate total price
        const totalPrice = fieldExists.price;

        const booking = new Booking({
            field,
            user: userId,
            date: new Date(date),
            shift: {
                name: shift,
                startTime: getShiftTime(shift).startTime,
                endTime: getShiftTime(shift).endTime,
            },
            team1,
            team2,
            totalPrice,
        });

        await booking.save();

        res.success("Booking created successfully", { data: booking }, 201);
    } catch (error) {
        res.error("Error creating booking", error);
    }
};

// Get user's bookings
export const getUserBookings = async (req, res) => {
    try {
        const userId = req.user._id;
        const bookings = await Booking.find({ user: userId })
            .populate("field", "name")
            .sort({ date: -1, "shift.startTime": 1 });

        res.success("User bookings retrieved successfully", { data: bookings });
    } catch (error) {
        res.error("Error retrieving user bookings", error);
    }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { cancellationReason } = req.body;
        const userId = req.user._id;

        const booking = await Booking.findOne({ _id: id, user: userId });

        if (!booking) {
            return res.notFound("Booking not found");
        }

        if (booking.bookingStatus === "cancelled") {
            return res.badRequest("Booking is already cancelled");
        }

        if (booking.bookingStatus === "confirmed") {
            return res.badRequest("Cannot cancel a confirmed booking");
        }

        booking.bookingStatus = "cancelled";
        booking.cancellationReason = cancellationReason;
        await booking.save();

        res.success("Booking cancelled successfully", {
            data: {
                id: booking._id,
                bookingStatus: booking.bookingStatus,
                cancellationReason: booking.cancellationReason,
            },
        });
    } catch (error) {
        res.error("Error cancelling booking", error);
    }
};

// Get all bookings (admin only)
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("field", "name")
            .populate("user", "name email")
            .sort({ date: -1, "shift.startTime": 1 });

        res.success("All bookings retrieved successfully", { data: bookings });
    } catch (error) {
        res.error("Error retrieving all bookings", error);
    }
};

// Confirm booking (admin only)
export const confirmBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id);

        if (!booking) {
            return res.notFound("Booking not found");
        }

        if (booking.bookingStatus === "confirmed") {
            return res.badRequest("Booking is already confirmed");
        }

        booking.bookingStatus = "confirmed";
        await booking.save();

        res.success("Booking confirmed successfully", {
            data: {
                id: booking._id,
                bookingStatus: booking.bookingStatus,
            },
        });
    } catch (error) {
        res.error("Error confirming booking", error);
    }
};

// Reject booking (admin only)
export const rejectBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { rejectionReason } = req.body;
        const booking = await Booking.findById(id);

        if (!booking) {
            return res.notFound("Booking not found");
        }

        if (booking.bookingStatus === "rejected") {
            return res.badRequest("Booking is already rejected");
        }

        booking.bookingStatus = "rejected";
        booking.rejectionReason = rejectionReason;
        await booking.save();

        res.success("Booking rejected successfully", {
            data: {
                id: booking._id,
                bookingStatus: booking.bookingStatus,
                rejectionReason: booking.rejectionReason,
            },
        });
    } catch (error) {
        res.error("Error rejecting booking", error);
    }
};

// Get field shifts
export const getFieldShifts = async (req, res) => {
    try {
        const { fieldId, date } = req.query;
        const field = await Field.findById(fieldId);

        if (!field) {
            return res.notFound("Field not found");
        }

        const bookings = await Booking.find({
            field: fieldId,
            date: new Date(date),
        })
            .populate("user", "name email")
            .sort({ "shift.startTime": 1 });

        const shifts = [
            "SHIFT_1",
            "SHIFT_2",
            "SHIFT_3",
            "SHIFT_4",
            "SHIFT_5",
            "SHIFT_6",
            "SHIFT_7",
            "SHIFT_8",
        ].map((shiftName) => {
            const booking = bookings.find((b) => b.shift.name === shiftName);
            return {
                shift: shiftName,
                startTime: getShiftTime(shiftName).startTime,
                endTime: getShiftTime(shiftName).endTime,
                isAvailable: !booking,
                booking: booking
                    ? {
                        id: booking._id,
                        team1: booking.team1,
                        team2: booking.team2,
                        bookingStatus: booking.bookingStatus,
                        user: {
                            name: booking.user.name,
                            email: booking.user.email,
                        },
                    }
                    : null,
            };
        });

        res.success("Field shifts retrieved successfully", {
            data: {
                field: {
                    id: field._id,
                    name: field.name,
                },
                date,
                shifts,
            },
        });
    } catch (error) {
        res.error("Error retrieving field shifts", error);
    }
};

// Helper function to get shift times
const getShiftTime = (shift) => {
    const shiftTimes = {
        SHIFT_1: { startTime: "06:00", endTime: "08:00" },
        SHIFT_2: { startTime: "08:00", endTime: "10:00" },
        SHIFT_3: { startTime: "10:00", endTime: "12:00" },
        SHIFT_4: { startTime: "12:00", endTime: "14:00" },
        SHIFT_5: { startTime: "14:00", endTime: "16:00" },
        SHIFT_6: { startTime: "16:00", endTime: "18:00" },
        SHIFT_7: { startTime: "18:00", endTime: "20:00" },
        SHIFT_8: { startTime: "20:00", endTime: "22:00" },
    };
    return shiftTimes[shift];
}; 