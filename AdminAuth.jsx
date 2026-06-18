import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminAuth.css';

const API_BASE = 'http://localhost:3001/api';

export default function AdminAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState('auth'); // 'auth' or 'otp'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (isLogin) {
      // Login Flow
      if (!formData.email || !formData.password) {
        setError('Please enter your email and password.');
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/admin/signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Login failed.');
        }

        // Save session
        localStorage.setItem('adminToken', 'true');
        localStorage.setItem('adminUser', JSON.stringify(data.admin));
        
        navigate('/admin/dashboard');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Signup Initiate Flow
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('All fields are required.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (formData.password.length < 4) {
        setError('Password must be at least 4 characters long.');
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/admin/signup/initiate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Signup initiation failed.');
        }

        setMessage(
          data.previewUrl
            ? `${data.message} Preview link: ${data.previewUrl}`
            : data.message
        );
        setStep('otp');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!formData.otp || formData.otp.length !== 6) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/signup/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'OTP verification failed.');
      }

      // Save session
      localStorage.setItem('adminToken', 'true');
      localStorage.setItem('adminUser', JSON.stringify(data.admin));

      setMessage('Email verified! Redirecting...');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="brand-icon">⚡</span>
          <h2>Admin Console</h2>
          <p>Watch Store Administration Panel</p>
        </div>

        {error && <div className="auth-alert error">{error}</div>}
        {message && <div className="auth-alert success">{message}</div>}

        {step === 'auth' ? (
          <>
            <div className="auth-tabs">
              <button
                className={`auth-tab-btn ${isLogin ? 'active' : ''}`}
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                  setMessage('');
                }}
              >
                Sign In
              </button>
              <button
                className={`auth-tab-btn ${!isLogin ? 'active' : ''}`}
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                  setMessage('');
                }}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="auth-form">
              {!isLogin && (
                <div className="auth-form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="auth-form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="admin@watchstore.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {!isLogin && (
                <div className="auth-form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? (
                  <span className="spinner"></span>
                ) : isLogin ? (
                  'Sign In to Dashboard'
                ) : (
                  'Send Verification OTP'
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="otp-step">
            <p className="otp-instructions">
              We have sent a 6-digit verification code to <strong>{formData.email}</strong>.
              Please check your inbox (or terminal logs) and enter it below.
            </p>

            <form onSubmit={handleOTPSubmit} className="auth-form">
              <div className="auth-form-group">
                <label htmlFor="otp">One-Time Password</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  placeholder="123456"
                  maxLength="6"
                  className="otp-input"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? <span className="spinner"></span> : 'Verify & Log In'}
              </button>

              <button
                type="button"
                className="back-btn"
                onClick={() => {
                  setStep('auth');
                  setError('');
                }}
              >
                ← Back to registration
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
