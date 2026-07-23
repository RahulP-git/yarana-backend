const express = require("express");
const {
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
} = require("../controllers/auth.controller");
const { uploadIdProof } = require("../utils/upload");

const router = express.Router();

router.post("/register/init", registerInit);
router.post("/otp/verify", verifyOtp);
router.post("/otp/resend", resendOtp);
router.post("/register/customer", registerCustomer);
router.post("/register/provider", uploadIdProof, registerProvider);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/forgot-password/init", forgotPassword);
router.post("/forgot-password/reset", resetPassword);
router.post("/logout", logout);

module.exports = router;
