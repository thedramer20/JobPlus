// src/components/common/Logo/Logo.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Logo.css';

const Logo = ({ size = 'md', noText = false }) => {
  return (
    <Link to="/" className={`jp-logo jp-logo--${size}`} aria-label="JobPlus — Go to homepage">
      {/* The icon mark */}
      <div className="jp-logo__mark" aria-hidden="true">
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6C63FF"/>
              <stop offset="100%" stopColor="#3DCFEF"/>
            </linearGradient>
            <linearGradient id="logoGradHover" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7B73FF"/>
              <stop offset="100%" stopColor="#5DE8FF"/>
            </linearGradient>
          </defs>
          {/* Background rounded square */}
          <rect width="36" height="36" rx="10" fill="url(#logoGrad)"/>
          {/* J letter */}
          <path
            d="M20 9h-2v13c0 2.2-1.8 4-4 4a4 4 0 01-4-4h2a2 2 0 004 0V9h4z"
            fill="white"
            opacity="0.95"
          />
          {/* + symbol */}
          <path
            d="M24 11v3h-3v2h3v3h2v-3h3v-2h-3v-3h-2z"
            fill="white"
            opacity="0.95"
          />
        </svg>
      </div>

      {/* The wordmark text */}
      {!noText && (
        <span className="jp-logo__text" aria-hidden="true">
          <span className="jp-logo__text-job">Job</span>
          <span className="jp-logo__text-plus">Plus</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;