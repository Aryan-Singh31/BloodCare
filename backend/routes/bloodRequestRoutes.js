import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createRequest, getRequests, closeRequest } from "../controllers/bloodRequestController.js";

const router = express.Router();
router.get("/", getRequests);
router.post("/", protect, createRequest);
router.put("/:id/close", protect, closeRequest);

export default router;
