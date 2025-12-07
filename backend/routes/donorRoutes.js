// backend/routes/donorRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js"; 
import {
  registerAsDonor,
  searchDonors,
  getAllDonors
} from "../controllers/donorController.js";

const router = express.Router();

// REGISTER as a donor (Login Required)
router.post("/register", protect, registerAsDonor);

// GET all donors
router.get("/", getAllDonors);

// SEARCH donors by city + blood group
router.get("/search", searchDonors);

export default router;
