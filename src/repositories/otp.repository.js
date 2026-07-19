const crypto = require("crypto");
const OTP = require("../models/OTP");

const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

const sendOTPService = async (phone, otp) => {
    console.log(`[OTP SERVICE] Sending OTP ${otp} to ${phone}`);
    return true;
};

const createOTP = async (phone, purpose) => {
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const otpSessionId = `otp_${Date.now()}`;

    await OTP.findOneAndUpdate(
        { phone, purpose },
        {
            otpSessionId,
            otp,
            purpose,
            expiresAt,
            isVerified: false,
            resendCount: 0
        },
        { upsert: true, new: true }
    );

    await sendOTPService(phone, otp);

    const response = { otp_session_id: otpSessionId, expires_in: 300 };

    if (process.env.DEV_OTP_FALLBACK === "true") {
        response.otp = otp;
    }

    return response;
};

const verifyOTP = async (otpSessionId, otp, purpose) => {
    const otpRecord = await OTP.findOne({ otpSessionId, purpose });

    if (!otpRecord) {
        throw new Error("OTP session not found");
    }

    if (otpRecord.isVerified) {
        throw new Error("OTP already verified");
    }

    if (new Date() > otpRecord.expiresAt) {
        throw new Error("OTP expired");
    }

    if (otpRecord.otp !== otp) {
        throw new Error("Invalid OTP");
    }

    otpRecord.isVerified = true;
    await otpRecord.save();

    const otpVerifiedToken = `vt_${Date.now()}_${crypto.randomBytes(16).toString("hex")}`;

    return { otp_verified_token: otpVerifiedToken };
};

const resendOTP = async (otpSessionId, purpose) => {
    const otpRecord = await OTP.findOne({ otpSessionId, purpose });

    if (!otpRecord) {
        throw new Error("OTP session not found");
    }

    if (otpRecord.resendCount >= 3) {
        throw new Error("Maximum resend attempts reached");
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    otpRecord.otp = otp;
    otpRecord.expiresAt = expiresAt;
    otpRecord.resendCount += 1;
    await otpRecord.save();

    await sendOTPService(otpRecord.phone, otp);

    const response = { expires_in: 300 };

    if (process.env.DEV_OTP_FALLBACK === "true") {
        response.otp = otp;
    }

    return response;
};

module.exports = { createOTP, verifyOTP, resendOTP };
