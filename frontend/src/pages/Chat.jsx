// src/pages/Chat.jsx
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import API from "../api";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const socket = io("http://localhost:5000");

export default function Chat() {
  const { id: receiverId } = useParams();
  const { user } = useAuth();

  const [receiver, setReceiver] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatBoxRef = useRef(null);

  const room = [user._id, receiverId].sort().join("-");

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const loadChat = async () => {
      try {
        // Fetch receiver
        const resUser = await API.get(`/user/${receiverId}`);
        setReceiver(resUser.data);

        // Load old messages
        const resChat = await API.get(`/chat/room/${room}`);
        const updated = resChat.data.map((msg) => {
  if (msg.receiverId === user._id) {
    API.put(`/chat/read/${msg._id}`);
    msg.isRead = true;
  }
  return msg;
});
setChat(updated);


        socket.emit("join-room", room);
        scrollToBottom();
      } catch (e) {
        console.error("Chat load error:", e);
      }
    };

    loadChat();

    // Real-time listener
    socket.on("receive-private-msg", (msg) => {
      setChat((prev) => [...prev, msg]);

      // Mark as read instantly
      if (msg.receiverId === user._id) {
        API.put(`/chat/read/${msg._id}`).catch(() => {});
      }

      scrollToBottom();
    });

    return () => socket.off("receive-private-msg");
  }, [room]);

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit("send-private-msg", {
      room,
      senderId: user._id,
      receiverId,
      message,
    });
    setMessage("");
  };

  return (
    <div className="flex flex-col max-w-3xl mx-auto py-10 px-4">
      <h2 className="text-xl font-bold text-center text-red-600 mb-4">
        Chat with {receiver?.fullName || "Loading..."}
      </h2>

      <div
        ref={chatBoxRef}
        className="border rounded p-4 h-80 overflow-y-auto bg-gray-50 shadow-inner flex flex-col"
      >
        {chat.map((msg) => (
          <div
            key={msg._id}
            className={`p-2 my-1 rounded text-white max-w-xs break-words ${
              msg.senderId === user._id
                ? "bg-red-600 self-end"
                : "bg-gray-700 self-start"
            }`}
          >
            {msg.message}
            <div className="text-xs opacity-70">
              {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ""}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
