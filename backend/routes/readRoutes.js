import express from "express";
import { markAsRead } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/:id", protect, markAsRead);

export default router;
