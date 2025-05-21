import Field from "../models/field.model.js";
import Booking from "../models/booking.model.js";

// Get all fields
export const getAllFields = async (req, res) => {
    try {
        const fields = await Field.find({ status: "available" });
        res.success("Fields retrieved successfully", { fields });
    } catch (error) {
        res.error("Error retrieving fields", error);
    }
};

// Get field by ID
export const getFieldById = async (req, res) => {
    try {
        const field = await Field.findById(req.params.id);
        if (!field) {
            return res.notFound("Field not found");
        }
        res.success("Field retrieved successfully", { field });
    } catch (error) {
        res.error("Error retrieving field", error);
    }
};

// Get available time slots for a field on a specific date
export const getAvailableTimeSlots = async (req, res) => {
    try {
        const { fieldId, date } = req.params;
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

        res.success("Available time slots retrieved successfully", {
            field: field.name,
            date,
            availableTimeSlots: availableShifts,
        });
    } catch (error) {
        res.error("Error retrieving available time slots", error);
    }
};

// Get booked time slots by field ID and date
export const getBookedTimeSlotsByField = async (req, res) => {
    try {
        const { fieldId, date } = req.params;
        const field = await Field.findById(fieldId);

        if (!field) {
            return res.notFound("Field not found");
        }

        const bookings = await Booking.find({
            field: fieldId,
            date: new Date(date),
            bookingStatus: { $in: ["confirmed", "pending"] },
        }).populate("user", "name email");

        res.success("Booked time slots retrieved successfully", {
            field: field.name,
            fieldId,
            date,
            booked_time_slots: bookings.map((booking) => ({
                team1: booking.team1,
                team2: booking.team2,
                startTime: booking.shift.startTime,
                endTime: booking.shift.endTime,
                bookedBy: booking.user._id,
                bookedAt: booking.createdAt,
            })),
        });
    } catch (error) {
        res.error("Error retrieving booked time slots", error);
    }
};

// Get booked time slots by date
export const getBookedTimeSlotsByDate = async (req, res) => {
    try {
        const { date } = req.params;
        const fields = await Field.find({ status: "available" });

        const result = await Promise.all(
            fields.map(async (field) => {
                const bookings = await Booking.find({
                    field: field._id,
                    date: new Date(date),
                    bookingStatus: { $in: ["confirmed", "pending"] },
                }).populate("user", "name email");

                return {
                    field: field.name,
                    id: field._id,
                    booked_time_slots: bookings.map((booking) => ({
                        team1: booking.team1,
                        team2: booking.team2,
                        startTime: booking.shift.startTime,
                        endTime: booking.shift.endTime,
                        bookedBy: booking.user._id,
                        bookedAt: booking.createdAt,
                    })),
                };
            })
        );

        res.success("Booked time slots retrieved successfully", {
            date,
            fields: result,
        });
    } catch (error) {
        res.error("Error retrieving booked time slots", error);
    }
};

// Create a new field (admin only)
export const createField = async (req, res) => {
    try {
        const field = new Field(req.body);
        await field.save();
        res.success("Field created successfully", { field }, 201);
    } catch (error) {
        res.error("Error creating field", error);
    }
};

// Update field (admin only)
export const updateField = async (req, res) => {
    try {
        const field = await Field.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!field) {
            return res.notFound("Field not found");
        }

        res.success("Field updated successfully", { field });
    } catch (error) {
        res.error("Error updating field", error);
    }
};

// Delete field (admin only)
export const deleteField = async (req, res) => {
    try {
        const field = await Field.findByIdAndDelete(req.params.id);

        if (!field) {
            return res.notFound("Field not found");
        }

        res.success("Field deleted successfully");
    } catch (error) {
        res.error("Error deleting field", error);
    }
}; 