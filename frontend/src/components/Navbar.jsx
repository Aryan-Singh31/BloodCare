import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, HeartPulse, MessageCircle, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../api";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [unread, setUnread] = useState(0);

  // Poll unread count every 15s when logged in
  useEffect(() => {
    if (!user) { setUnread(0); return; }

    const fetch = () =>
      API.get(`/chat/inbox/${user._id}`)
        .then((res) => {
          const total = res.data.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
          setUnread(total);
        })
        .catch(() => {});

    fetch();
    const interval = setInterval(fetch, 15000);
    return () => clearInterval(interval);
  }, [user, pathname]); // re-fetch when navigating (e.g. coming back from chat)

  const navLink = (to, label) => (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className={`text-sm font-medium transition-colors ${
        pathname === to ? "text-red-600" : "text-gray-600 hover:text-red-600"
      }`}
    >
      {label}
    </Link>
  );

  const MsgIcon = () => (
    <Link to="/messages" onClick={() => setOpen(false)}
      className="relative text-gray-500 hover:text-red-600 transition" title="Messages">
      <MessageCircle size={20} />
      {unread > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 shadow">
          {unread > 99 ? "99+" : unread}
        </span>
      )}
    </Link>
  );

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 group">
          <HeartPulse className="text-red-600 group-hover:scale-110 transition-transform" size={24} />
          <span className="text-xl font-extrabold text-red-600 tracking-tight">BloodCare</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navLink("/", "Home")}
          {navLink("/search", "Search")}
          {navLink("/requests", "Blood Requests")}
          {navLink("/aboutus", "About Us")}

          <Link to="/donate"
            className="bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-red-700 transition shadow-sm">
            Donate Blood
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <MsgIcon />
              <div className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                <User size={15} className="text-red-600" />
                <span className="text-sm font-semibold text-red-700">{user.fullName?.split(" ")[0]}</span>
              </div>
              <button onClick={logout} title="Logout"
                className="text-gray-400 hover:text-red-600 transition">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-red-600 transition">Sign In</Link>
              <Link to="/register"
                className="text-sm font-semibold border border-red-600 text-red-600 px-4 py-1.5 rounded-full hover:bg-red-600 hover:text-white transition">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-gray-600 hover:text-red-600 transition" onClick={() => setOpen(!open)}>
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3 shadow-lg">
          {navLink("/", "Home")}
          {navLink("/search", "Search")}
          {navLink("/requests", "Blood Requests")}
          {navLink("/aboutus", "About Us")}
          <Link to="/donate" onClick={() => setOpen(false)}
            className="block bg-red-600 text-white text-sm font-semibold px-4 py-2.5 rounded-full text-center hover:bg-red-700 transition">
            Donate Blood
          </Link>
          {user ? (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MsgIcon />
                <Link to="/messages" onClick={() => setOpen(false)} className="hover:text-red-600">
                  Messages
                  {unread > 0 && (
                    <span className="ml-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {unread}
                    </span>
                  )}
                </Link>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-sm font-semibold text-red-700">{user.fullName}</span>
                <button onClick={() => { logout(); setOpen(false); }} className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-1">
                  <LogOut size={15} /> Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <Link to="/login" onClick={() => setOpen(false)} className="flex-1 text-center text-sm font-medium border border-gray-300 py-2 rounded-full hover:border-red-600 hover:text-red-600 transition">Sign In</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="flex-1 text-center text-sm font-semibold bg-red-600 text-white py-2 rounded-full hover:bg-red-700 transition">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
