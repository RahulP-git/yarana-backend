require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);

app.use((err, req, res, next) => {
    console.error("Global error:", err);
    res.status(500).json({
        success: false,
        message: err.message || "Internal server error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
});

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Yarana Backend API "
    });
});

module.exports = app;