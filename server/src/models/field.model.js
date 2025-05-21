import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        short_description: {
            type: String,
            required: true,
            trim: true,
        },
        full_description: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            required: true,
            enum: ["5-a-side", "7-a-side", "11-a-side"],
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        priceWithLights: {
            type: Number,
            required: true,
            min: 0,
        },
        openTime: {
            type: String,
            required: true,
            match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        },
        closeTime: {
            type: String,
            required: true,
            match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        },
        status: {
            type: String,
            required: true,
            enum: ["available", "maintenance", "unavailable"],
            default: "available",
        },
        image: {
            type: String,
            required: true,
        },
        capacity: {
            players: {
                type: Number,
                required: true,
                min: 0,
            },
            seats: {
                type: Number,
                required: true,
                min: 0,
            },
        },
    },
    {
        timestamps: true,
    }
);

const Field = mongoose.model("Field", fieldSchema);

export default Field; 