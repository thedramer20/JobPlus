import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, Heart, MessageSquare, Zap, Users, Briefcase, Building2, Star, TrendingUp, CheckCircle, Search } from 'lucide-react';
import { useCountUp } from '../../hooks/useCountUp';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useDebounce } from '../../hooks/useDebounce';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { landingAPI } from '../../api/landing.api';
import { JobCardSkeleton, CompanyCardSkeleton, StatsBarSkeleton } from '../../components/ui/Skeleton/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState/EmptyState';
import { useToast } from '../../components/ui/Toast/Toast';
import './Landing.css';

// ════════════════════════════════════════════════════════════════════════════════════
// SECTION 1: HERO SECTION
// ════════════════════════════════════════════════════════════════════════════════════

const ANIMATED_WORDS = ['Dream', 'Perfect', 'Next', 'Ideal'];

const AnimatedWord = () => {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setIndex(i => (i + 1) % ANIMATED_WORDS.length);
        setAnimating(false);
      }, 300);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className={`hero__word ${animating ? 'hero__word--exit' : 'hero__word--enter'}`}>
      {ANIMATED_WORDS[index]}
    </span>
  );
};

// ════════════════════════════════════════════════════════════════════════════════════
// SECTION 2: STATS SECTION
// ════════════════════════════════════════════════════════════════════════════════════

const DUMMY_STATS = {
  totalJobSeekers: 4200000,
  totalCompanies: 120000,
  hiresThisMonth: 98000,
  countries: 40,
};

// ════════════════════════════════════════════════════════════════════════════════════
// SECTION 3: MARQUEE (Company Logos)
// ════════════════════════════════════════════════════════════════════════════════════

const MARQUEE_COMPANIES = [
  { name: 'Google', logo: '🔵' },
  { name: 'Microsoft', logo: '◻️' },
  { name: 'Apple', logo: '🍎' },
  { name: 'Meta', logo: '👍' },
  { name: 'Amazon', logo: '📦' },
  { name: 'Tesla', logo: '⚡' },
  { name: 'Netflix', logo: '📺' },
  { name: 'Adobe', logo: '🎨' },
];

// ════════════════════════════════════════════════════════════════════════════════════
// SECTION 4: FEATURES SECTION
// ════════════════════════════════════════════════════════════════════════════════════

const FEATURES = [
  { icon: '🎯', title: 'AI Job Matching', desc: 'Our advanced AI analyzes your skills and finds perfect matches. 94% accuracy.' },
  { icon: '🏢', title: 'Culture Fit Scores', desc: 'Match values & company culture, not just skills.' },
  { icon: '⚡', title: 'Apply in 30 Seconds', desc: 'Pre-filled forms and AI-generated cover letters.' },
  { icon: '👻', title: 'Ghost Job Detector', desc: 'We identify already-filled or inactive jobs.' },
  { icon: '📊', title: 'Skills Gap Analyzer', desc: 'See what skills you need and get learning paths.' },
];

// ════════════════════════════════════════════════════════════════════════════════════
// SECTION 5: LIVE TICKER (Job Pills)
// ════════════════════════════════════════════════════════════════════════════════════

const DUMMY_TICKER_JOBS = [
  { id: 1, title: 'Senior React Developer', company: 'Google', location: 'Mountain View' },
  { id: 2, title: 'Product Designer', company: 'Meta', location: 'Remote' },
  { id: 3, title: 'ML Engineer', company: 'DeepMind', location: 'London' },
  { id: 4, title: 'Full Stack Engineer', company: 'Stripe', location: 'San Francisco' },
  { id: 5, title: 'Data Scientist', company: 'Netflix', location: 'Los Gatos' },
  { id: 6, title: 'DevOps Engineer', company: 'CloudFlare', location: 'Remote' },
];

// ════════════════════════════════════════════════════════════════════════════════════
// SECTION 6: FEATURED JOBS
// ════════════════════════════════════════════════════════════════════════════════════

