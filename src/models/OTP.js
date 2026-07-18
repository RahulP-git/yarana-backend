const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
    {
        otpSessionId: {
            type: String,
            required: true,
            unique: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        otp: {
            type: String,
            required: true
        },
        purpose: {
            type: String,
            enum: ["registration", "forgot_password"],
            required: true
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        expiresAt: {
            type: Date,
            required: true
        },
        resendCount: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("OTP", otpSchema);
