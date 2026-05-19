import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
  FiDroplet, FiHome, FiSearch, FiAlertCircle,
  FiMessageCircle, FiBookOpen, FiUser, FiLogOut,
  FiMenu, FiX, FiChevronDown
} from 'react-icons/fi';
import './Navbar.css';

const API = import.meta.env.VITE_API_URL || '/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const profileRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchUnread = async () => {
      try {
        const { data } = await axios.get(`${API}/chat/conversations`);
        const total = data.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
        setUnreadCount(total);
      } catch {}
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/home', icon: <FiHome />, label: 'Home' },
    { to: '/search-donor', icon: <FiSearch />, label: 'Find Donor' },
    { to: '/urgent', icon: <FiAlertCircle />, label: 'Urgent' },
    { to: '/articles', icon: <FiBookOpen />, label: 'Articles' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/home" className="navbar-logo">
          <span className="logo-icon">💉</span>
          <span>Blood<span className="logo-accent">Care</span></span>
        </Link>

        {/* Desktop nav */}
        <div className="navbar-links">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${isActive(link.to) ? 'active' : ''}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="navbar-actions">
          {/* Chat icon */}
          <Link to="/chat" className={`nav-icon-btn ${isActive('/chat') ? 'active' : ''}`} title="Messages" style={{ position: 'relative' }}>
            <FiMessageCircle size={20} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: 'var(--red)', color: '#fff',
                borderRadius: '50%', fontSize: 10, fontWeight: 700,
                width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </Link>

          {/* Become Donor */}
          {!user?.isDonor && (
            <Link to="/become-donor" className="btn btn-primary btn-sm">
              Become Donor
            </Link>
          )}

          {/* Profile dropdown */}
          <div className="profile-wrap" ref={profileRef}>
            <button className="profile-btn" onClick={() => setProfileOpen(!profileOpen)}>
              <div className="avatar">
                {user?.avatar
                  ? <img src={user.avatar} alt={user.name} />
                  : <span>{user?.name?.[0]?.toUpperCase()}</span>}
              </div>
              <FiChevronDown size={14} className={`chevron ${profileOpen ? 'open' : ''}`} />
            </button>

            {profileOpen && (
              <div className="profile-dropdown">
                <div className="profile-header">
                  <div className="avatar-lg">
                    {user?.avatar
                      ? <img src={user.avatar} alt={user.name} />
                      : <span>{user?.name?.[0]?.toUpperCase()}</span>}
                  </div>
                  <div>
                    <div className="profile-name">{user?.name}</div>
                    <div className="profile-email">{user?.email}</div>
                    {user?.isDonor && <span className="badge badge-green" style={{ marginTop: 4 }}>✓ Donor</span>}
                  </div>
                </div>
                <div className="dropdown-divider" />
                <Link to="/become-donor" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                  <FiDroplet /> {user?.isDonor ? 'Update Donor Profile' : 'Become a Donor'}
                </Link>
                <Link to="/chat" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                  <FiMessageCircle /> Messages
                </Link>
                <div className="dropdown-divider" />
                <button className="dropdown-item danger" onClick={handleLogout}>
                  <FiLogOut /> Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`mobile-nav-link ${isActive(link.to) ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.icon} {link.label}
            </Link>
          ))}
          <Link to="/chat" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
            <FiMessageCircle /> Messages
          </Link>
          <button className="mobile-nav-link danger" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
