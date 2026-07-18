const validateRegisterInit = (data) => {
    const { phone, role } = data;
    const errors = [];

    if (!phone || phone.trim().length < 10) {
        errors.push("Valid phone number is required");
    }

    if (!role || !["customer", "provider"].includes(role)) {
        errors.push("Role must be customer or provider");
    }

    return errors;
};

const validateOtpVerify = (data) => {
    const { otp_session_id, otp } = data;
    const errors = [];

    if (!otp_session_id) {
        errors.push("OTP session ID is required");
    }

    if (!otp || !/^\d{6}$/.test(otp)) {
        errors.push("Valid 6-digit OTP is required");
    }

    return errors;
};

const validateOtpResend = (data) => {
    const { otp_session_id } = data;
    const errors = [];

    if (!otp_session_id) {
        errors.push("OTP session ID is required");
    }

    return errors;
};

const validateRegisterComplete = (data) => {
    const {
        otp_verified_token,
        full_name,
        email,
        phone,
        current_address,
        password,
        confirm_password,
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

    if (!accepted_terms) {
        errors.push("You must accept the terms and conditions");
    }

    return errors;
};

const validateLogin = (data) => {
    const { identifier, password, role } = data;
    const errors = [];

    if (!identifier) {
        errors.push("Email or phone number is required");
    }

    if (!password) {
        errors.push("Password is required");
    }

    if (!role || !["customer", "provider"].includes(role)) {
        errors.push("Role must be customer or provider");
    }

    return errors;
};

const validateRefreshToken = (data) => {
    const { refresh_token } = data;
    const errors = [];

    if (!refresh_token) {
        errors.push("Refresh token is required");
    }

    return errors;
};

const validateForgotPassword = (data) => {
    const { identifier } = data;
    const errors = [];

    if (!identifier) {
        errors.push("Phone number or email is required");
    }

    return errors;
};

const validateResetPassword = (data) => {
    const { otp_verified_token, new_password, confirm_password } = data;
    const errors = [];

    if (!otp_verified_token) {
        errors.push("OTP verified token is required");
    }

    if (!new_password || new_password.length < 8) {
        errors.push("Password must be at least 8 characters");
    }

    if (new_password !== confirm_password) {
        errors.push("Passwords do not match");
    }

    return errors;
};

module.exports = {
    validateRegisterInit,
    validateOtpVerify,
    validateOtpResend,
    validateRegisterComplete,
    validateLogin,
    validateRefreshToken,
    validateForgotPassword,
    validateResetPassword
};
