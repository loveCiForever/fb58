import mongoose from "mongoose";

const supportSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        subject: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            required: true,
            enum: ["open", "in_progress", "resolved", "closed"],
            default: "open",
        },
        responses: [
            {
                responder: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                message: {
                    type: String,
                    required: true,
                    trim: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Index for efficient querying
supportSchema.index({ user: 1, status: 1 });
supportSchema.index({ status: 1 });

const Support = mongoose.model("Support", supportSchema);

export default Support; 