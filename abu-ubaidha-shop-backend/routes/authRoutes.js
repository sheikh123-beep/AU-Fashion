import express from "express";

import {
  registerUser,
  loginUser,
  verifyEmailOTP,
  resendVerificationOTP,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// REGISTER
router.post("/register", registerUser);

// VERIFY EMAIL
router.post("/verify-email", verifyEmailOTP);

// RESEND OTP
router.post("/resend-verification", resendVerificationOTP);

// LOGIN
router.post("/login", loginUser);

// FORGOT PASSWORD
router.post("/forgot-password", forgotPassword);

// RESET PASSWORD
router.post("/reset-password", resetPassword);

export default router;