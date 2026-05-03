import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight } from 'lucide-react';
import './Home.css';

const WORDS = ['Dream', 'Perfect', 'Next', 'Ideal'];

const AnimatedWord = () => {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setIndex(i => (i + 1) % WORDS.length);
        setAnimating(false);
      }, 300);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span
      className={`hero__animated-word ${animating ? 'hero__animated-word--exit' : 'hero__animated-word--enter'}`}
    >
      {WORDS[index]}
    </span>
  );
};

const useCountUp = (target, duration = 2000) => {
  const [count, setCount] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered) {
        setTriggered(true);
        const start = Date.now();
        const step = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, triggered]);

  return { count, ref };
};

const Home = () => {
  const { count: seekersCount, ref: seekersRef } = useCountUp(4200000);
  const { count: companiesCount, ref: companiesRef } = useCountUp(120000);
  const { count: hiresCount, ref: hiresRef } = useCountUp(120000);

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero__bg-pattern"></div>

        <div className="hero__container">
          {/* LEFT SIDE */}
          <div className="hero__left">
            <div className="hero__badge">
              ✨ 4.2M+ professionals trust JobPlus
            </div>

            <h1 className="hero__title">
              Find Your <AnimatedWord /> Career.<br />
              Powered by AI.
            </h1>

            <p className="hero__subtitle">
              The smartest hiring platform. AI-matched jobs, ghost job detection, and culture fit scores — so you only apply where you'll actually get hired.
            </p>

            <div className="hero__actions">
              <Link to="/jobs" className="hero__btn hero__btn--primary">
                Explore Jobs
                <ArrowRight size={18} />
              </Link>
              <button className="hero__btn hero__btn--ghost">
                <Play size={18} />
                How it works
              </button>
            </div>

            <div className="hero__stats">
              <div className="hero__stat">
                <strong ref={seekersRef}>{seekersCount.toLocaleString()}+</strong>
                <span>Job Seekers</span>
              </div>
              <div className="hero__stat-divider" />
              <div className="hero__stat">
                <strong ref={companiesRef}>{companiesCount.toLocaleString()}+</strong>
                <span>Companies</span>
              </div>
              <div className="hero__stat-divider" />
              <div className="hero__stat">
                <strong ref={hiresRef}>{hiresCount.toLocaleString()}+</strong>
                <span>Hires This Month</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="hero__right">
            <div className="hero__cards-stack">
              <div className="hero__glow"></div>

              {/* Card 1 (back) */}
              <div className="hero__card hero__card--back">
                <div className="hero__card-header">
                  <div className="hero__card-logo">
                    <img src="/api/placeholder/44/44" alt="Company" />
                  </div>
                  <div className="hero__card-match">89% match</div>
                </div>
                <div className="hero__card-content">
                  <h3>Senior React Developer</h3>
                  <p>TechCorp Inc.</p>
                  <div className="hero__card-meta">
                    <span>$120k - $150k</span>
                    <span>•</span>
                    <span>San Francisco, CA</span>
                  </div>
                </div>
              </div>

              {/* Card 2 (front) */}
              <div className="hero__card hero__card--front">
                <div className="hero__card-header">
                  <div className="hero__card-logo">
                    <img src="/api/placeholder/44/44" alt="Company" />
                  </div>
                  <div className="hero__card-match">94% match</div>
                </div>
                <div className="hero__card-content">
                  <h3>Full Stack Engineer</h3>
                  <p>InnovateLabs</p>
                  <div className="hero__card-meta">
                    <span>$95k - $125k</span>
                    <span>•</span>
                    <span>Remote</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features">
        <div className="features__container">
          <div className="features__grid">
            {/* AI Matching */}
            <div className="feature-card feature-card--large">
              <div className="feature-card__content">
                <div className="feature-card__icon">🎯</div>
                <h3>AI Job Matching</h3>
                <p>Our advanced AI analyzes your skills, experience, and preferences to find jobs that are perfect for you. 94% match accuracy means less time applying, more time succeeding.</p>
              </div>
            </div>

            {/* Culture Fit */}
            <div className="feature-card">
              <div className="feature-card__content">
                <div className="feature-card__icon">🏢</div>
                <h3>Culture Fit Scores</h3>
                <p>Don't just match skills — match values. Our AI evaluates company culture compatibility to ensure you'll thrive in your new role.</p>
              </div>
            </div>

            {/* Fast Apply */}
            <div className="feature-card">
              <div className="feature-card__content">
                <div className="feature-card__icon">⚡</div>
                <h3>Apply in 30 Seconds</h3>
                <p>Smart application forms pre-fill with your information. One-click apply with AI-generated cover letters tailored to each job.</p>
              </div>
            </div>

            {/* Ghost Jobs */}
            <div className="feature-card">
              <div className="feature-card__content">
                <div className="feature-card__icon">👻</div>
                <h3>Ghost Job Detector</h3>
                <p>We identify jobs that have already been filled internally or are inactive, saving you time and frustration.</p>
              </div>
            </div>

            {/* Skills Gap */}
            <div className="feature-card feature-card--wide">
              <div className="feature-card__content">
                <div className="feature-card__icon">📊</div>
                <h3>Skills Gap Visualizer</h3>
                <p>See exactly what skills you need to develop for your dream job. Personalized learning paths with free and paid resources.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;