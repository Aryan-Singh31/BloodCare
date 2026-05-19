const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const authMiddleware = require('../middleware/auth');

// Get or create conversation
router.get('/conversation/:userId', authMiddleware, async (req, res) => {
  try {
    const ids = [req.user._id.toString(), req.params.userId].sort();
    const conversationId = ids.join('_');

    const messages = await Message.find({ conversationId })
      .populate('sender', 'name avatar')
      .sort('createdAt')
      .limit(50);

    // Mark as read
    await Message.updateMany(
      { conversationId, receiver: req.user._id, read: false },
      { read: true }
    );

    res.json({ conversationId, messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all conversations for user
router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')
      .sort('-createdAt');

    // Group by conversation
    const conversationMap = {};
    messages.forEach(msg => {
      if (!msg.sender || !msg.receiver) return; // skip orphaned messages
      if (!conversationMap[msg.conversationId]) {
        conversationMap[msg.conversationId] = {
          conversationId: msg.conversationId,
          lastMessage: msg,
          otherUser: msg.sender._id.toString() === req.user._id.toString() ? msg.receiver : msg.sender,
        };
      }
    });

    // Count unread
    const conversations = Object.values(conversationMap);
    for (const conv of conversations) {
      conv.unreadCount = await Message.countDocuments({
        conversationId: conv.conversationId,
        receiver: req.user._id,
        read: false,
      });
    }

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
