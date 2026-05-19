import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../components/common/Navbar';
import AIChatbot from '../components/common/AIChatbot';
import { useAuth } from '../context/AuthContext';
import { FiAlertCircle, FiMapPin, FiPhone, FiClock, FiPlus, FiX } from 'react-icons/fi';
import './UrgentRequests.css';

const API = import.meta.env.VITE_API_URL || '/api';
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const EMPTY_FORM = {
  patientName: '', bloodGroup: '', unitsNeeded: 1,
  hospital: '', city: '', state: '',
  contactName: '', contactPhone: '', message: '',
};

export default function UrgentRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [cityFilter, setCityFilter] = useState(user?.city || '');

  useEffect(() => { fetchRequests(); }, [cityFilter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/urgent?city=${cityFilter}`);
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await axios.post(`${API}/urgent`, form);
      setRequests(prev => [data, ...prev]);
      setShowModal(false);
      setForm(EMPTY_FORM);
      toast.success('Urgent request posted! 🚨');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFulfill = async (id) => {
    try {
      await axios.patch(`${API}/urgent/${id}/fulfill`);
      setRequests(prev => prev.filter(r => r._id !== id));
      toast.success('Marked as fulfilled!');
    } catch {
      toast.error('Could not update request');
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
      <div className="page-content">
        {/* Header */}
        <div className="urgent-page-header">
          <div>
            <h1><FiAlertCircle color="var(--red)" /> Urgent Blood Requests</h1>
            <p>City-wide alerts for critical blood needs. Every second counts.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FiPlus /> Post Urgent Request
          </button>
        </div>

        {/* City filter */}
        <div className="urgent-filter card" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FiMapPin color="var(--red)" size={18} />
            <input
              type="text" value={cityFilter}
              onChange={e => setCityFilter(e.target.value)}
              placeholder="Filter by city (leave blank for all cities)"
              className="form-input" style={{ maxWidth: 360 }}
            />
            <button className="btn btn-outline btn-sm" onClick={fetchRequests}>Apply</button>
          </div>
        </div>

        {/* Requests grid */}
        {loading ? (
          <div className="urgent-grid-page">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-card" style={{ height: 280 }} />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 56 }}>✅</div>
            <h3 style={{ marginTop: 12, marginBottom: 8 }}>No urgent requests</h3>
            <p style={{ color: 'var(--text2)' }}>
              {cityFilter ? `No urgent requests in ${cityFilter} right now.` : 'No urgent requests at the moment.'}
            </p>
            <button className="btn btn-primary btn-sm" style={{ marginTop: 16 }} onClick={() => setShowModal(true)}>
              Post a Request
            </button>
          </div>
        ) : (
          <div className="urgent-grid-page">
            {requests.map((req, i) => (
              <div key={req._id} className="urgent-full-card animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                {/* Top bar */}
                <div className="ufc-top">
                  <div className="ufc-blood">{req.bloodGroup}</div>
                  <div className="ufc-badges">
                    <span className="badge badge-red">🚨 URGENT</span>
                    <span className="ufc-time"><FiClock size={12} /> {getTimeAgo(req.createdAt)}</span>
                  </div>
                </div>

                <h3 className="ufc-patient">{req.patientName}</h3>

                <div className="ufc-details">
                  <div className="ufc-detail"><FiMapPin size={14} /> {req.hospital}</div>
                  <div className="ufc-detail"><FiMapPin size={14} /> {req.city}, {req.state}</div>
                  <div className="ufc-detail">💉 {req.unitsNeeded} unit(s) of <strong>{req.bloodGroup}</strong> needed</div>
                  {req.message && (
                    <div className="ufc-message">"{req.message}"</div>
                  )}
                </div>

                <div className="ufc-divider" />

                <div className="ufc-footer">
                  <div className="ufc-contact">
                    <div className="ufc-avatar">{req.contactName?.[0]}</div>
                    <div>
                      <div className="ufc-cname">{req.contactName}</div>
                      <div className="ufc-cphone">{req.contactPhone}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <a href={`tel:${req.contactPhone}`} className="btn btn-primary btn-sm">
                      <FiPhone size={13} /> Call Now
                    </a>
                    {req.user?._id === user?._id && (
                      <button className="btn btn-outline btn-sm" onClick={() => handleFulfill(req._id)}>
                        ✓ Fulfilled
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Request Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div className="modal-header">
              <h2>🚨 Post Urgent Request</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Patient Name *</label>
                  <input type="text" name="patientName" value={form.patientName}
                    onChange={handleChange} required placeholder="Patient's name" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Units Needed *</label>
                  <input type="number" name="unitsNeeded" value={form.unitsNeeded}
                    onChange={handleChange} required min={1} max={10} className="form-input" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Blood Group *</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {BLOOD_GROUPS.map(bg => (
                    <button key={bg} type="button"
                      onClick={() => setForm(prev => ({ ...prev, bloodGroup: bg }))}
                      style={{
                        padding: '8px 14px', borderRadius: 50, fontWeight: 700,
                        border: `2px solid ${form.bloodGroup === bg ? 'var(--red)' : 'var(--border)'}`,
                        background: form.bloodGroup === bg ? 'rgba(230,57,70,0.1)' : 'var(--bg3)',
                        color: form.bloodGroup === bg ? 'var(--red)' : 'var(--text2)',
                        cursor: 'pointer', transition: 'all 0.2s',
                        fontFamily: 'DM Sans, sans-serif',
                      }}
                    >{bg}</button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Hospital / Clinic *</label>
                <input type="text" name="hospital" value={form.hospital}
                  onChange={handleChange} required placeholder="Hospital name" className="form-input" />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input type="text" name="city" value={form.city}
                    onChange={handleChange} required placeholder="City" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">State *</label>
                  <input type="text" name="state" value={form.state}
                    onChange={handleChange} required placeholder="State" className="form-input" />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Contact Name *</label>
                  <input type="text" name="contactName" value={form.contactName}
                    onChange={handleChange} required placeholder="Your name" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Phone *</label>
                  <input type="tel" name="contactPhone" value={form.contactPhone}
                    onChange={handleChange} required placeholder="+91 XXXXX XXXXX" className="form-input" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Additional Message</label>
                <textarea name="message" value={form.message}
                  onChange={handleChange} placeholder="Any additional info (optional)"
                  className="form-input" rows={2} style={{ resize: 'vertical' }} />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}
                disabled={submitting || !form.bloodGroup}>
                {submitting ? 'Posting...' : '🚨 Post Urgent Request'}
              </button>
            </form>
          </div>
        </div>
      )}

      <AIChatbot />
    </div>
  );
}
