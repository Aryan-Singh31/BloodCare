// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import donorRoutes from "./routes/donorRoutes.js";
import Chat from "./models/Chat.js"; // NEW Import

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("BloodCare API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);

// Create HTTP server for socket.io
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Socket Logic: One-to-one chat
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Joining specific chat room
  socket.on("join-room", (room) => {
    socket.join(room);
  });

  // Private messaging handler
  socket.on("send-private-msg", async (data) => {
    const { room, sender, receiver, message } = data;

    // Save chat in DB
    await Chat.create({ room, sender, receiver, message });

    // Emit message to specific room only
    io.to(room).emit("receive-private-msg", data);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
