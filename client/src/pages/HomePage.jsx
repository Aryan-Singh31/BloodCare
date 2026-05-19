import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import AIChatbot from '../components/common/AIChatbot';
import { FiDroplet, FiSearch, FiAlertCircle, FiMessageCircle, FiBookOpen, FiClock, FiPhone, FiMapPin } from 'react-icons/fi';
import './HomePage.css';

const API = import.meta.env.VITE_API_URL || '/api';

const QUICK_ACTIONS = [
  { icon: <FiDroplet size={28} />, title: 'Become a Donor', desc: 'Register and help save lives', to: '/become-donor', color: '#e63946' },
  { icon: <FiSearch size={28} />, title: 'Find Donor', desc: 'Search by city & blood group', to: '/search-donor', color: '#8a6bff' },
  { icon: <FiAlertCircle size={28} />, title: 'Urgent Request', desc: 'Post critical blood need', to: '/urgent', color: '#f4a261' },
  { icon: <FiBookOpen size={28} />, title: 'Health Articles', desc: 'Tips & blood health advice', to: '/articles', color: '#2a9d8f' },
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function HomePage() {
  const { user } = useAuth();
  const [urgentRequests, setUrgentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ donors: 0, requests: 0, messages: 0 });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const city = user?.city || '';
      const [urgentRes, convsRes] = await Promise.all([
        axios.get(`${API}/urgent?city=${city}`),
        axios.get(`${API}/chat/conversations`),
      ]);
      setUrgentRequests(urgentRes.data);
      const unread = convsRes.data.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
      setStats(prev => ({ ...prev, messages: unread }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    const diff = (new Date() - new Date(date)) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="page">
      <Navbar />
      <div className="home-page">
        {/* Welcome Banner */}
        <div className="welcome-banner">
          <div className="welcome-content">
            <div className="welcome-text">
              <h1 className="welcome-title">
                Welcome back, <span>{user?.name?.split(' ')[0]}</span> 👋
              </h1>
              <p className="welcome-sub">
                {user?.isDonor
                  ? "You're registered as a donor. Thank you for saving lives! 🩸"
                  : "Register as a donor today and help save someone's life."}
              </p>
              {!user?.isDonor && (
                <Link to="/become-donor" className="btn btn-primary" style={{ marginTop: 16 }}>
                  🩸 Become a Donor
                </Link>
              )}
            </div>
            <div className="welcome-visual">
              {BLOOD_GROUPS.map((bg, i) => (
                <div key={bg} className="mini-blood" style={{ animationDelay: `${i * 0.2}s` }}>
                  {bg}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="home-content">
          {/* Quick Actions */}
          <section className="home-section">
            <h2 className="section-heading">Quick Actions</h2>
            <div className="quick-actions-grid">
              {QUICK_ACTIONS.map((action, i) => (
                <Link
                  key={i} to={action.to}
                  className="quick-action-card"
                  style={{ '--color': action.color, animationDelay: `${i * 0.1}s` }}
                >
                  <div className="qa-icon" style={{ background: `${action.color}1a`, color: action.color }}>
                    {action.icon}
                  </div>
                  <div className="qa-text">
                    <div className="qa-title">{action.title}</div>
                    <div className="qa-desc">{action.desc}</div>
                  </div>
                  <div className="qa-arrow">→</div>
                </Link>
              ))}
            </div>
          </section>

          {/* Urgent Requests */}
          <section className="home-section">
            <div className="section-header-row">
              <h2 className="section-heading">
                <FiAlertCircle color="var(--red)" /> Urgent Blood Requests
                {user?.city && <span className="city-tag">📍 {user.city}</span>}
              </h2>
              <Link to="/urgent" className="btn btn-outline btn-sm">Post Urgent →</Link>
            </div>

            {loading ? (
              <div className="skeleton-grid">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="skeleton-card" />
                ))}
              </div>
            ) : urgentRequests.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                <p>No urgent requests in your area right now.</p>
                <Link to="/urgent" className="btn btn-outline btn-sm" style={{ marginTop: 12 }}>
                  Post a Request
                </Link>
              </div>
            ) : (
              <div className="urgent-grid">
                {urgentRequests.map((req) => (
                  <div key={req._id} className="urgent-card">
                    <div className="urgent-card-top">
                      <div className="urgent-blood-badge">{req.bloodGroup}</div>
                      <div className="urgent-meta">
                        <span className="badge badge-red urgent-badge">
                          🚨 URGENT
                        </span>
                        <span className="urgent-time">
                          <FiClock size={12} /> {getTimeAgo(req.createdAt)}
                        </span>
                      </div>
                    </div>

                    <h3 className="urgent-patient">{req.patientName}</h3>

                    <div className="urgent-details">
                      <div className="urgent-detail">
                        <FiMapPin size={13} />
                        {req.hospital}, {req.city}
                      </div>
                      <div className="urgent-detail">
                        💉 {req.unitsNeeded} unit(s) needed
                      </div>
                      {req.message && (
                        <div className="urgent-detail urgent-msg">"{req.message}"</div>
                      )}
                    </div>

                    <div className="urgent-footer">
                      <div className="urgent-contact">
                        <div className="contact-avatar">{req.contactName?.[0]}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{req.contactName}</div>
                          <div style={{ fontSize: 12, color: 'var(--text2)' }}>{req.contactPhone}</div>
                        </div>
                      </div>
                      <a href={`tel:${req.contactPhone}`} className="btn btn-primary btn-sm">
                        <FiPhone size={13} /> Call
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* AI Chat Promo */}
          <section className="ai-promo-card">
            <div className="ai-promo-content">
              <div style={{ fontSize: 40 }}>🤖</div>
              <div>
                <h3>BloodCare AI Assistant</h3>
                <p>Ask about blood compatibility, donation eligibility, or health tips — available 24/7.</p>
              </div>
            </div>
            <div className="ai-promo-tag">Gemini Powered</div>
          </section>
        </div>
      </div>
      <AIChatbot />
    </div>
  );
}
