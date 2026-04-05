import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  try {
    const notifs = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 }).limit(30);
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

export const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    res.json({ message: "All marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update" });
  }
};

export const markOneRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update" });
  }
};
