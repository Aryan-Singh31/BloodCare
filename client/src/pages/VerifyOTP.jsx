// VerifyOTP.js
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || '/api';

export function VerifyOTP() {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, email } = location.state || {};
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const refs = useRef([]);

  useEffect(() => {
    if (!userId) navigate('/register');
    refs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val.slice(-1);
    setOtp(newOtp);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) return toast.error('Enter 6-digit OTP');
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/verify-otp`, { userId, otp: code });
      login(data.user, data.token);
      toast.success('Email verified! Welcome to BloodCare! 🩸');
      navigate('/home');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      await axios.post(`${API}/auth/resend-otp`, { userId });
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
      toast.success('New OTP sent!');
    } catch {
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>📧</div>
        <h2 className="auth-title">Verify Your Email</h2>
        <p className="auth-subtitle">
          We sent a 6-digit code to<br />
          <strong style={{ color: 'var(--text)' }}>{email}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', margin: '32px 0' }}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => refs.current[i] = el}
                type="text" inputMode="numeric"
                value={digit} onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                maxLength={1}
                style={{
                  width: 52, height: 60, textAlign: 'center',
                  fontSize: 24, fontWeight: 700,
                  background: 'var(--bg3)',
                  border: `2px solid ${digit ? 'var(--red)' : 'var(--border)'}`,
                  borderRadius: 12, color: 'var(--text)', outline: 'none',
                  transition: 'border-color 0.2s',
                }}
              />
            ))}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Email ✓'}
          </button>
        </form>

        <div style={{ marginTop: 20, color: 'var(--text2)', fontSize: 14 }}>
          Didn't receive the code?{' '}
          {resendTimer > 0
            ? <span style={{ color: 'var(--text3)' }}>Resend in {resendTimer}s</span>
            : <button onClick={resendOTP} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontWeight: 600 }}>Resend OTP</button>
          }
        </div>
      </div>
    </div>
  );
}

export function ForgotPassword() {
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
      toast.success('Reset link sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error sending reset email');
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
          {sent
            ? `We sent a password reset link to ${email}`
            : "Enter your email and we'll send you a reset link"}
        </p>

        {!sent && (
          <form onSubmit={handleSubmit} style={{ marginTop: 28 }}>
            <div className="form-group">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="your@email.com" className="form-input" />
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

export function ResetPassword() {
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
        <p className="auth-subtitle">{done ? 'Redirecting to login...' : 'Choose a strong new password'}</p>

        {!done && (
          <form onSubmit={handleSubmit} style={{ marginTop: 28 }}>
            <div className="form-group">
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="New password" className="form-input" minLength={6} />
            </div>
            <div className="form-group">
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
                placeholder="Confirm password" className="form-input" />
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

export default VerifyOTP;
