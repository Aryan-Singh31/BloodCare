import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL || '/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/auth/forgot-password`, { email });
      setSent(true);
      toast.success('Reset link sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>{sent ? '✅' : '🔐'}</div>
        <h2 className="auth-title">{sent ? 'Check Your Email' : 'Forgot Password?'}</h2>
        <p className="auth-subtitle">
          {sent ? `Reset link sent to ${email}` : "We'll send you a reset link"}
        </p>
        {!sent && (
          <form onSubmit={handleSubmit} style={{ marginTop: 28 }}>
            <div className="form-group">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                required placeholder="your@email.com" className="form-input" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
        <button onClick={() => navigate('/login')}
          style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', marginTop: 20, fontSize: 14 }}>
          ← Back to Login
        </button>
      </div>
    </div>
  );
}
