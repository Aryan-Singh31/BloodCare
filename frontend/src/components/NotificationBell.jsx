import { useState, useEffect, useRef } from "react";
import { Bell, X, Check, Droplets, MessageCircle, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext";

export default function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const ref = useRef(null);

  const unread = notifs.filter((n) => !n.isRead).length;

  const fetch_ = () =>
    API.get("/notifications").then((r) => setNotifs(r.data)).catch(() => {});

  useEffect(() => {
    if (!user) return;
    fetch_();
    const t = setInterval(fetch_, 20000);
    return () => clearInterval(t);
  }, [user]);

  // close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAll = async () => {
    await API.put("/notifications/read-all");
    setNotifs((p) => p.map((n) => ({ ...n, isRead: true })));
  };

  const markOne = async (id, link) => {
    await API.put(`/notifications/${id}/read`);
    setNotifs((p) => p.map((n) => n._id === id ? { ...n, isRead: true } : n));
    setOpen(false);
    if (link) navigate(link);
  };

  const icon = (type) => {
    if (type === "blood_request") return <Droplets size={14} className="text-red-500" />;
    if (type === "message") return <MessageCircle size={14} className="text-blue-500" />;
    return <Info size={14} className="text-gray-400" />;
  };

  const timeAgo = (date) => {
    const s = Math.floor((Date.now() - new Date(date)) / 1000);
    if (s < 60) return "just now";
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  };

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-500 hover:text-red-600 transition rounded-full hover:bg-red-50">
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          {/* header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-red-600 to-rose-600">
            <span className="text-white font-semibold text-sm">Notifications</span>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button onClick={markAll} className="text-red-100 hover:text-white text-xs flex items-center gap-1">
                  <Check size={12} /> Mark all read
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-red-100 hover:text-white">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* list */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {notifs.length === 0 && (
              <div className="py-10 text-center text-gray-400 text-sm">
                <Bell size={28} className="mx-auto mb-2 opacity-30" />
                No notifications yet
              </div>
            )}
            {notifs.map((n) => (
              <button key={n._id} onClick={() => markOne(n._id, n.link)}
                className={`w-full text-left px-4 py-3 hover:bg-red-50/60 transition flex gap-3 items-start ${!n.isRead ? "bg-red-50/40" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${!n.isRead ? "bg-red-100" : "bg-gray-100"}`}>
                  {icon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs leading-snug ${!n.isRead ? "font-semibold text-gray-900" : "text-gray-600"}`}>{n.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5 truncate">{n.body}</p>
                  <p className="text-[10px] text-gray-300 mt-1">{timeAgo(n.createdAt)}</p>
                </div>
                {!n.isRead && <span className="w-2 h-2 bg-red-500 rounded-full shrink-0 mt-1.5" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
