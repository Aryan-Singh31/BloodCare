// backend/controllers/chatController.js
import Chat from "../models/Chat.js";
import User from "../models/User.js";

// 1️⃣ Fetch chat history by room
export const getChatByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Chat.find({ room: roomId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error("Chat fetch error:", err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

// 2️⃣ Mark a message as read
export const markAsRead = async (req, res) => {
  try {
    await Chat.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: "Message marked as read" });
  } catch (err) {
    console.error("Message read update error:", err);
    res.status(500).json({ message: "Failed to update message" });
  }
};

// 3️⃣ Inbox list for user
export const getInbox = async (req, res) => {
  try {
    const userId = req.params.userId;

    const chats = await Chat.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { receiverId: userId }],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$room",
          lastMessage: { $first: "$message" },
          lastTime: { $first: "$createdAt" },
        },
      },
    ]);

    const formatted = await Promise.all(
      chats.map(async (chat) => {
        const roomUsers = chat._id.split("-");
        const otherUserId = roomUsers.find((id) => id !== userId);

        const otherUser = await User.findById(otherUserId).select("fullName");

        const unreadCount = await Chat.countDocuments({
          room: chat._id,
          receiverId: userId,
          isRead: false,
        });

        return {
          room: chat._id,
          otherUser,
          lastMessage: chat.lastMessage,
          lastTime: chat.lastTime,
          unreadCount,
        };
      })
    );

    res.json(formatted);
  } catch (err) {
    console.error("Inbox fetch error:", err);
    res.status(500).json({ message: "Failed to fetch inbox" });
  }
};
