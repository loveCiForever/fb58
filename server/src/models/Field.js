const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Field name is required'],
        trim: true
    },
    short_description: {
        type: String,
        required: [true, 'Short description is required'],
        trim: true
    },
    full_description: {
        type: String,
        required: [true, 'Full description is required'],
        trim: true
    },
    grass_type: {
        type: String,
        required: [true, 'Grass type is required'],
        enum: ['natural', 'artificial'],
        default: 'artificial'
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    capacity: {
        players: {
            type: Number,
            required: [true, 'Number of players is required'],
            min: [1, 'Number of players must be at least 1']
        },
        seats: {
            type: Number,
            required: [true, 'Number of seats is required'],
            min: [0, 'Number of seats cannot be negative']
        }
    },
    status: {
        type: String,
        enum: ['available', 'maintenance', 'closed'],
        default: 'available'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Field = mongoose.model('Field', fieldSchema);

module.exports = Field; 