const DUMMY_FEATURED_JOBS = [
  {
    id: 1,
    title: 'Senior React Developer',
    company: { name: 'Google', logoUrl: '🔵', slug: 'google' },
    location: 'Mountain View, CA',
    locationType: 'HYBRID' as const,
    salaryMin: 150000,
    salaryMax: 200000,
    jobType: 'Full-time',
    skills: ['React', 'TypeScript', 'Node.js'],
    isEasyApply: true,
    postedAt: '2 days ago',
    matchScore: 94,
  },
  {
    id: 2,
    title: 'Product Designer',
    company: { name: 'Meta', logoUrl: '👍', slug: 'meta' },
    location: 'Menlo Park, CA',
    locationType: 'ON_SITE' as const,
    salaryMin: 130000,
    salaryMax: 170000,
    jobType: 'Full-time',
    skills: ['Figma', 'UX Research', 'Design Systems'],
    isEasyApply: false,
    postedAt: '1 day ago',
    matchScore: 88,
  },
  {
    id: 3,
    title: 'ML Engineer',
    company: { name: 'DeepMind', logoUrl: '🧠', slug: 'deepmind' },
    location: 'London, UK',
    locationType: 'ON_SITE' as const,
    salaryMin: 140000,
    salaryMax: 180000,
    jobType: 'Full-time',
    skills: ['Python', 'TensorFlow', 'Research'],
    isEasyApply: true,
    postedAt: '3 days ago',
    matchScore: 91,
  },
  {
    id: 4,
    title: 'Full Stack Developer',
    company: { name: 'Stripe', logoUrl: '💳', slug: 'stripe' },
    location: 'San Francisco, CA',
    locationType: 'REMOTE' as const,
    salaryMin: 160000,
    salaryMax: 210000,
    jobType: 'Full-time',
    skills: ['JavaScript', 'React', 'Ruby', 'PostgreSQL'],
    isEasyApply: true,
    postedAt: '5 days ago',
    matchScore: 85,
  },
  {
    id: 5,
    title: 'Data Scientist',
    company: { name: 'Netflix', logoUrl: '📺', slug: 'netflix' },
    location: 'Los Gatos, CA',
    locationType: 'HYBRID' as const,
    salaryMin: 150000,
    salaryMax: 200000,
    jobType: 'Full-time',
    skills: ['Python', 'SQL', 'Statistics', 'ML'],
    isEasyApply: false,
    postedAt: '4 days ago',
    matchScore: 89,
  },
  {
    id: 6,
    title: 'DevOps Engineer',
    company: { name: 'CloudFlare', logoUrl: '☁️', slug: 'cloudflare' },
    location: 'Remote',
    locationType: 'REMOTE' as const,
    salaryMin: 140000,
    salaryMax: 190000,
    jobType: 'Full-time',
    skills: ['Kubernetes', 'Docker', 'AWS', 'Go'],
    isEasyApply: true,
    postedAt: '1 week ago',
    matchScore: 83,
  },
];

// ════════════════════════════════════════════════════════════════════════════════════
// SECTION 7: JOB CATEGORIES
// ════════════════════════════════════════════════════════════════════════════════════

const DUMMY_CATEGORIES = [
  { label: 'Engineering', jobCount: 15234 },
  { label: 'Design', jobCount: 4821 },
  { label: 'Product', jobCount: 3456 },
  { label: 'Marketing', jobCount: 5678 },
  { label: 'Sales', jobCount: 6234 },
  { label: 'Data', jobCount: 4123 },
];

// ════════════════════════════════════════════════════════════════════════════════════
// SECTION 8: TOP COMPANIES
// ════════════════════════════════════════════════════════════════════════════════════

const DUMMY_TOP_COMPANIES = [
  { id: 1, name: 'Google', slug: 'google', logoUrl: '🔵', industry: 'Technology', openRoles: 234, rating: 4.8, isFollowing: false },
  { id: 2, name: 'Meta', slug: 'meta', logoUrl: '👍', industry: 'Technology', openRoles: 156, rating: 4.5, isFollowing: false },
  { id: 3, name: 'Apple', slug: 'apple', logoUrl: '🍎', industry: 'Technology', openRoles: 128, rating: 4.9, isFollowing: false },
  { id: 4, name: 'Microsoft', slug: 'microsoft', logoUrl: '◻️', industry: 'Technology', openRoles: 189, rating: 4.7, isFollowing: false },
  { id: 5, name: 'Amazon', slug: 'amazon', logoUrl: '📦', industry: 'E-commerce', openRoles: 412, rating: 4.2, isFollowing: false },
  { id: 6, name: 'Netflix', slug: 'netflix', logoUrl: '📺', industry: 'Entertainment', openRoles: 89, rating: 4.6, isFollowing: false },
];

