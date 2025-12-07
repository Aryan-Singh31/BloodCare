import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Inbox() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inbox, setInbox] = useState([]);

  useEffect(() => {
    const loadInbox = async () => {
      const res = await API.get(`/chat/inbox/${user._id}`);
      setInbox(res.data);
    };
    loadInbox();
  }, [user]);

  const getInitial = (name) =>
    name ? name.charAt(0).toUpperCase() : "?";

  const formatTime = (time) =>
    new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-[80vh] max-w-lg mx-auto px-4 pt-10 pb-20 flex flex-col">
      
      <h2 className="text-3xl font-bold mb-5 text-red-600 text-center">
        Messages
      </h2>

      {inbox.length === 0 && (
        <p className="text-gray-600 text-center mt-10">
          No conversations yet.
        </p>
      )}

      <div className="space-y-4">
        {inbox.map((conv) => (
          <div
            key={conv.room}
            onClick={() => navigate(`/chat/${conv.otherUser._id}`)}
            className="bg-white shadow-md rounded-xl p-4 flex justify-between items-center cursor-pointer hover:shadow-lg transition"
          >
            {/* Left content */}
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-12 h-12 bg-red-600 text-white flex items-center justify-center rounded-full text-lg font-bold">
                {getInitial(conv.otherUser.fullName)}
              </div>

              <div>
                <p className="font-semibold text-gray-800">
                  {conv.otherUser.fullName}
                </p>
                <p className="text-sm text-gray-500 truncate max-w-[180px]">
                  {conv.lastMessage || "No messages yet"}
                </p>
              </div>
            </div>

            {/* Right side - unread + time */}
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-gray-500">
                {conv.lastTime ? formatTime(conv.lastTime) : ""}
              </span>

              {conv.unreadCount > 0 && (
                <span className="text-xs bg-red-600 text-white rounded-full px-2 py-0.5">
                  {conv.unreadCount}
                </span>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
