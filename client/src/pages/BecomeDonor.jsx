import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../components/common/Navbar';
import AIChatbot from '../components/common/AIChatbot';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || '/api';
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function BecomeDonor() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [form, setForm] = useState({
    bloodGroup: '', age: '', weight: '',
    city: '', state: '', address: '',
    phone: '', lastDonationDate: '',
    medicalConditions: '', isAvailable: true,
  });

  useEffect(() => {
    fetchDonorProfile();
  }, []);

  const fetchDonorProfile = async () => {
    try {
      const { data } = await axios.get(`${API}/donors/me`);
      if (data) {
        setForm({
          bloodGroup: data.bloodGroup || '',
          age: data.age || '',
          weight: data.weight || '',
          city: data.city || '',
          state: data.state || '',
          address: data.address || '',
          phone: data.phone || '',
          lastDonationDate: data.lastDonationDate ? data.lastDonationDate.split('T')[0] : '',
          medicalConditions: data.medicalConditions || '',
          isAvailable: data.isAvailable !== false,
        });
      }
    } catch { } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/donors/register`, form);
      setUser(prev => ({ ...prev, isDonor: true, city: form.city }));
      toast.success(user?.isDonor ? 'Donor profile updated! 🩸' : 'You are now registered as a donor! 🩸');
      navigate('/home');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return (
    <div className="page">
      <Navbar />
      <div className="loader-fullscreen"><div className="pulse-loader" /></div>
    </div>
  );

  return (
    <div className="page">
      <Navbar />
      <div className="page-content" style={{ maxWidth: 720 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>🩸</div>
          <h1 style={{ fontSize: 36, marginBottom: 8 }}>
            {user?.isDonor ? 'Update Donor Profile' : 'Become a Donor'}
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: 16 }}>
            Your single donation can save up to 3 lives. Join India's largest blood donor network.
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            {/* Blood group selection */}
            <div className="form-group">
              <label className="form-label">Blood Group *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {BLOOD_GROUPS.map(bg => (
                  <button
                    key={bg} type="button"
                    onClick={() => setForm(prev => ({ ...prev, bloodGroup: bg }))}
                    style={{
                      padding: '14px 8px', borderRadius: 12,
                      border: `2px solid ${form.bloodGroup === bg ? 'var(--red)' : 'var(--border)'}`,
                      background: form.bloodGroup === bg ? 'rgba(230,57,70,0.1)' : 'var(--bg3)',
                      color: form.bloodGroup === bg ? 'var(--red)' : 'var(--text2)',
                      cursor: 'pointer', fontWeight: 800, fontSize: 16,
                      transition: 'all 0.2s',
                    }}
                  >{bg}</button>
                ))}
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Age *</label>
                <input type="number" name="age" value={form.age} onChange={handleChange}
                  required min={18} max={65} placeholder="18-65 years" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input type="number" name="weight" value={form.weight} onChange={handleChange}
                  min={50} placeholder="Min 50 kg" className="form-input" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                required placeholder="+91 XXXXX XXXXX" className="form-input" />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">City *</label>
                <input type="text" name="city" value={form.city} onChange={handleChange}
                  required placeholder="Your city" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">State *</label>
                <input type="text" name="state" value={form.state} onChange={handleChange}
                  required placeholder="Your state" className="form-input" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <input type="text" name="address" value={form.address} onChange={handleChange}
                placeholder="Street / Area (optional)" className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Last Donation Date</label>
              <input type="date" name="lastDonationDate" value={form.lastDonationDate}
                onChange={handleChange} className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Medical Conditions (if any)</label>
              <textarea name="medicalConditions" value={form.medicalConditions}
                onChange={handleChange} placeholder="List any relevant medical conditions..."
                className="form-input" rows={3} style={{ resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <input type="checkbox" id="available" name="isAvailable" checked={form.isAvailable}
                onChange={handleChange}
                style={{ width: 18, height: 18, accentColor: 'var(--red)', cursor: 'pointer' }} />
              <label htmlFor="available" style={{ cursor: 'pointer', fontSize: 15 }}>
                I am currently available to donate
              </label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px' }} disabled={loading || !form.bloodGroup}>
              {loading ? 'Registering...' : user?.isDonor ? '✓ Update Profile' : '🩸 Register as Donor'}
            </button>
          </form>
        </div>

        {/* Info cards */}
        <div className="grid-3" style={{ marginTop: 24 }}>
          {[
            { icon: '💉', text: 'Donate every 56 days safely' },
            { icon: '❤️', text: '1 donation saves up to 3 lives' },
            { icon: '🔒', text: 'Your data is kept private & secure' },
          ].map((item, i) => (
            <div key={i} className="card" style={{ textAlign: 'center', padding: 20 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
              <p style={{ fontSize: 13, color: 'var(--text2)' }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
      <AIChatbot />
    </div>
  );
}
