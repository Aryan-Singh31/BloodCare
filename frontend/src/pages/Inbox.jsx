import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MessageCircle, HeartPulse, ChevronRight } from "lucide-react";

export default function Inbox() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/chat/inbox/${user._id}`)
      .then((res) => setInbox(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const getInitial = (name) => name?.charAt(0).toUpperCase() || "?";

  const formatTime = (time) => {
    if (!time) return "";
    const d = new Date(time);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    return isToday
      ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const totalUnread = inbox.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-600 px-4 pt-10 pb-16 text-white">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <HeartPulse size={22} />
            <span className="text-sm font-medium opacity-80">BloodCare</span>
          </div>
          <h1 className="text-3xl font-extrabold">Messages</h1>
          {totalUnread > 0 && (
            <p className="text-red-100 text-sm mt-1">{totalUnread} unread message{totalUnread > 1 ? "s" : ""}</p>
          )}
        </div>
      </div>

      {/* Card list pulled up over header */}
      <div className="max-w-lg mx-auto px-4 -mt-8 pb-16">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

          {loading && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-3" />
              <p className="text-sm">Loading conversations...</p>
            </div>
          )}

          {!loading && inbox.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                <MessageCircle size={28} className="text-red-300" />
              </div>
              <p className="font-medium text-gray-500">No conversations yet</p>
              <p className="text-sm text-gray-400">Find a donor and start chatting</p>
            </div>
          )}

          {!loading && inbox.map((conv, i) => (
            <div key={conv.room}>
              <button
                onClick={() => navigate(`/chat/${conv.otherUser._id}`)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-50/60 transition-colors text-left group"
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center text-lg font-bold shadow-sm">
                    {getInitial(conv.otherUser?.fullName)}
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-600 rounded-full border-2 border-white" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <p className={`text-sm font-semibold truncate ${conv.unreadCount > 0 ? "text-gray-900" : "text-gray-700"}`}>
                      {conv.otherUser?.fullName || "Unknown"}
                    </p>
                    <span className="text-xs text-gray-400 shrink-0 ml-2">{formatTime(conv.lastTime)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs truncate ${conv.unreadCount > 0 ? "text-gray-700 font-medium" : "text-gray-400"}`}>
                      {conv.lastMessage || "No messages yet"}
                    </p>
                    {conv.unreadCount > 0 ? (
                      <span className="shrink-0 min-w-[20px] h-5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1.5">
                        {conv.unreadCount}
                      </span>
                    ) : (
                      <ChevronRight size={14} className="text-gray-300 shrink-0 group-hover:text-red-400 transition-colors" />
                    )}
                  </div>
                </div>
              </button>
              {i < inbox.length - 1 && <div className="h-px bg-gray-50 mx-5" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
