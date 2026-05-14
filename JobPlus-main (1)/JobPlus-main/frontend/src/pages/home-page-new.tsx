import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CompanyCard } from "../components/shared/company-card";
import { listCompanies } from "../services/companies-service";
import { listJobs } from "../services/jobs-service";
import "../styles/homepage-new.css";

// Animated Counter Hook
function useAnimatedCounter(endValue: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * endValue));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [endValue, duration]);
  
  return count;
}

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

  // Animated stats - using real data when available
  const jobsCount = useAnimatedCounter(jobs.length > 0 ? jobs.length : 12543, 2000);
  const companiesCount = useAnimatedCounter(companies.length > 0 ? companies.length : 2341, 2200);
  const candidatesCount = useAnimatedCounter(89234, 2400);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="jp-home-root"
      style={{
        background: "var(--bg-base, #0A0A0F)",
        minHeight: "100vh"
      }}
    >
      {/* HERO SECTION with gradient mesh */}
      <motion.section
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className={`jp-hero-section jp-reveal ${isVisible ? "is-visible" : ""}`}
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "120px 0 80px"
        }}
      >
        {/* Animated Gradient Mesh Background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="jp-hero-gradient-mesh"
          style={{
            position: "absolute",
            inset: 0,
            background: `
              radial-gradient(circle at 20% 50%, rgba(108, 99, 255, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(0, 212, 170, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(108, 99, 255, 0.08) 0%, transparent 50%)
            `,
            filter: "blur(80px)",
            animation: "gradient-shift 15s ease infinite",
            backgroundSize: "200% 200%"
          }}
        />
        <div className="jp-hero-container">
          <div className="jp-hero-content">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="jp-hero-text"
            >
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="jp-hero-headline"
                style={{
                  fontFamily: "var(--font-display, Syne, sans-serif)",
                  fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: "var(--text-primary, #F0F0FF)",
                  margin: 0,
                  background: "var(--brand-gradient, linear-gradient(135deg, #6C63FF 0%, #3DCFEF 100%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                Build better careers. Build better teams. All in one intelligent marketplace.
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="jp-hero-subtext"
                style={{
                  fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
                  color: "var(--text-secondary, #8888AA)",
                  maxWidth: "800px",
                  lineHeight: 1.6,
                  margin: "24px 0 0 0"
                }}
              >
                Find the right opportunities faster with intelligent matching, real insights, and a platform designed for growth.
              </motion.p>

              {/* Search Bar */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="jp-hero-search jp-search"
                style={{ maxWidth: "700px", margin: "32px auto" }}
              >
                <div className="jp-search-wrapper" style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "16px",
                  padding: "8px 16px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)"
                }}>
                  <svg className="jp-search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{
                    width: "20px",
                    height: "20px",
                    color: "var(--text-secondary, #8888AA)"
                  }}>
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                  <input
                    type="text"
                    className="jp-search__input"
                    placeholder="Search jobs, companies, or skills"
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--text-primary, #F0F0FF)",
                      fontSize: "1rem",
                      padding: "12px 0 12px 12px",
                      width: "100%",
                      outline: "none"
                    }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="jp-btn jp-btn-primary jp-search-button"
                    style={{
                      background: "var(--brand-gradient, linear-gradient(135deg, #6C63FF 0%, #3DCFEF 100%))",
                      color: "#ffffff",
                      padding: "12px 24px",
                      borderRadius: "999px",
                      fontSize: "1rem",
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 4px 14px rgba(108, 99, 255, 0.35)"
                    }}
                  >
                    Search
                  </motion.button>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="jp-hero-cta"
                style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "24px" }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/register" className="jp-btn jp-btn-primary" style={{
                    display: "inline-block",
                    background: "var(--brand-gradient, linear-gradient(135deg, #6C63FF 0%, #3DCFEF 100%))",
                    color: "#ffffff",
                    padding: "14px 32px",
                    borderRadius: "999px",
                    fontSize: "1rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    boxShadow: "0 4px 14px rgba(108, 99, 255, 0.35)"
                  }}>
                    Create candidate account
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/register" className="jp-btn jp-btn-secondary" style={{
                    display: "inline-block",
                    background: "var(--bg-elevated, #1A1A24)",
                    color: "var(--text-primary, #F0F0FF)",
                    padding: "14px 32px",
                    borderRadius: "999px",
                    fontSize: "1rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    border: "1px solid var(--border-subtle, rgba(255,255,255,0.06))"
                  }}>
                    Start hiring
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Smart Floating Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="jp-hero-visual"
            >
              {featuredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    delay: 1.8 + (index * 0.15),
                    duration: 0.6,
                    type: "spring",
                    stiffness: 200,
                    damping: 25
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`jp-float-card jp-float-card-${index + 1} jp-card-polish jp-reveal-scale glass-card ${isVisible ? "is-visible" : ""}`}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "16px",
                    padding: "20px",
                    animationDelay: `${index * 0.2}s`,
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)"
                  }}
                >
                  <div className="jp-float-card-header" style={{ marginBottom: "12px" }}>
                    <span className="jp-match-badge" style={{
                      background: "rgba(34, 197, 94, 0.2)",
                      color: "#22C55E",
                      padding: "4px 12px",
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                      fontWeight: 600
                    }}>{Math.floor(Math.random() * 15) + 85}% match</span>
                  </div>
                  <h3 className="jp-float-card-title" style={{
                    color: "var(--text-primary, #F0F0FF)",
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    margin: "0 0 8px 0"
                  }}>{job.title}</h3>
                  <p className="jp-float-card-company" style={{
                    color: "var(--text-secondary, #8888AA)",
                    fontSize: "0.875rem",
                    margin: 0
                  }}>{job.company}</p>
                  <div className="jp-float-card-footer" style={{ marginTop: "12px" }}>
                    <span className="jp-salary" style={{
                      color: "var(--brand-secondary, #00D4AA)",
                      fontSize: "1rem",
                      fontWeight: 600
                    }}>{job.salaryMin && job.salaryMax ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}` : 'Competitive'}</span>
                  </div>
                  <div className="jp-match-reason" style={{
                    marginTop: "16px",
                    padding: "12px",
                    background: "rgba(108, 99, 255, 0.05)",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    color: "var(--text-secondary, #8888AA)"
                  }}>
                    Why this matches you: Your profile aligns with key requirements
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* STATS SECTION with animated counters */}
      <motion.section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className={`jp-stats-section jp-reveal ${isVisible ? "is-visible" : ""}`}
        style={{
          padding: "80px 0",
          background: "var(--bg-surface, #111118)",
          borderTop: "1px solid var(--border-subtle, rgba(255,255,255,0.06))"
        }}
      >
        <div className="jp-stats-container" style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px"
        }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.6 }}
            whileHover={{ scale: 1.05, y: -4 }}
            className="jp-stat-card jp-card-polish glass-card"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "32px 24px",
              textAlign: "center"
            }}
          >
            <div className="jp-stat-number" style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              color: "var(--brand-primary, #6C63FF)",
              lineHeight: 1,
              marginBottom: "8px"
            }}>{jobsCount.toLocaleString()}</div>
            <div className="jp-stat-label" style={{
              fontSize: "0.875rem",
              color: "var(--text-secondary, #8888AA)",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>Active Jobs</div>
          </motion.div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2.4, duration: 0.6 }}
            whileHover={{ scale: 1.05, y: -4 }}
            className="jp-stat-card jp-card-polish glass-card"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "32px 24px",
              textAlign: "center"
            }}
          >
            <div className="jp-stat-number" style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              color: "var(--brand-secondary, #00D4AA)",
              lineHeight: 1,
              marginBottom: "8px"
            }}>{companiesCount.toLocaleString()}</div>
            <div className="jp-stat-label" style={{
              fontSize: "0.875rem",
              color: "var(--text-secondary, #8888AA)",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>Companies</div>
          </motion.div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2.6, duration: 0.6 }}
            whileHover={{ scale: 1.05, y: -4 }}
            className="jp-stat-card jp-card-polish glass-card"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "32px 24px",
              textAlign: "center"
            }}
          >
            <div className="jp-stat-number" style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              color: "var(--brand-gradient, linear-gradient(135deg, #6C63FF 0%, #3DCFEF 100%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1,
              marginBottom: "8px"
            }}>{candidatesCount.toLocaleString()}</div>
            <div className="jp-stat-label" style={{
              fontSize: "0.875rem",
              color: "var(--text-secondary, #8888AA)",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>Candidates</div>
          </motion.div>
        </div>
      </motion.section>

      {/* FEATURED JOBS SECTION */}
      <motion.section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2.8, duration: 0.8 }}
        className={`jp-featured-jobs-section jp-reveal ${isVisible ? "is-visible" : ""}`}
        style={{
          padding: "80px 0",
          background: "var(--bg-base, #0A0A0F)"
        }}
      >
        <div className="jp-section-header" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          maxWidth: "1200px",
          margin: "0 auto 32px"
        }}>
          <motion.h2
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 3, duration: 0.6 }}
            style={{
              fontFamily: "var(--font-display, Syne, sans-serif)",
              fontSize: "2rem",
              fontWeight: 700,
              color: "var(--text-primary, #F0F0FF)",
              margin: 0
            }}
          >Featured Opportunities</motion.h2>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/jobs" className="btn btn-secondary" style={{
              display: "inline-block",
              background: "var(--bg-elevated, #1A1A24)",
              color: "var(--text-primary, #F0F0FF)",
              padding: "12px 24px",
              borderRadius: "999px",
              fontSize: "1rem",
              fontWeight: 600,
              textDecoration: "none",
              border: "1px solid var(--border-subtle, rgba(255,255,255,0.06))"
            }}>View All Jobs</Link>
          </motion.div>
        </div>
        <div className="jp-jobs-grid" style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px"
        }}>
          {jobsLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="jp-loading-state"
              style={{
                textAlign: "center",
                padding: "48px",
                color: "var(--text-secondary, #8888AA)",
                fontSize: "1rem"
              }}
            >Loading opportunities...</motion.div>
          ) : (
            jobs.slice(0, 6).map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 3.2 + (index * 0.1),
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200,
                  damping: 25
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="jp-job-card jp-card-polish glass-card"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "16px",
                  padding: "24px",
                  cursor: "pointer"
                }}
              >
                <h3 style={{
                  color: "var(--text-primary, #F0F0FF)",
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  margin: "0 0 12px 0"
                }}>{job.title}</h3>
                <p style={{
                  color: "var(--text-secondary, #8888AA)",
                  fontSize: "0.875rem",
                  margin: "0 0 8px 0"
                }}>{job.company}</p>
                <p style={{
                  color: "var(--text-muted, #44445A)",
                  fontSize: "0.875rem",
                  margin: 0
                }}>{job.location}</p>
                <div className="jp-job-footer" style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "16px"
                }}>
                  <span style={{
                    color: "var(--brand-secondary, #00D4AA)",
                    fontSize: "1rem",
                    fontWeight: 600
                  }}>{job.salaryMin && job.salaryMax ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}` : 'Competitive'}</span>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to={`/jobs/${job.id}`} className="jp-btn jp-btn-primary" style={{
                      display: "inline-block",
                      background: "var(--brand-gradient, linear-gradient(135deg, #6C63FF 0%, #3DCFEF 100%))",
                      color: "#ffffff",
                      padding: "10px 20px",
                      borderRadius: "999px",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      boxShadow: "0 4px 14px rgba(108, 99, 255, 0.35)"
                    }}>View Details</Link>
                  </motion.div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.section>

      {/* FEATURED COMPANIES SECTION */}
      <section className={`jp-companies-section jp-reveal ${isVisible ? "is-visible" : ""}`}>
        <div className="jp-section-header" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          maxWidth: "1200px",
          margin: "0 auto 32px"
        }}>
          <motion.h2
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 4, duration: 0.6 }}
            style={{
              fontFamily: "var(--font-display, Syne, sans-serif)",
              fontSize: "2rem",
              fontWeight: 700,
              color: "var(--text-primary, #F0F0FF)",
              margin: 0
            }}
          >Featured Companies</motion.h2>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/companies" className="btn btn-secondary" style={{
              display: "inline-block",
              background: "var(--bg-elevated, #1A1A24)",
              color: "var(--text-primary, #F0F0FF)",
              padding: "12px 24px",
              borderRadius: "999px",
              fontSize: "1rem",
              fontWeight: 600,
              textDecoration: "none",
              border: "1px solid var(--border-subtle, rgba(255,255,255,0.06))"
            }}>View All Companies</Link>
          </motion.div>
        </div>
        <div className="jp-companies-grid" style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px"
        }}>
          {companiesLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="jp-loading-state"
              style={{
                textAlign: "center",
                padding: "48px",
                color: "var(--text-secondary, #8888AA)",
                fontSize: "1rem"
              }}
            >Loading companies...</motion.div>
          ) : (
            companies.slice(0, 4).map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 4.2 + (index * 0.1),
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200,
                  damping: 25
                }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <CompanyCard key={company.id} company={company} />
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className={`jp-cta-section jp-reveal ${isVisible ? "is-visible" : ""}`}>
        <div className="jp-cta-card jp-glass">
          <h2>Ready to Transform Your Career?</h2>
          <p>Join thousands of professionals who have found their dream jobs through JobPlus.</p>
          <div className="jp-cta-actions">
            <Link to="/register" className="btn btn-primary">Get Started Free</Link>
            <Link to="/about" className="btn btn-secondary">Learn More</Link>
          </div>
        </div>
      </section>
    </motion.div>

  );
}
