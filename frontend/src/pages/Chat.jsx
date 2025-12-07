import { useEffect, useState } from "react";
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

  const room = [user._id, receiverId].sort().join("-");

  useEffect(() => {
    socket.emit("join-room", room);

    socket.on("receive-private-msg", (msg) => {
      setChat(prev => [...prev, msg]);
    });

    return () => socket.off("receive-private-msg");
  }, [room]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      room,
      sender: user.fullName,
      receiver: receiver?.fullName,
      message,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send-private-msg", msgData);
    setChat(prev => [...prev, msgData]);
    setMessage("");
  };

  return (
    <div className="flex flex-col max-w-3xl mx-auto py-10 px-4">
      <h2 className="text-xl font-bold text-center text-red-600 mb-4">
        Chat with Donor
      </h2>

      <div className="border rounded p-4 h-80 overflow-y-auto bg-gray-50 shadow-inner">
        {chat.map((msg, i) => (
          <div key={i} className={`p-2 my-1 rounded text-white ${
            msg.sender === user.fullName ? "bg-red-600 self-end" : "bg-gray-700 self-start"
          }`}>
            <strong>{msg.sender}</strong>: {msg.message}
            <div className="text-xs text-right">{msg.time}</div>
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
