const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Customer is required"]
        },
        serviceType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Service type is required"]
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            maxlength: [1000, "Description cannot exceed 1000 characters"]
        },
        images: {
            type: [String],
            default: []
        },
        budget: {
            type: Number,
            required: [true, "Budget is required"],
            min: [0, "Budget cannot be negative"]
        },
        preferredDate: {
            type: Date,
            required: [true, "Preferred date is required"]
        },
        preferredTime: {
            type: String,
            required: [true, "Preferred time is required"]
        },
        priority: {
            type: String,
            enum: {
                values: ["low", "medium", "high"],
                message: "Priority must be low, medium, or high"
            },
            default: "medium"
        },
        location: {
            address: { type: String, default: "" },
            lat: { type: Number, default: 0 },
            lng: { type: Number, default: 0 }
        },
        contactNumber: {
            type: String,
            required: [true, "Contact number is required"],
            trim: true
        },
        status: {
            type: String,
            enum: {
                values: ["open", "quoted", "booked", "completed", "cancelled"],
                message: "Status must be open, quoted, booked, completed, or cancelled"
            },
            default: "open"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);
