import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    room: String,
    senderId: String,
    receiverId: String,
    message: String,
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
