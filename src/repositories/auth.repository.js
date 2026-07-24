const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateTokens } = require("../utils/generateToken");

const registerUser = async ({
    fullName,
    email,
    phone,
    currentAddress,
    location,
    dob,
    gender,
    password,
    profilePhoto,
    idProofUrl,
    acceptedTerms,
    serviceType,
    experience,
    businessName,
    role = "customer"
}) => {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        const error = new Error("Email already exists");
        error.error_code = "EMAIL_EXISTS";
        throw error;
    }

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
        const error = new Error("Phone number already registered");
        error.error_code = "PHONE_EXISTS";
        throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        fullName,
        email,
        phone,
        password: hashedPassword,
        currentAddress,
        location: location || { lat: 0, lng: 0 },
        dob,
        gender,
        profilePhoto: profilePhoto || "",
        idProofUrl: idProofUrl || "",
        serviceType: serviceType || [],
        experience: experience || 0,
        businessName: businessName || "",
        role,
        isVerified: false
    });

    const { access_token, refresh_token } = generateTokens(user._id, user.role);

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return {
        user: userWithoutPassword,
        access_token,
        refresh_token,
        expires_in: 3600
    };
};

const loginUser = async (identifier, password, role) => {
    let user;

    if (identifier.includes("@")) {
        user = await User.findOne({ email: identifier });
    } else {
        user = await User.findOne({ phone: identifier });
    }

    if (!user) {
        const error = new Error("Invalid credentials");
        error.error_code = "INVALID_CREDENTIALS";
        throw error;
    }

    if (user.role !== role) {
        const error = new Error("Invalid credentials");
        error.error_code = "INVALID_CREDENTIALS";
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        const error = new Error("Invalid credentials");
        error.error_code = "INVALID_CREDENTIALS";
        throw error;
    }

    const { access_token, refresh_token } = generateTokens(user._id, user.role);

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return {
        user: userWithoutPassword,
        access_token,
        refresh_token,
        expires_in: 3600
    };
};

const refreshAccessToken = (refreshToken) => {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (decoded.type !== "refresh") {
        throw new Error("Invalid token type");
    }

    const access_token = jwt.sign(
        { id: decoded.id, role: decoded.role, type: "access" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return { access_token, expires_in: 3600 };
};

module.exports = { registerUser, loginUser, refreshAccessToken };
