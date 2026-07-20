const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Customer is required"]
        },
        provider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Provider is required"]
        },
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: [true, "Service is required"]
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "in_progress", "completed", "cancelled"],
            default: "pending"
        },
        scheduledAt: {
            type: Date,
            default: Date.now
        },
        completedAt: {
            type: Date
        },
        totalAmount: {
            type: Number,
            required: [true, "Total amount is required"]
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Booking", bookingSchema);
