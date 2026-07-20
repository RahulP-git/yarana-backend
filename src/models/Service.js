const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Service name is required"],
            trim: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Category is required"]
        },
        provider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Provider is required"]
        },
        description: {
            type: String,
            default: ""
        },
        price: {
            type: Number,
            default: 0
        },
        image: {
            type: String,
            default: ""
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Service", serviceSchema);
