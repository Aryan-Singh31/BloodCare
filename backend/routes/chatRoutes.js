import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getChatByRoom, markAsRead, getInbox } from "../controllers/chatController.js";

const router = express.Router();

router.get("/room/:roomId", protect, getChatByRoom);
router.put("/read/:id", protect, markAsRead);
router.get("/inbox/:userId", protect, getInbox);

export default router;
