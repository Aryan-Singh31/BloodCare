// backend/server.js
import dotenv from "dotenv";
dotenv.config(); // must be first before any other imports read process.env

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import donorRoutes from "./routes/donorRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bloodRequestRoutes from "./routes/bloodRequestRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import Chat from "./models/Chat.js";

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.get("/", (req, res) => res.send("BloodCare API running"));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/requests", bloodRequestRoutes);
app.use("/api/notifications", notificationRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// SOCKET LOGIC
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-room", (room) => socket.join(room));

  socket.on("send-private-msg", async (data) => {
    try {
      const chat = await Chat.create(data);

      io.to(data.room).emit("receive-private-msg", {
        ...data,
        _id: chat._id,
        createdAt: chat.createdAt,
      });
    } catch (error) {
      console.error("Chat DB error:", error);
    }
  });

  socket.on("disconnect", () =>
    console.log("Socket disconnected:", socket.id)
  );
});

server.listen(5000, () =>
  console.log(`Server running on http://localhost:5000`)
);
