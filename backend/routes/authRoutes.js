// backend/routes/authRoutes.js
import express from "express";
import { registerDonor, loginDonor, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerDonor);
router.post("/login", loginDonor);
router.get("/me", protect, getMe);

export default router;
