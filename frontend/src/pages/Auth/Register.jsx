import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { authAPI } from '../../api/auth.api';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/common/Logo/Logo';
import './Auth.css';

const Register = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    role: 'JOB_SEEKER'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // POST to Spring Boot: /api/auth/register
      const response = await authAPI.register({
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,   // 'JOB_SEEKER' or 'EMPLOYER'
      });

      // Backend returns: { token, user: { id, name, email, role } }
      localStorage.setItem('jp_token', response.token);
      setUser(response.user);         // Update AuthContext
      navigate('/jobs');              // Redirect to the existing jobs page

    } catch (err) {
      // Spring Boot returns: { message: "Email already registered" }
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStrengthLabel = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 3) return 'Fair';
    if (passwordStrength <= 4) return 'Good';
    return 'Strong';
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'var(--text-danger)';
    if (passwordStrength <= 3) return 'var(--text-warning)';
    if (passwordStrength <= 4) return 'var(--text-success)';
    return 'var(--accent)';
  };

  return (
    <div className="auth-page">
      {/* LEFT PANEL — CINEMATIC */}
      <div className="auth-panel auth-panel--left">
        <div className="auth-panel__content">
          <Logo size="lg" />
          <h1 className="auth-panel__title">
            Create your <span className="auth-panel__title-gradient">JobPlus</span> account.
          </h1>
          <p className="auth-panel__subtitle">
            Join 4.2 million professionals. Find your next opportunity or your next hire.
          </p>

          {/* Floating feature cards */}
          <div className="auth-features">
            <div className="auth-feature-card">
              <span className="auth-feature-icon">🎯</span>
              <span>AI Job Matching — 94% accuracy</span>
            </div>
            <div className="auth-feature-card">
              <span className="auth-feature-icon">⚡</span>
              <span>Apply in 30 seconds</span>
            </div>
            <div className="auth-feature-card">
              <span className="auth-feature-icon">🔍</span>
              <span>Ghost Job Detector</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — FORM */}
      <div className="auth-panel auth-panel--right">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2>Sign up</h2>
            <p>Build your account in under a minute.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Role Selector */}
            <div className="auth-role-selector">
              <button
                type="button"
                className={`auth-role-btn ${form.role === 'JOB_SEEKER' ? 'auth-role-btn--active' : 'auth-role-btn--inactive'}`}
                onClick={() => setForm(prev => ({ ...prev, role: 'JOB_SEEKER' }))}
              >
                Job Seeker
              </button>
              <button
                type="button"
                className={`auth-role-btn ${form.role === 'EMPLOYER' ? 'auth-role-btn--active' : 'auth-role-btn--inactive'}`}
                onClick={() => setForm(prev => ({ ...prev, role: 'EMPLOYER' }))}
              >
                Employer
              </button>
            </div>

            {/* Full Name */}
            <div className="auth-field">
              <label className="auth-label">
                Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="auth-input"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Username */}
            <div className="auth-field">
              <label className="auth-label">
                Username <span className="required">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="auth-input"
                placeholder="johndoe123"
                required
              />
            </div>

            {/* Email */}
            <div className="auth-field">
              <label className="auth-label">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="auth-input"
                placeholder="john@example.com"
                required
              />
            </div>

            {/* Password */}
            <div className="auth-field">
              <label className="auth-label">
                Password <span className="required">*</span>
              </label>
              <div className="auth-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="auth-input"
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password Strength */}
              {form.password && (
                <div className="auth-password-strength">
                  <div className="auth-strength-bars">
                    {[1,2,3,4].map(i => (
                      <div
                        key={i}
                        className={`auth-strength-bar ${i <= passwordStrength ? 'auth-strength-bar--filled' : ''}`}
                        style={{ backgroundColor: i <= passwordStrength ? getStrengthColor() : 'var(--border-normal)' }}
                      />
                    ))}
                  </div>
                  <span className="auth-strength-label" style={{ color: getStrengthColor() }}>
                    {getStrengthLabel()}
                  </span>
                </div>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="auth-field">
              <label className="auth-checkbox-label">
                <input type="checkbox" required />
                <span className="auth-checkbox-custom"></span>
                I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="auth-error">
                <X size={16} />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <div className="auth-spinner" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Social Login */}
            <div className="auth-social-divider">
              <span>or continue with</span>
            </div>
            <div className="auth-social-buttons">
              <button type="button" className="auth-social-btn">
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button type="button" className="auth-social-btn">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div>

            {/* Sign In Link */}
            <p className="auth-signin-link">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;