import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    room: String,
    sender: String,
    receiver: String,
    message: String,
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
