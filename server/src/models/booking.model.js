import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        field: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Field",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        shift: {
            name: {
                type: String,
                required: true,
                enum: [
                    "SHIFT_1",
                    "SHIFT_2",
                    "SHIFT_3",
                    "SHIFT_4",
                    "SHIFT_5",
                    "SHIFT_6",
                    "SHIFT_7",
                    "SHIFT_8",
                ],
            },
            startTime: {
                type: String,
                required: true,
                match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
            },
            endTime: {
                type: String,
                required: true,
                match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
            },
        },
        team1: {
            type: String,
            required: true,
            trim: true,
        },
        team2: {
            type: String,
            required: true,
            trim: true,
        },
        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        bookingStatus: {
            type: String,
            required: true,
            enum: ["pending", "confirmed", "cancelled", "rejected"],
            default: "pending",
        },
        paymentStatus: {
            type: String,
            required: true,
            enum: ["pending", "paid", "refunded"],
            default: "pending",
        },
        cancellationReason: {
            type: String,
            trim: true,
        },
        rejectionReason: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient querying
bookingSchema.index({ field: 1, date: 1, "shift.name": 1 });
bookingSchema.index({ user: 1, date: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking; 