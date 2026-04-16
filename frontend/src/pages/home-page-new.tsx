
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CompanyCard } from "../components/shared/company-card";
import { listCompanies } from "../services/companies-service";
import { listJobs } from "../services/jobs-service";
import "../styles/homepage-new.css";

export function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  // Animate elements on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Fetch jobs and companies data
  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ["jobs", "featured"],
    queryFn: () => listJobs(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: companies = [], isLoading: companiesLoading } = useQuery({
    queryKey: ["companies", "featured"],
    queryFn: listCompanies,
    staleTime: 5 * 60 * 1000,
  });

  // Featured job cards for hero section
  const featuredJobs = jobs.slice(0, 3);

  return (
    <div className="jp-home-root">
      {/* HERO SECTION */}
      <section className="jp-hero-section">
        <div className="jp-hero-container">
          <div className="jp-hero-content">
            <div className="jp-hero-text">
              <h1 className="jp-hero-headline">
                Build better careers. Build better teams. All in one intelligent marketplace.
              </h1>
              <p className="jp-hero-subtext">
                Find the right opportunities faster with intelligent matching, real insights, and a platform designed for growth.
              </p>

              {/* Search Bar */}
              <div className="jp-hero-search">
                <div className="jp-search-wrapper">
                  <svg className="jp-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                  <input
                    type="text"
                    className="jp-search-input"
                    placeholder="Search jobs, companies, or skills"
                  />
                  <button className="jp-search-button">
                    Search
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="jp-hero-cta">
                <Link to="/register" className="jp-btn jp-btn-primary">
                  Create candidate account
                </Link>
                <Link to="/register" className="jp-btn jp-btn-secondary">
                  Start hiring
                </Link>
              </div>
            </div>

            {/* Smart Floating Cards */}
            <div className="jp-hero-visual">
              {featuredJobs.map((job, index) => (
                <div
                  key={job.id}
                  className={`jp-float-card jp-float-card-${index + 1} ${isVisible ? 'is-visible' : ''}`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="jp-float-card-header">
                    <span className="jp-match-badge">{Math.floor(Math.random() * 15) + 85}% match</span>
                  </div>
                  <h3 className="jp-float-card-title">{job.title}</h3>
                  <p className="jp-float-card-company">{job.company}</p>
                  <div className="jp-float-card-footer">
                    <span className="jp-salary">{job.salaryMin && job.salaryMax ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}` : 'Competitive'}</span>
                  </div>
                  <div className="jp-match-reason">
                    Why this matches you: Your profile aligns with key requirements
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SMART STATS STRIP */}
      <section className="jp-stats-strip">
        <div className="jp-stats-container">
          <div className="jp-stats-row">
            <div className="jp-stat-item">
              <span className="jp-stat-number">12,847</span>
              <span className="jp-stat-label">jobs added today</span>
            </div>
            <div className="jp-stat-item">
              <span className="jp-stat-number">384</span>
              <span className="jp-stat-label">companies hiring now</span>
            </div>
            <div className="jp-stat-item">
              <span className="jp-stat-number">87%</span>
              <span className="jp-stat-label">average match rate</span>
            </div>
            <div className="jp-stat-item">
              <span className="jp-stat-label">Top roles:</span>
              <span className="jp-stat-roles">AI • Automation • Design</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="jp-how-it-works">
        <div className="jp-section-container">
          <h2 className="jp-section-title">How JobPlus helps you move faster</h2>

          <div className="jp-steps-grid">
            <div className="jp-step-card">
              <div className="jp-step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <h3>Build your profile</h3>
              <p>Create a comprehensive profile showcasing your skills, experience, and career goals.</p>
            </div>

            <div className="jp-step-card">
              <div className="jp-step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </div>
              <h3>Get matched intelligently</h3>
              <p>Our smart algorithm finds opportunities that align with your profile and preferences.</p>
            </div>

            <div className="jp-step-card">
              <div className="jp-step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h3>Apply with confidence</h3>
              <p>Apply to matched opportunities and track your applications in one place.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="jp-features">
        <div className="jp-section-container">
          <h2 className="jp-section-title">Why choose JobPlus</h2>

          <div className="jp-features-grid">
            <div className="jp-feature-item">
              <div className="jp-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                </svg>
              </div>
              <h3>Smart Matching</h3>
              <p>AI-powered matching connects you with the right opportunities.</p>
            </div>

            <div className="jp-feature-item">
              <div className="jp-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
              <h3>Career Insights</h3>
              <p>Data-driven insights to help you make informed career decisions.</p>
            </div>

            <div className="jp-feature-item">
              <div className="jp-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h3>Profile Strength</h3>
              <p>Build a stronger profile to increase your visibility to employers.</p>
            </div>

            <div className="jp-feature-item">
              <div className="jp-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3>Hiring Intelligence</h3>
              <p>Employers find the best talent with our intelligent hiring tools.</p>
            </div>

            <div className="jp-feature-item">
              <div className="jp-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              </div>
              <h3>Company Transparency</h3>
              <p>Get insights into company culture and work environment.</p>
            </div>

            <div className="jp-feature-item">
              <div className="jp-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <h3>Fast Apply Flow</h3>
              <p>Apply to multiple opportunities quickly with our streamlined process.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED COMPANIES */}
      <section className="jp-companies">
        <div className="jp-section-container">
          <h2 className="jp-section-title">Featured Companies</h2>

          <div className="jp-companies-grid">
            {companiesLoading ? (
              <div className="jp-loading">Loading companies...</div>
            ) : (
              companies.slice(0, 6).map((company) => (
                <Link
                  key={company.id}
                  to={`/company/${company.id}`}
                  className="jp-company-item"
                >
                  <div className="jp-company-logo">
                    {company.name.charAt(0)}
                  </div>
                  <span className="jp-company-name">{company.name}</span>
                  <div className="jp-company-overlay">
                    <span>View jobs</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* FEATURED JOBS */}
      <section className="jp-jobs">
        <div className="jp-section-container">
          <div className="jp-section-header">
            <h2 className="jp-section-title">Featured Jobs</h2>
            <Link to="/jobs" className="jp-link jp-link-primary">
              Browse all jobs →
            </Link>
          </div>

          <div className="jp-jobs-grid">
            {jobsLoading ? (
              <div className="jp-loading">Loading jobs...</div>
            ) : (
              jobs.slice(0, 6).map((job) => (
                <Link key={job.id} to={`/jobs/${job.id}`} className="jp-job-card">
                  <h3>{job.title}</h3>
                  <p className="jp-job-card-company">{job.company}</p>
                  <div className="jp-job-card-footer">
                    <span className="jp-job-location">{job.location}</span>
                    <span className="jp-job-salary">
                      {job.salaryMin && job.salaryMax ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}` : 'Competitive'}
                    </span>
                  </div>
                  <div className="jp-job-match">
                    {Math.floor(Math.random() * 15) + 85}% match
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="jp-cta">
        <div className="jp-section-container">
          <h2>Ready to move your career forward?</h2>
          <div className="jp-cta-buttons">
            <Link to="/register" className="jp-btn jp-btn-primary">
              Get started
            </Link>
            <Link to="/jobs" className="jp-btn jp-btn-secondary">
              Explore jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
