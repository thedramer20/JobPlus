// src/pages/Auth/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Github, Chrome } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Validate form
      const newErrors = {};
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.password) newErrors.password = 'Password is required';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setLoading(false);
        return;
      }

      // Mock login - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate successful login
      localStorage.setItem('jp_token', 'mock-jwt-token');
      setUser({
        name: 'Demo User',
        email: formData.email,
        role: 'JOB_SEEKER',
        username: formData.email.split('@')[0],
      });
      navigate('/jobs');

    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Mock social login
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="auth-page">
      {/* LEFT PANEL */}
      <div className="auth__left">
        <div className="auth__left-content">
          <div className="auth__logo">
            <img src="/branding/logo.svg" alt="JobPlus" />
          </div>

          <div className="auth__hero">
            <h1>Welcome Back</h1>
            <p>Continue your journey to finding the perfect career match.</p>
          </div>

          <div className="auth__features">
            <div className="auth__feature">
              <div className="auth__feature-icon">🎯</div>
              <div>
                <h3>AI-Powered Matching</h3>
                <p>Get matched with jobs that fit your skills and preferences.</p>
              </div>
            </div>

            <div className="auth__feature">
              <div className="auth__feature-icon">⚡</div>
              <div>
                <h3>Apply in Seconds</h3>
                <p>Smart forms and AI-generated cover letters save you time.</p>
              </div>
            </div>

            <div className="auth__feature">
              <div className="auth__feature-icon">📊</div>
              <div>
                <h3>Track Your Progress</h3>
                <p>Monitor applications and get insights on your job search.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth__right">
        <div className="auth__form-container">
          <div className="auth__header">
            <h2>Sign In</h2>
            <p>Enter your credentials to access your account</p>
          </div>

          {/* SOCIAL LOGIN */}
          <div className="auth__social">
            <button
              type="button"
              className="auth__social-btn auth__social-btn--google"
              onClick={() => handleSocialLogin('google')}
            >
              <Chrome size={18} />
              Continue with Google
            </button>
            <button
              type="button"
              className="auth__social-btn auth__social-btn--github"
              onClick={() => handleSocialLogin('github')}
            >
              <Github size={18} />
              Continue with GitHub
            </button>
          </div>

          <div className="auth__divider">
            <span>or continue with email</span>
          </div>

          {/* FORM */}
          <form className="auth__form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={errors.email ? 'error' : ''}
                />
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={errors.password ? 'error' : ''}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="auth__form-footer">
              <label className="checkbox">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            {errors.general && (
              <div className="error-message general">{errors.general}</div>
            )}

            <button
              type="submit"
              className="auth__submit-btn"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="auth__footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;