// ════════════════════════════════════════════════════════════════════════════════════
// SECTION 9: TESTIMONIALS
// ════════════════════════════════════════════════════════════════════════════════════

const TESTIMONIALS = [
  { name: 'Sarah Chen', role: 'Software Engineer at Google', text: 'JobPlus found me my dream role at Google in just 2 weeks. The AI matching was spot-on!', avatar: '👩‍💻' },
  { name: 'Marcus Johnson', role: 'Product Manager at Meta', text: 'The culture fit scoring helped me find a company where I actually want to work, not just any job.', avatar: '👨‍💼' },
  { name: 'Priya Patel', role: 'Data Scientist at Netflix', text: 'The ghost job detector saved me so much time. I only applied to real opportunities.', avatar: '👩‍🔬' },
];

// ════════════════════════════════════════════════════════════════════════════════════
// MAIN LANDING COMPONENT
// ════════════════════════════════════════════════════════════════════════════════════

const Landing: React.FC = () => {
  const { showToast } = useToast();
  const [stats, setStats] = useState(DUMMY_STATS);
  const [featuredJobs, setFeaturedJobs] = useState(DUMMY_FEATURED_JOBS);
  const [topCompanies, setTopCompanies] = useState(DUMMY_TOP_COMPANIES);
  const [categories, setCategories] = useState(DUMMY_CATEGORIES);
  const [tickerJobs, setTickerJobs] = useState(DUMMY_TICKER_JOBS);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  const [savedJobs, setSavedJobs] = useLocalStorage<number[]>('savedJobs', []);
  const [followedCompanies, setFollowedCompanies] = useLocalStorage<number[]>('followedCompanies', []);

  // API calls
  useEffect(() => {
    // Load stats
    landingAPI
      .getStats()
      .then(data => setStats(data))
      .catch(err => console.error('Stats error:', err))
      .finally(() => setLoadingStats(false));

    // Load featured jobs
    landingAPI
      .getFeaturedJobs()
      .then(data => setFeaturedJobs(data))
      .catch(err => console.error('Jobs error:', err))
      .finally(() => setLoadingJobs(false));

    // Load top companies
    landingAPI
      .getTopCompanies()
      .then(data => setTopCompanies(data))
      .catch(err => console.error('Companies error:', err))
      .finally(() => setLoadingCompanies(false));

    // Load categories
    landingAPI.getCategories().catch(err => console.error('Categories error:', err));

    // Load ticker
    landingAPI.getLiveTicker().catch(err => console.error('Ticker error:', err));
  }, []);

  // Hooks for scroll reveal
  const { ref: statsRef, visible: statsVisible } = useScrollReveal(0.2);
  const { ref: featuresRef, visible: featuresVisible } = useScrollReveal(0.15);
  const { ref: tickerRef, visible: tickerVisible } = useScrollReveal(0.3);
  const { ref: jobsRef, visible: jobsVisible } = useScrollReveal(0.15);
  const { ref: companiesRef, visible: companiesVisible } = useScrollReveal(0.15);
  const { ref: testimonialRef, visible: testimonialVisible } = useScrollReveal(0.2);

  // Count-up animations
  const { display: seekersDisplay, ref: seekersRef } = useCountUp(stats.totalJobSeekers, 2500, '', '+');
  const { display: companiesDisplay, ref: companiesCountRef } = useCountUp(stats.totalCompanies, 2500, '', '+');
  const { display: hiresDisplay, ref: hiresRef } = useCountUp(stats.hiresThisMonth, 2500, '', '+');
  const { display: countriesDisplay, ref: countriesRef } = useCountUp(stats.countries, 2500, '');

  // Toggle save job
  const toggleSaveJob = (jobId: number) => {
    setSavedJobs(prev => {
      const isSaving = !prev.includes(jobId);
      showToast(isSaving ? '💾 Job saved to your list' : '🗑️ Job removed from saved', 'success');
      return isSaving ? [...prev, jobId] : prev.filter(id => id !== jobId);
    });
  };

  // Toggle follow company
  const toggleFollowCompany = (companyId: number, companyName: string) => {
    setFollowedCompanies(prev => {
      const isFollowing = !prev.includes(companyId);
      showToast(
        isFollowing ? `✨ Following ${companyName} — you'll get job alerts` : `👋 Unfollowed ${companyName}`,
        'success'
      );
      return isFollowing ? [...prev, companyId] : prev.filter(id => id !== companyId);
    });
  };

  return (
    <div className="landing">
      {/* ════════════════════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 1: HERO */}
      {/* ════════════════════════════════════════════════════════════════════════════════════ */}
      <section className="hero">
        <div className="hero__background">
          <div className="hero__glow hero__glow--1"></div>
          <div className="hero__glow hero__glow--2"></div>
          <div className="hero__dots"></div>
        </div>

        <div className="hero__container">
          <div className="hero__left">
            <div className="hero__badge">✨ 4.2M+ professionals trust JobPlus</div>

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
              <button className="hero__btn hero__btn--secondary">
                <Play size={18} />
                How it works
              </button>
            </div>

            <div className="hero__stats">
              <div className="hero__stat">
                <strong>4.8⭐</strong>
                <span>Rating</span>
              </div>
              <div className="hero__stat-divider" />
              <div className="hero__stat">
                <strong>98K+</strong>
                <span>Successful Hires</span>
              </div>
              <div className="hero__stat-divider" />
              <div className="hero__stat">
                <strong>40+</strong>
                <span>Countries</span>
              </div>
            </div>
          </div>

          <div className="hero__right">
            <div className="hero__card hero__card--1">
              <div className="hero__card-header">Google</div>
              <div className="hero__card-title">Senior React Dev</div>
              <div className="hero__card-meta">$150K - $200K • Remote</div>
              <div className="hero__card-match">94% match</div>
            </div>
            <div className="hero__card hero__card--2">
              <div className="hero__card-header">Meta</div>
              <div className="hero__card-title">Product Designer</div>
              <div className="hero__card-meta">$130K - $170K • On-site</div>
              <div className="hero__card-match">88% match</div>
            </div>
            <div className="hero__card hero__card--3">
              <div className="hero__card-header">Netflix</div>
              <div className="hero__card-title">Data Scientist</div>
              <div className="hero__card-meta">$150K - $200K • Hybrid</div>
              <div className="hero__card-match">91% match</div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 2: STATS BAR */}
      {/* ════════════════════════════════════════════════════════════════════════════════════ */}
      <section className="stats" ref={statsRef}>
        <div className="stats__container">
          {loadingStats ? (
            <StatsBarSkeleton />
          ) : (
            <>
              <div className="stat-item">
                <div className="stat-item__value" ref={seekersRef}>
                  {seekersDisplay}
                </div>
                <div className="stat-item__label">Job Seekers</div>
              </div>
              <div className="stat-item">
                <div className="stat-item__value" ref={companiesCountRef}>
                  {companiesDisplay}
                </div>
                <div className="stat-item__label">Companies</div>
              </div>
              <div className="stat-item">
                <div className="stat-item__value" ref={hiresRef}>
                  {hiresDisplay}
                </div>
                <div className="stat-item__label">Hires This Month</div>
              </div>
              <div className="stat-item">
                <div className="stat-item__value" ref={countriesRef}>
                  {countriesDisplay}
                </div>
                <div className="stat-item__label">Countries</div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 3: MARQUEE */}
      {/* ════════════════════════════════════════════════════════════════════════════════════ */}
      <section className="marquee">
        <div className="marquee__label">Trusted by top companies worldwide</div>
        <div className="marquee__track">
          <div className="marquee__content">
            {[...MARQUEE_COMPANIES, ...MARQUEE_COMPANIES].map((company, idx) => (
              <div key={idx} className="marquee__item">
                <span className="marquee__logo">{company.logo}</span>
                <span className="marquee__name">{company.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 4: FEATURES */}
      {/* ════════════════════════════════════════════════════════════════════════════════════ */}
      <section className="features" ref={featuresRef}>
        <div className="features__container">
          <h2 className="features__title">Why JobPlus Stands Out</h2>
          <div className={`features__grid ${featuresVisible ? 'features__grid--visible' : ''}`}>
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-card__icon">{feature.icon}</div>
                <h3 className="feature-card__title">{feature.title}</h3>
                <p className="feature-card__desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 5: LIVE TICKER */}
      {/* ════════════════════════════════════════════════════════════════════════════════════ */}
      <section className="ticker" ref={tickerRef}>
        <div className="ticker__container">
          <div className="ticker__header">
            <h2 className="ticker__title">🔴 Live Job Ticker</h2>
            <p className="ticker__subtitle">New opportunities posted every minute</p>
          </div>
          {tickerVisible && (
            <div className="ticker__track">
              <div className="ticker__content">
                {[...tickerJobs, ...tickerJobs].map((job, idx) => (
                  <div key={idx} className="ticker__pill">
                    <span className="ticker__dot"></span>
                    <strong>{job.title}</strong>
                    <span className="ticker__company">{job.company}</span>
                    <span className="ticker__location">{job.location}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 6: FEATURED JOBS */}
      {/* ════════════════════════════════════════════════════════════════════════════════════ */}
      <section className="featured-jobs" ref={jobsRef}>
        <div className="featured-jobs__container">
          <div className="featured-jobs__header">
            <h2 className="featured-jobs__title">Featured Opportunities</h2>
            <Link to="/jobs" className="featured-jobs__view-all">
              View All Jobs
              <ArrowRight size={16} />
            </Link>
          </div>

          {loadingJobs ? (
            <div className="featured-jobs__grid">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))}
            </div>
          ) : (
            <div className="featured-jobs__grid">
              {featuredJobs.map(job => (
                <div key={job.id} className="job-card">
                  <div className="job-card__accent-bar"></div>
                  <div className="job-card__header">
                    <div className="job-card__logo">{job.company.logoUrl}</div>
                    <div className="job-card__company-info">
                      <div className="job-card__company">{job.company.name}</div>
                      <div className="job-card__location">{job.location}</div>
                    </div>
                    <button
                      className={`job-card__save ${savedJobs.includes(job.id) ? 'job-card__save--active' : ''}`}
                      onClick={() => toggleSaveJob(job.id)}
                      aria-label={savedJobs.includes(job.id) ? 'Remove from saved' : 'Save job'}
                    >
                      <Heart size={18} fill={savedJobs.includes(job.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  <h3 className="job-card__title">{job.title}</h3>

                  <div className="job-card__meta">
                    <span className="job-card__type">{job.jobType}</span>
                    <span className="job-card__location-type">{job.locationType}</span>
                    <span className="job-card__salary">
                      ${(job.salaryMin / 1000).toFixed(0)}K - ${(job.salaryMax / 1000).toFixed(0)}K
                    </span>
                  </div>

                  <div className="job-card__skills">
                    {job.skills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="job-card__skill">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="job-card__footer">
                    <div className="job-card__match">
                      {job.matchScore && <span className="job-card__match-badge">{job.matchScore}% match</span>}
                    </div>
                    <Link to={`/jobs/${job.id}`} className="job-card__apply">
                      {job.isEasyApply ? '⚡ Easy Apply' : 'View Details'}
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 7: CATEGORIES */}
      {/* ════════════════════════════════════════════════════════════════════════════════════ */}
      <section className="categories">
        <div className="categories__container">
          <h2 className="categories__title">Browse by Category</h2>
          <div className="categories__grid">
            {categories.map((category, idx) => (
              <Link key={idx} to={`/jobs?category=${category.label}`} className="category-card">
                <div className="category-card__icon">📁</div>
                <h3 className="category-card__title">{category.label}</h3>
                <p className="category-card__count">{category.jobCount.toLocaleString()} roles</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 8: TOP COMPANIES */}
      {/* ════════════════════════════════════════════════════════════════════════════════════ */}
      <section className="top-companies" ref={companiesRef}>
        <div className="top-companies__container">
          <div className="top-companies__header">
            <h2 className="top-companies__title">Top Hiring Companies</h2>
            <Link to="/companies" className="top-companies__view-all">
              View All Companies
              <ArrowRight size={16} />
            </Link>
          </div>

          {loadingCompanies ? (
            <div className="top-companies__grid">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <CompanyCardSkeleton key={i} />
                ))}
            </div>
          ) : (
            <div className="top-companies__grid">
              {topCompanies.map(company => (
                <div key={company.id} className="company-card">
                  <div className="company-card__logo">{company.logoUrl}</div>
                  <h3 className="company-card__name">{company.name}</h3>
                  <p className="company-card__industry">{company.industry}</p>
                  <p className="company-card__roles">{company.openRoles} open roles</p>
                  <div className="company-card__rating">
                    <Star size={14} fill="#FFD700" stroke="#FFD700" />
                    <span>{company.rating}</span>
                  </div>
                  <button
                    className={`company-card__follow ${followedCompanies.includes(company.id) ? 'company-card__follow--following' : ''}`}
                    onClick={() => toggleFollowCompany(company.id, company.name)}
                  >
                    {followedCompanies.includes(company.id) ? '✓ Following' : '+ Follow'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 9: HOW IT WORKS */}
      {/* ════════════════════════════════════════════════════════════════════════════════════ */}
      <section className="how-it-works">
        <div className="how-it-works__container">
          <h2 className="how-it-works__title">How It Works</h2>
          <div className="how-it-works__steps">
            <div className="step">
              <div className="step__number">1</div>
              <h3 className="step__title">Create Your Profile</h3>
              <p className="step__desc">Set up your profile with your skills, experience, and preferences in minutes.</p>
            </div>
            <div className="step">
              <div className="step__number">2</div>
              <h3 className="step__title">Get AI-Matched</h3>
              <p className="step__desc">Our AI analyzes your profile and finds jobs that are perfect for you.</p>
            </div>
            <div className="step">
              <div className="step__number">3</div>
              <h3 className="step__title">Apply Smart</h3>
              <p className="step__desc">One-click apply with pre-filled forms and AI-generated cover letters.</p>
            </div>
            <div className="step">
              <div className="step__number">4</div>
              <h3 className="step__title">Get Hired</h3>
              <p className="step__desc">Hear back from companies faster with our optimized matching system.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 10: TESTIMONIALS */}
      {/* ════════════════════════════════════════════════════════════════════════════════════ */}
      <section className="testimonials" ref={testimonialRef}>
        <div className="testimonials__container">
          <h2 className="testimonials__title">Success Stories</h2>
          <div className={`testimonials__grid ${testimonialVisible ? 'testimonials__grid--visible' : ''}`}>
            {TESTIMONIALS.map((testimonial, idx) => (
              <div key={idx} className="testimonial-card">
                <div className="testimonial-card__avatar">{testimonial.avatar}</div>
                <p className="testimonial-card__text">"{testimonial.text}"</p>
                <div className="testimonial-card__author">
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 11: CTA SECTION */}
      {/* ════════════════════════════════════════════════════════════════════════════════════ */}
      <section className="cta">
        <div className="cta__container">
          <h2 className="cta__title">Ready to find your perfect job?</h2>
          <p className="cta__subtitle">Join 4.2M+ job seekers getting AI-matched with their dream roles every day.</p>
          <Link to="/jobs" className="cta__btn">
            Start Exploring
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 12: FAQ / NEWSLETTER */}
      {/* ════════════════════════════════════════════════════════════════════════════════════ */}
      <section className="newsletter">
        <div className="newsletter__container">
          <h2 className="newsletter__title">Stay Updated</h2>
          <p className="newsletter__subtitle">Get the best jobs delivered to your inbox</p>
          <form className="newsletter__form" onSubmit={e => {
            e.preventDefault();
            showToast('✅ Successfully subscribed to job alerts!', 'success');
          }}>
            <input type="email" placeholder="Enter your email" required className="newsletter__input" />
            <button type="submit" className="newsletter__btn">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Landing;
