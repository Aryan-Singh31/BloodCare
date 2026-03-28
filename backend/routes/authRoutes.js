// backend/routes/authRoutes.js
import express from "express";
import {
  registerDonor,
  loginDonor,
  getMe,
  verifyOTP,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerDonor);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginDonor);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", protect, getMe);

export default router;
