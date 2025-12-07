// backend/routes/donorRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  registerAsDonor,
  searchDonors
} from "../controllers/donorController.js";

const router = express.Router();

// REGISTER as donor (Login Required)
router.post("/register", protect, registerAsDonor);

// SEARCH donors by filters
router.get("/search", searchDonors);

export default router;
