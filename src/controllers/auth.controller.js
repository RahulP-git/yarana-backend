const {
    registerUser,
    loginUser,
    refreshAccessToken
} = require("../repositories/auth.repository");
const { createOTP, verifyOTP, resendOTP } = require("../repositories/otp.repository");
const {
    validateRegisterInit,
    validateOtpVerify,
    validateOtpResend,
    validateRegisterComplete,
    validateLogin,
    validateRefreshToken,
    validateForgotPassword,
    validateResetPassword
} = require("../validations/auth.validation");
const sendResponse = require("../utils/response");
const {
    SUCCESS,
    CREATED,
    BAD_REQUEST,
    UNAUTHORIZED
} = require("../constants/statusCodes");

const registerInit = async (req, res) => {
    try {
        const errors = validateRegisterInit(req.body);
        if (errors.length > 0) {
            return sendResponse(
                res,
                BAD_REQUEST,
                false,
                "Validation failed",
                { errors, error_code: "VALIDATION_ERROR" }
            );
        }

        const { phone, role } = req.body;
        const result = await createOTP(phone, "registration");

        const responseData = {
            otp_session_id: result.otp_session_id,
            expires_in: result.expires_in
        };

        if (result.otp) {
            responseData.otp = result.otp;
        }

        return sendResponse(
            res,
            SUCCESS,
            true,
            "OTP sent successfully",
            responseData
        );
    } catch (error) {
        return sendResponse(
            res,
            BAD_REQUEST,
            false,
            error.message,
            { error_code: error.error_code || "OTP_ERROR" }
        );
    }
};

const verifyOtp = async (req, res) => {
    try {
        const errors = validateOtpVerify(req.body);
        if (errors.length > 0) {
            return sendResponse(
                res,
                BAD_REQUEST,
                false,
                "Validation failed",
                { errors, error_code: "VALIDATION_ERROR" }
            );
        }

        const { otp_session_id, otp } = req.body;
        const result = await verifyOTP(otp_session_id, otp, "registration");

        return sendResponse(
            res,
            SUCCESS,
            true,
            "OTP verified",
            { otp_verified_token: result.otp_verified_token }
        );
    } catch (error) {
        return sendResponse(
            res,
            BAD_REQUEST,
            false,
            error.message,
            { error_code: "INVALID_OTP" }
        );
    }
};

const resendOtp = async (req, res) => {
    try {
        const errors = validateOtpResend(req.body);
        if (errors.length > 0) {
            return sendResponse(
                res,
                BAD_REQUEST,
                false,
                "Validation failed",
                { errors, error_code: "VALIDATION_ERROR" }
            );
        }

        const { otp_session_id } = req.body;
        const result = await resendOTP(otp_session_id, "registration");

        const responseData = {
            expires_in: result.expires_in
        };

        if (result.otp) {
            responseData.otp = result.otp;
        }

        return sendResponse(
            res,
            SUCCESS,
            true,
            "OTP resent",
            responseData
        );
    } catch (error) {
        return sendResponse(
            res,
            BAD_REQUEST,
            false,
            error.message,
            { error_code: "RESEND_ERROR" }
        );
    }
};

const registerCustomer = async (req, res) => {
    try {
        const errors = validateRegisterComplete(req.body);
        if (errors.length > 0) {
            return sendResponse(
                res,
                BAD_REQUEST,
                false,
                "Validation failed",
                { errors, error_code: "VALIDATION_ERROR" }
            );
        }

        const {
            full_name,
            email,
            phone,
            current_address,
            location,
            dob,
            gender,
            password,
            profile_photo_url,
            id_proof_url,
            accepted_terms
        } = req.body;

        const [day, month, year] = dob.split("-").map(Number);
        const dobDate = new Date(year, month - 1, day);

        const result = await registerUser({
            fullName: full_name,
            email,
            phone,
            currentAddress: current_address,
            location,
            dob: dobDate,
            gender,
            password,
            profilePhoto: profile_photo_url || "",
            idProofUrl: id_proof_url || "",
            acceptedTerms: accepted_terms,
            role: "customer"
        });

        return sendResponse(
            res,
            CREATED,
            true,
            "Account created",
            result
        );
    } catch (error) {
        return sendResponse(
            res,
            BAD_REQUEST,
            false,
            error.message,
            { error_code: error.error_code || "REGISTRATION_ERROR" }
        );
    }
};

const validateRegisterProvider = (data) => {
    const {
        otp_verified_token,
        full_name,
        email,
        phone,
        current_address,
        dob,
        gender,
        password,
        confirm_password,
        id_proof_url,
        service_type,
        experience,
        accepted_terms
    } = data;
    const errors = [];

    if (!otp_verified_token) {
        errors.push("OTP verified token is required");
    }

    if (!full_name || full_name.trim().length < 3 || full_name.trim().length > 50) {
        errors.push("Full name must be between 3 and 50 characters");
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        errors.push("Please provide a valid email");
    }

    if (!phone || phone.trim().length < 10) {
        errors.push("Valid phone number is required");
    }

    if (!dob || !/^\d{2}-\d{2}-\d{4}$/.test(dob)) {
        errors.push("Date of birth must be in DD-MM-YYYY format");
    } else {
        const [day, month, year] = dob.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        if (isNaN(date.getTime())) {
            errors.push("Please provide a valid date of birth");
        }
    }

    if (!gender || !["Male", "Female", "Other"].includes(gender)) {
        errors.push("Gender must be Male, Female, or Other");
    }

    if (!current_address || current_address.trim().length < 5) {
        errors.push("Current address is required");
    }

    if (!password || password.length < 8) {
        errors.push("Password must be at least 8 characters");
    } else {
        if (!/[a-z]/.test(password)) errors.push("Password must contain at least one lowercase letter");
        if (!/[A-Z]/.test(password)) errors.push("Password must contain at least one uppercase letter");
        if (!/\d/.test(password)) errors.push("Password must contain at least one number");
        if (!/[@$!%*?&]/.test(password)) errors.push("Password must contain at least one special character (@$!%*?&)");
    }

    if (password !== confirm_password) {
        errors.push("Passwords do not match");
    }

    if (!id_proof_url || id_proof_url.trim().length === 0) {
        errors.push("ID proof is required");
    }

    if (!service_type || !Array.isArray(service_type) || service_type.length === 0) {
        errors.push("At least one service type is required");
    }

    if (!experience || experience < 0) {
        errors.push("Experience is required");
    }

    if (!accepted_terms) {
        errors.push("You must accept the terms and conditions");
    }

    return errors;
};

