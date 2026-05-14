
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { listJobs } from "../services/jobs-service";
import type { Job } from "../types/job";
import "../styles/jobs-page-new.css";

export function JobsPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    jobType: "",
    salary: "",
    workType: ""
  });
  const [expandedFilters, setExpandedFilters] = useState(false);

  const { data: jobs = [], isLoading } = useQuery<Job[]>({
    queryKey: ["jobs"],
    queryFn: () => listJobs()
  });

  const filteredJobs = useMemo(() => {
    return jobs.filter((job: Job) => {
      if (filters.search && !job.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.jobType && !job.type?.toLowerCase().includes(filters.jobType.toLowerCase())) return false;
      if (filters.workType && !job.workMode?.toLowerCase().includes(filters.workType.toLowerCase())) return false;
      if (filters.salary) {
        const minSalary = parseInt(filters.salary);
        if (job.salaryMin && job.salaryMin < minSalary) return false;
      }
      return true;
    });
  }, [jobs, filters]);

  const getMatchScore = () => Math.floor(Math.random() * 15) + 85;
  const getMatchReasons = (job: Job) => [
    "Your skills align with requirements",
    "Similar to roles you've viewed",
    "Matches your experience level",
    "Good salary for your market",
    "Strong growth potential"
  ].slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="jp-jobs-root"
      style={{
        background: "var(--bg-base, #0A0A0F)",
        minHeight: "100vh"
      }}
    >
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="jp-jobs-header"
        style={{
          background: "var(--bg-surface, #111118)",
          borderBottom: "1px solid var(--border-subtle, rgba(255,255,255,0.06))",
          padding: "24px 0"
        }}
      >
        <div className="jp-jobs-container">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="jp-jobs-title"
          >
            <h1 style={{
              fontFamily: "var(--font-display, Syne, sans-serif)",
              fontSize: "2.25rem",
              fontWeight: 700,
              color: "var(--text-primary, #F0F0FF)",
              margin: 0,
              background: "var(--brand-gradient, linear-gradient(135deg, #6C63FF 0%, #3DCFEF 100%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>Find Your Next Opportunity</h1>
            <p style={{
              color: "var(--text-secondary, #8888AA)",
              fontSize: "1.125rem",
              marginTop: "8px",
              margin: "8px 0 0 0"
            }}>Discover roles that match your career goals and skills</p>
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="jp-jobs-container jp-jobs-main">
        {/* Left Sidebar - Filters */}
        <motion.aside
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="jp-filters-sidebar"
          style={{
            background: "var(--bg-surface, #111118)",
            borderRight: "1px solid var(--border-subtle, rgba(255,255,255,0.06))",
            padding: "24px"
          }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="jp-filters-toggle"
            onClick={() => setExpandedFilters(!expandedFilters)}
            style={{
              background: "var(--bg-elevated, #1A1A24)",
              border: "1px solid var(--border-subtle, rgba(255,255,255,0.06))",
              color: "var(--text-primary, #F0F0FF)",
              padding: "12px 16px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: 600,
              fontSize: "0.875rem",
              marginBottom: "16px"
            }}
          >
            <svg className="jp-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px", height: "18px" }}>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <polyline points="16 7 21 12 16 17"/>
            </svg>
            <span>Filters</span>
          </motion.button>

          <div className={`jp-filters-content ${expandedFilters ? "is-expanded" : ""}`}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="jp-filter-group"
            >
              <h4 className="jp-filter-group-title" style={{
                color: "var(--text-primary, #F0F0FF)",
                fontSize: "0.875rem",
                fontWeight: 600,
                marginBottom: "12px",
                marginTop: "24px"
              }}>Location</h4>
              <div className="jp-filter-chips" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {["Remote", "San Francisco", "New York", "London", "Berlin"].map((location, index) => (
                  <motion.button
                    key={location}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + (index * 0.05), duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`jp-filter-chip ${filters.location === location ? "is-active" : ""}`}
                    onClick={() => setFilters({ ...filters, location: filters.location === location ? "" : location })}
                    style={{
                      background: filters.location === location 
                        ? "var(--brand-primary, #6C63FF)" 
                        : "var(--bg-elevated, #1A1A24)",
                      border: filters.location === location
                        ? "1px solid var(--brand-primary, #6C63FF)"
                        : "1px solid var(--border-subtle, rgba(255,255,255,0.06))",
                      color: filters.location === location
                        ? "#ffffff"
                        : "var(--text-secondary, #8888AA)",
                      padding: "8px 16px",
                      borderRadius: "999px",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      transition: "all 0.2s ease-out"
                    }}
                  >
                    {location}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <div className="jp-filter-group">
              <h4 className="jp-filter-group-title">Job Type</h4>
              <div className="jp-filter-chips">
                {["Full-time", "Part-time", "Contract", "Internship"].map((type) => (
                  <button
                    key={type}
                    className={`jp-filter-chip ${filters.jobType === type ? "is-active" : ""}`}
                    onClick={() => setFilters({ ...filters, jobType: filters.jobType === type ? "" : type })}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="jp-filter-group">
              <h4 className="jp-filter-group-title">Work Mode</h4>
              <div className="jp-filter-chips">
                {["Remote", "Hybrid", "On-site"].map((mode) => (
                  <button
                    key={mode}
                    className={`jp-filter-chip ${filters.workType === mode ? "is-active" : ""}`}
                    onClick={() => setFilters({ ...filters, workType: filters.workType === mode ? "" : mode })}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="jp-filter-group">
              <h4 className="jp-filter-group-title">Salary Range</h4>
              <div className="jp-filter-chips">
                {["$60k+", "$80k+", "$100k+", "$120k+"].map((salary) => (
                  <button
                    key={salary}
                    className={`jp-filter-chip ${filters.salary === salary ? "is-active" : ""}`}
                    onClick={() => setFilters({ ...filters, salary: filters.salary === salary ? "" : salary })}
                  >
                    {salary}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Center - Job List */}
        <motion.main
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="jp-jobs-list"
          style={{
            padding: "24px",
            flex: 1
          }}
        >
          {isLoading ? (
            <div className="jp-loading" style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "var(--text-secondary, #8888AA)",
              fontSize: "1rem"
            }}>Loading jobs...</div>
          ) : filteredJobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="jp-empty"
              style={{
                textAlign: "center",
                padding: "48px 24px",
                color: "var(--text-secondary, #8888AA)",
                fontSize: "1rem"
              }}
            >No jobs found matching your criteria</motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredJobs.map((job: Job, index) => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    layout: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`jp-job-card glass-card ${selectedJob?.id === job.id ? "is-selected" : ""}`}
                  onClick={() => setSelectedJob(job)}
                  style={{
                    background: selectedJob?.id === job.id
                      ? "rgba(108, 99, 255, 0.1)"
                      : "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(20px)",
                    border: selectedJob?.id === job.id
                      ? "1px solid var(--brand-primary, #6C63FF)"
                      : "1px solid var(--border-subtle, rgba(255,255,255,0.06))",
                    borderRadius: "16px",
                    padding: "20px",
                    marginBottom: "16px",
                    cursor: "pointer",
                    transition: "all 0.2s ease-out"
                  }}
                >
                {/* Card Header */}
                <div className="jp-job-card-header" style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "16px"
                }}>
                  <div className="jp-job-company" style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "center"
                  }}>
                    <div className="jp-company-logo" style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: "var(--brand-gradient, linear-gradient(135deg, #6C63FF 0%, #3DCFEF 100%))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      fontSize: "1.25rem",
                      fontWeight: 700
                    }}>
                      {job.company.charAt(0)}
                    </div>
                    <div>
                      <h3 className="jp-job-title" style={{
                        color: "var(--text-primary, #F0F0FF)",
                        fontSize: "1.125rem",
                        fontWeight: 600,
                        margin: 0,
                        marginBottom: "4px"
                      }}>{job.title}</h3>
                      <p className="jp-job-company-name" style={{
                        color: "var(--text-secondary, #8888AA)",
                        fontSize: "0.875rem",
                        margin: 0
                      }}>{job.company}</p>
                    </div>
                  </div>
                  <div className="jp-job-match" style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "4px"
                  }}>
                    <span className="jp-match-score" style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "var(--brand-secondary, #00D4AA)",
                      lineHeight: 1
                    }}>{getMatchScore()}%</span>
                    <span className="jp-match-label" style={{
                      fontSize: "0.75rem",
                      color: "var(--text-muted, #44445A)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>Match</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="jp-job-card-body">
                  <p className="jp-job-description">
                    {job.description?.substring(0, 150)}...
                  </p>
                  <div className="jp-job-tags">
                    <span className="jp-tag jp-tag-full-time">Full-time</span>
                    <span className="jp-tag jp-tag-remote">Remote</span>
                    <span className="jp-tag jp-tag-level">Senior</span>
                  </div>
                </div>

                {/* Why This Fits You */}
                <div className="jp-job-fit">
                  <div className="jp-fit-header">
                    <svg className="jp-fit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span>Why this fits you</span>
                  </div>
                  <ul className="jp-fit-reasons">
                    {getMatchReasons(job).map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer */}
                <div className="jp-job-card-footer">
                  <div className="jp-job-meta">
                    <div className="jp-meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span>{job.location}</span>
                    </div>
                    <div className="jp-meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <span>2d ago</span>
                    </div>
                    <div className="jp-salary">
                      ${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()}
                    </div>
                  </div>
                  <div className="jp-job-actions">
                    <button className="jp-btn jp-btn-secondary">Save</button>
                    <Link to={`/jobs/${job.id}`} className="jp-btn jp-btn-primary">
                      View
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
          )}
        </motion.main>

        {/* Right Panel - Job Preview */}
        <AnimatePresence>
          {selectedJob && (
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="jp-job-preview"
              style={{
                background: "var(--bg-surface, #111118)",
                borderLeft: "1px solid var(--border-subtle, rgba(255,255,255,0.06))",
                padding: "24px",
                overflowY: "auto",
                maxHeight: "calc(100vh - 100px)"
              }}
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="jp-preview-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "24px"
                }}
              >
                <div className="jp-preview-company" style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start"
                }}>
                  <div className="jp-company-logo jp-preview-logo" style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "16px",
                    background: "var(--brand-gradient, linear-gradient(135deg, #6C63FF 0%, #3DCFEF 100%))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontSize: "1.75rem",
                    fontWeight: 700
                  }}>
                    {selectedJob.company.charAt(0)}
                  </div>
                  <div>
                    <h2 className="jp-preview-title" style={{
                      color: "var(--text-primary, #F0F0FF)",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      margin: 0,
                      marginBottom: "8px",
                      fontFamily: "var(--font-display, Syne, sans-serif)"
                    }}>{selectedJob.title}</h2>
                    <p className="jp-preview-company" style={{
                      color: "var(--text-secondary, #8888AA)",
                      fontSize: "1rem",
                      margin: 0
                    }}>{selectedJob.company}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="jp-preview-close"
                  onClick={() => setSelectedJob(null)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--text-secondary, #8888AA)",
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "8px",
                    transition: "all 0.2s ease-out"
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "24px", height: "24px" }}>
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </motion.button>
              </motion.div>

            {/* Decision Tools */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="jp-decision-tools"
              style={{
                display: "grid",
                gap: "12px",
                marginBottom: "24px"
              }}
            >
              <motion.div
                whileHover={{ y: -4 }}
                className="jp-decision-card glass-card"
                style={{
                  background: "rgba(34, 197, 94, 0.1)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                  borderRadius: "12px",
                  padding: "16px"
                }}
              >
                <div className="jp-decision-header" style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px"
                }}>
                  <span className="jp-decision-score" style={{
                    fontSize: "1.75rem",
                    fontWeight: 700,
                    color: "#22C55E",
                    lineHeight: 1
                  }}>{getMatchScore()}%</span>
                  <span className="jp-decision-label" style={{
                    fontSize: "0.75rem",
                    color: "#22C55E",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>Match Score</span>
                </div>
                <p className="jp-decision-text" style={{
                  color: "var(--text-secondary, #8888AA)",
                  fontSize: "0.875rem",
                  margin: 0
                }}>This role aligns well with your profile and career goals.</p>
              </motion.div>

              <div className="jp-decision-card">
                <div className="jp-decision-header">
                  <svg className="jp-decision-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span className="jp-decision-label">Skill Gaps</span>
                </div>
                <p className="jp-decision-text">
                  Consider highlighting: React, TypeScript, System Design
                </p>
              </div>

              <div className="jp-decision-card">
                <div className="jp-decision-header">
                  <svg className="jp-decision-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  <span className="jp-decision-label">Salary Insight</span>
                </div>
                <p className="jp-decision-text">
                  Competitive range for your experience level
                </p>
              </div>
            </motion.div>

            {/* Job Details */}
            <div className="jp-preview-section">
              <h3 className="jp-preview-section-title">Requirements</h3>
              <ul className="jp-preview-list">
                <li>5+ years of experience</li>
                <li>Strong portfolio</li>
                <li>Experience with design systems</li>
              </ul>
            </div>

            <div className="jp-preview-section">
              <h3 className="jp-preview-section-title">Responsibilities</h3>
              <ul className="jp-preview-list">
                <li>Lead design initiatives</li>
                <li>Mentor junior designers</li>
                <li>Collaborate with product team</li>
                <li>Drive design consistency</li>
              </ul>
            </div>

            {/* Company Info */}
            <div className="jp-preview-company-info">
              <h3 className="jp-preview-section-title">About {selectedJob.company}</h3>
              <p className="jp-preview-description">
                {selectedJob.description}
              </p>
              <div className="jp-company-stats">
                <div className="jp-stat">
                  <span className="jp-stat-value">4.5</span>
                  <span className="jp-stat-label">Rating</span>
                </div>
                <div className="jp-stat">
                  <span className="jp-stat-value">156</span>
                  <span className="jp-stat-label">Reviews</span>
                </div>
                <div className="jp-stat">
                  <span className="jp-stat-value">24</span>
                  <span className="jp-stat-label">Open Jobs</span>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="jp-preview-actions"
              style={{
                position: "sticky",
                bottom: 0,
                background: "var(--bg-surface, #111118)",
                borderTop: "1px solid var(--border-subtle, rgba(255,255,255,0.06))",
                padding: "16px 0",
                marginTop: "24px"
              }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to={`/jobs/${selectedJob.id}/apply`} className="jp-btn jp-btn-primary jp-btn-large" style={{
                  display: "inline-block",
                  width: "100%",
                  textAlign: "center",
                  background: "var(--brand-gradient, linear-gradient(135deg, #6C63FF 0%, #3DCFEF 100%))",
                  color: "#ffffff",
                  padding: "14px 32px",
                  borderRadius: "999px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(108, 99, 255, 0.35)",
                  transition: "all 0.2s ease-out"
                }}>
                  Apply Now
                </Link>
              </motion.div>
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>
      </div>
    </motion.div>
  );
}
