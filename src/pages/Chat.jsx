import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Chat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("receive-msg", (msg) => {
      setChat((prev) => [...prev, msg]);
    });
  }, []);

  function sendMessage() {
    socket.emit("send-msg", message);
    setChat([...chat, message]);
    setMessage("");
  }

  return (
    <div className="max-w-md mx-auto p-5">
      <div className="border rounded h-80 overflow-y-scroll p-3 bg-gray-100">
        {chat.map((msg, idx) => (
          <div key={idx} className="bg-white p-2 my-1 rounded shadow">
            {msg}
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <input
          className="border p-2 w-full rounded"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          placeholder="Type your message"
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