const registerProvider = async (req, res) => {
    try {
        const errors = validateRegisterProvider(req.body);
        if (errors.length > 0) {
            return sendResponse(
                res,
                BAD_REQUEST,
                false,
                "Validation failed",
                { errors, error_code: "VALIDATION_ERROR" }
            );
        }

        const [
            full_name,
            email,
            phone,
            current_address,
            location,
            dob,
            gender,
            password,
            id_proof_url,
            service_type,
            experience,
            accepted_terms
        ] = req.body;

        const [day, month, year] = dob.split("-").map(Number);
        const dobDate = new Date(year, month - 1, day);

        const result = await registerUser({
            fullName: full_name,
            email,
            phone,
            currentAddress: current_address,
            location,
            dob: dobDate,
            gender,
            password,
            profilePhoto: "",
            idProofUrl: id_proof_url || "",
            serviceType: service_type || [],
            experience: experience || 0,
            acceptedTerms: accepted_terms,
            role: "provider"
        });

        return sendResponse(
            res,
            CREATED,
            true,
            "Provider account created. KYC under review.",
            {
                provider: result.user,
                access_token: result.access_token,
                refresh_token: result.refresh_token,
                expires_in: result.expires_in
            }
        );
    } catch (error) {
        return sendResponse(
            res,
            BAD_REQUEST,
            false,
            error.message,
            { error_code: error.error_code || "REGISTRATION_ERROR" }
        );
    }
};

const login = async (req, res) => {
    try {
        const errors = validateLogin(req.body);
        if (errors.length > 0) {
            return sendResponse(
                res,
                BAD_REQUEST,
                false,
                "Validation failed",
                { errors, error_code: "VALIDATION_ERROR" }
            );
        }

        const { identifier, password, role } = req.body;
        const result = await loginUser(identifier, password, role);

        return sendResponse(
            res,
            SUCCESS,
            true,
            "Login successful",
            result
        );
    } catch (error) {
        return sendResponse(
            res,
            UNAUTHORIZED,
            false,
            error.message,
            { error_code: error.error_code || "INVALID_CREDENTIALS" }
        );
    }
};

const refreshToken = async (req, res) => {
    try {
        const errors = validateRefreshToken(req.body);
        if (errors.length > 0) {
            return sendResponse(
                res,
                BAD_REQUEST,
                false,
                "Validation failed",
                { errors, error_code: "VALIDATION_ERROR" }
            );
        }

        const { refresh_token } = req.body;
        const result = await refreshAccessToken(refresh_token);

        return sendResponse(
            res,
            SUCCESS,
            true,
            "Token refreshed",
            result
        );
    } catch (error) {
        return sendResponse(
            res,
            UNAUTHORIZED,
            false,
            "Invalid refresh token",
            { error_code: "INVALID_TOKEN" }
        );
    }
};

const forgotPassword = async (req, res) => {
    try {
        const errors = validateForgotPassword(req.body);
        if (errors.length > 0) {
            return sendResponse(
                res,
                BAD_REQUEST,
                false,
                "Validation failed",
                { errors, error_code: "VALIDATION_ERROR" }
            );
        }

        const { identifier } = req.body;
        const phone = identifier.includes("@")
            ? identifier.replace(/[^0-9]/g, "").slice(-10)
            : identifier;

        const result = await createOTP(phone, "forgot_password");

        const responseData = {
            otp_session_id: result.otp_session_id,
            expires_in: result.expires_in
        };

        if (result.otp) {
            responseData.otp = result.otp;
        }

        return sendResponse(
            res,
            SUCCESS,
            true,
            "OTP sent successfully",
            responseData
        );
    } catch (error) {
        return sendResponse(
            res,
            BAD_REQUEST,
            false,
            error.message,
            { error_code: "OTP_ERROR" }
        );
    }
};

const resetPassword = async (req, res) => {
    try {
        const errors = validateResetPassword(req.body);
        if (errors.length > 0) {
            return sendResponse(
                res,
                BAD_REQUEST,
                false,
                "Validation failed",
                { errors, error_code: "VALIDATION_ERROR" }
            );
        }

        return sendResponse(
            res,
            SUCCESS,
            true,
            "Password reset successfully"
        );
    } catch (error) {
        return sendResponse(
            res,
            BAD_REQUEST,
            false,
            error.message,
            { error_code: "RESET_ERROR" }
        );
    }
};

const logout = async (req, res) => {
    return sendResponse(
        res,
        SUCCESS,
        true,
        "Logged out successfully"
    );
};

module.exports = {
    registerInit,
    verifyOtp,
    resendOtp,
    registerCustomer,
    registerProvider,
    login,
    refreshToken,
    forgotPassword,
    resetPassword,
    logout
};
