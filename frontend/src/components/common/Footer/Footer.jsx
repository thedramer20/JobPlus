import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const [hiredToday, setHiredToday] = useState(127);

  useEffect(() => {
    // Simulate real-time updates — replace with real WebSocket
    const interval = setInterval(() => {
      setHiredToday(n => n + Math.floor(Math.random() * 3));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="jp-footer">
      <div className="jp-footer__grid">
        {/* Column 1 */}
        <div className="jp-footer__col">
          <h3>JobPlus</h3>
          <p>Connecting talent with opportunity through AI-powered matching.</p>
          <div className="jp-footer__social">
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="LinkedIn">💼</a>
            <a href="#" aria-label="GitHub">💻</a>
          </div>
        </div>

        {/* Column 2 */}
        <div className="jp-footer__col">
          <h4>For Job Seekers</h4>
          <Link to="/jobs">Browse Jobs</Link>
          <Link to="/companies">Company Reviews</Link>
          <Link to="/network">Build Network</Link>
          <Link to="/career-advice">Career Advice</Link>
        </div>

        {/* Column 3 */}
        <div className="jp-footer__col">
          <h4>For Employers</h4>
          <Link to="/post-job">Post a Job</Link>
          <Link to="/talent-search">Find Talent</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/employer-resources">Resources</Link>
        </div>

        {/* Column 4 */}
        <div className="jp-footer__col">
          <h4>Company</h4>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/press">Press</Link>
        </div>
      </div>

      <div className="jp-footer__ticker">
        🎉 <strong>{hiredToday.toLocaleString()}</strong> people got hired via JobPlus today
      </div>

      <div className="jp-footer__bottom">
        <div>© 2026 JobPlus. All rights reserved.</div>
        <div>
          <Link to="/privacy">Privacy</Link> • <Link to="/terms">Terms</Link> • <Link to="/cookies">Cookies</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;