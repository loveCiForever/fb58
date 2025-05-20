const mongoose = require('mongoose');

// Định nghĩa các ca trong ngày
const SHIFTS = {
    SHIFT_1: { start: '06:00', end: '08:00' },
    SHIFT_2: { start: '08:00', end: '10:00' },
    SHIFT_3: { start: '10:00', end: '12:00' },
    SHIFT_4: { start: '13:00', end: '15:00' },
    SHIFT_5: { start: '15:00', end: '17:00' },
    SHIFT_6: { start: '17:00', end: '19:00' },
    SHIFT_7: { start: '19:00', end: '21:00' },
    SHIFT_8: { start: '21:00', end: '23:00' }
};

const bookingSchema = new mongoose.Schema({
    field: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Field',
        required: [true, 'Field is required']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    shift: {
        type: String,
        required: [true, 'Shift is required'],
        enum: Object.keys(SHIFTS),
        get: function (shift) {
            return {
                name: shift,
                startTime: SHIFTS[shift].start,
                endTime: SHIFTS[shift].end
            };
        }
    },
    team1: {
        type: String,
        required: [true, 'Team 1 name is required'],
        trim: true
    },
    team2: {
        type: String,
        required: [true, 'Team 2 name is required'],
        trim: true
    },
    totalPrice: {
        type: Number,
        required: [true, 'Total price is required'],
        min: [0, 'Total price cannot be negative']
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending'
    },
    bookingStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'rejected'],
        default: 'pending'
    },
    cancellationReason: {
        type: String,
        trim: true
    },
    rejectionReason: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
});

// Validate that date is not in the past
bookingSchema.pre('save', function (next) {
    const bookingDate = new Date(this.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
        next(new Error('Cannot book for past dates'));
    }
    next();
});

// Static method to get all shifts
bookingSchema.statics.getShifts = function () {
    return Object.entries(SHIFTS).map(([name, { start, end }]) => ({
        name,
        startTime: start,
        endTime: end
    }));
};

// Static method to check if a shift is available
bookingSchema.statics.isShiftAvailable = async function (fieldId, date, shift) {
    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    const existingBooking = await this.findOne({
        field: fieldId,
        date: bookingDate,
        shift: shift,
        bookingStatus: { $in: ['pending', 'confirmed'] }
    });

    return !existingBooking;
};

// Static method to get available shifts for a field on a specific date
bookingSchema.statics.getAvailableShifts = async function (fieldId, date) {
    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    const bookedShifts = await this.find({
        field: fieldId,
        date: bookingDate,
        bookingStatus: { $in: ['pending', 'confirmed'] }
    }).select('shift');

    const bookedShiftNames = bookedShifts.map(booking => booking.shift);

    return Object.keys(SHIFTS).filter(shift => !bookedShiftNames.includes(shift));
};

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking; 