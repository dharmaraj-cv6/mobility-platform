import { Router } from "express";
import { register, login, verifyOtp, getProfile, } from "../controllers/auth.controller.js";
import authenticate from "../middleware/auth.middleware.js";
const router = Router();
// =====================================================
// PUBLIC AUTH
// =====================================================
// Register
router.post("/register", register);
// Login
router.post("/login", login);
// Verify OTP
router.post("/verify-otp", verifyOtp);
// =====================================================
// PROTECTED
// =====================================================
// Profile
router.get("/profile", authenticate, getProfile);
export default router;
