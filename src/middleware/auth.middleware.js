const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - No token provided",
                error_code: "NO_TOKEN"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.type !== "access") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - Invalid token type",
                error_code: "INVALID_TOKEN_TYPE"
            });
        }

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized - Invalid or expired token",
            error_code: "INVALID_TOKEN"
        });
    }
};

module.exports = { authenticate };
