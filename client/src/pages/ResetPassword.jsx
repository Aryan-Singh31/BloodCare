import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL || '/api';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await axios.post(`${API}/auth/reset-password/${token}`, { password });
      setDone(true);
      toast.success('Password reset successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>{done ? '✅' : '🔑'}</div>
        <h2 className="auth-title">{done ? 'All Done!' : 'Set New Password'}</h2>
        <p className="auth-subtitle">{done ? 'Redirecting to login...' : 'Choose a strong password'}</p>
        {!done && (
          <form onSubmit={handleSubmit} style={{ marginTop: 28 }}>
            <div className="form-group">
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                required placeholder="New password" className="form-input" minLength={6} />
            </div>
            <div className="form-group">
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                required placeholder="Confirm new password" className="form-input" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
