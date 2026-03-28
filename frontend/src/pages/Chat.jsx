import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import API from "../api";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Send, ArrowLeft, HeartPulse } from "lucide-react";

const socket = io("http://localhost:5000");

// SVG background pattern — subtle blood drop / cross motif
const BgPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="chat-bg" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        {/* small cross */}
        <rect x="27" y="20" width="6" height="20" rx="2" fill="#dc2626"/>
        <rect x="20" y="27" width="20" height="6" rx="2" fill="#dc2626"/>
        {/* dot */}
        <circle cx="10" cy="10" r="2" fill="#dc2626"/>
        <circle cx="50" cy="50" r="2" fill="#dc2626"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#chat-bg)"/>
  </svg>
);

export default function Chat() {
  const { id: receiverId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [receiver, setReceiver] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const room = [user._id, receiverId].sort().join("-");

  const scroll = () => bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const load = async () => {
      try {
        const [resUser, resChat] = await Promise.all([
          API.get(`/user/${receiverId}`),
          API.get(`/chat/room/${room}`),
        ]);
        setReceiver(resUser.data);
        const msgs = resChat.data.map((msg) => {
          if (msg.receiverId === user._id) { API.put(`/chat/read/${msg._id}`); msg.isRead = true; }
          return msg;
        });
        setChat(msgs);
        socket.emit("join-room", room);
        setTimeout(scroll, 100);
      } catch (e) { console.error(e); }
    };
    load();
    socket.on("receive-private-msg", (msg) => {
      setChat((prev) => [...prev, msg]);
      if (msg.receiverId === user._id) API.put(`/chat/read/${msg._id}`).catch(() => {});
      setTimeout(scroll, 50);
    });
    return () => socket.off("receive-private-msg");
  }, [room]);

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit("send-private-msg", { room, senderId: user._id, receiverId, message });
    setMessage("");
    inputRef.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const fmt = (t) => t ? new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
  const getInitial = (name) => name?.charAt(0).toUpperCase() || "?";

  const grouped = chat.reduce((acc, msg) => {
    const day = msg.createdAt ? new Date(msg.createdAt).toDateString() : "Unknown";
    if (!acc[day]) acc[day] = [];
    acc[day].push(msg);
    return acc;
  }, {});

  const dayLabel = (dateStr) => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (dateStr === today) return "Today";
    if (dateStr === yesterday) return "Yesterday";
    return new Date(dateStr).toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-0 md:p-4">
      <div className="flex flex-col w-full max-w-xl h-[calc(100vh-64px)] md:h-[82vh] bg-white md:rounded-2xl md:shadow-2xl overflow-hidden md:border md:border-gray-200">

        {/* ── Header ── */}
        <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shrink-0">
          <button onClick={() => navigate("/messages")}
            className="p-1.5 rounded-full hover:bg-white/20 transition">
            <ArrowLeft size={18} />
          </button>
          <div className="w-9 h-9 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center font-bold text-sm shrink-0">
            {getInitial(receiver?.fullName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm leading-tight truncate">{receiver?.fullName || "Loading..."}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
              <span className="text-[11px] text-red-100">Active now</span>
            </div>
          </div>
          <HeartPulse size={18} className="opacity-50 shrink-0" />
        </div>

        {/* ── Messages area with pattern bg ── */}
        <div className="relative flex-1 overflow-hidden">
          {/* decorative background */}
          <div className="absolute inset-0 bg-gradient-to-b from-red-50/60 via-white to-rose-50/40" />
          <BgPattern />
          {/* soft corner blobs */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-red-100 rounded-full opacity-30 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-100 rounded-full opacity-30 blur-3xl pointer-events-none" />

          <div className="relative h-full overflow-y-auto px-3 py-3 space-y-0.5">
            {chat.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-2xl shadow-sm">💬</div>
                <p className="text-sm font-medium text-gray-500">No messages yet</p>
                <p className="text-xs text-gray-400">Say hello to {receiver?.fullName?.split(" ")[0] || "them"}!</p>
              </div>
            )}

            {Object.entries(grouped).map(([day, msgs]) => (
              <div key={day}>
                <div className="flex items-center gap-2 my-3">
                  <div className="flex-1 h-px bg-gray-200/70" />
                  <span className="text-[10px] text-gray-400 font-medium px-2.5 py-0.5 bg-white/80 rounded-full border border-gray-200 shadow-sm backdrop-blur-sm">
                    {dayLabel(day)}
                  </span>
                  <div className="flex-1 h-px bg-gray-200/70" />
                </div>

                {msgs.map((msg, i) => {
                  const isMine = msg.senderId === user._id;
                  const prevSame = i > 0 && msgs[i - 1].senderId === msg.senderId;
                  return (
                    <div key={msg._id || i} className={`flex ${isMine ? "justify-end" : "justify-start"} ${prevSame ? "mt-0.5" : "mt-2.5"}`}>
                      {!isMine && !prevSame && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center text-[10px] font-bold mr-1.5 mt-auto shrink-0 shadow-sm">
                          {getInitial(receiver?.fullName)}
                        </div>
                      )}
                      {!isMine && prevSame && <div className="w-6 mr-1.5 shrink-0" />}

                      <div className="max-w-[68%]">
                        <div className={`px-3.5 py-2 text-sm leading-relaxed break-words shadow-sm ${
                          isMine
                            ? "bg-gradient-to-br from-red-600 to-rose-600 text-white rounded-2xl rounded-br-sm"
                            : "bg-white/90 backdrop-blur-sm text-gray-800 border border-gray-100 rounded-2xl rounded-bl-sm"
                        }`}>
                          {msg.message}
                        </div>
                        <p className={`text-[10px] mt-0.5 px-1 text-gray-400 ${isMine ? "text-right" : ""}`}>
                          {fmt(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* ── Input ── */}
        <div className="px-3 py-2.5 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0">
          <input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKey}
            placeholder={`Message ${receiver?.fullName?.split(" ")[0] || ""}...`}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim()}
            className="w-9 h-9 bg-gradient-to-br from-red-600 to-rose-600 text-white rounded-full flex items-center justify-center hover:from-red-700 hover:to-rose-700 transition disabled:opacity-40 shadow-md shrink-0"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
