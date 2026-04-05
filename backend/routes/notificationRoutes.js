import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getNotifications, markAllRead, markOneRead } from "../controllers/notificationController.js";

const router = express.Router();
router.get("/", protect, getNotifications);
router.put("/read-all", protect, markAllRead);
router.put("/:id/read", protect, markOneRead);

export default router;
