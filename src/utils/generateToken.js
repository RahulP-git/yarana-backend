const jwt = require("jsonwebtoken");

const generateAccessToken = (id, role) => {
    return jwt.sign(
        { id, role, type: "access" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};

const generateRefreshToken = (id, role) => {
    return jwt.sign(
        { id, role, type: "refresh" },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    );
};

const generateTokens = (id, role) => {
    const access_token = generateAccessToken(id, role);
    const refresh_token = generateRefreshToken(id, role);
    return { access_token, refresh_token };
};

module.exports = { generateAccessToken, generateRefreshToken, generateTokens };
