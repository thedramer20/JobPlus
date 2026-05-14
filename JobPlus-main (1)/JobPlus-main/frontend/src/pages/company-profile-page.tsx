import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { motion } from "framer-motion";
import { ProfilePageSkeleton } from "../components/shared/content-skeletons";
import { EmptyState } from "../components/shared/empty-state";
import { JobCard } from "../components/shared/job-card";
import { getCompany } from "../services/companies-service";
import { listJobs } from "../services/jobs-service";

export function CompanyProfilePage() {
  const params = useParams();
  const companyId = Number(params.companyId);
  const { data: company, isLoading, isError } = useQuery({
    queryKey: ["companies", companyId],
    queryFn: () => getCompany(companyId),
    enabled: Number.isFinite(companyId)
  });
  const { data: jobs = [] } = useQuery({ queryKey: ["jobs", "company-profile"], queryFn: () => listJobs() });

  if (isLoading) {
    return (
      <section className="section">
        <div className="container">
          <ProfilePageSkeleton />
        </div>
      </section>
    );
  }

  if (isError || !company) {
    return (
      <section className="section">
        <div className="container">
          <EmptyState title="Company not found" description="The requested company could not be loaded." />
        </div>
      </section>
    );
  }

  return (
    <div className="jp-company-profile-page">
      {/* Hero Section */}
      <div className="jp-company-hero surface">
        <div className="container">
          <div className="jp-company-hero-content">
            <div className="jp-company-brand">
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={company.name} className="jp-company-logo" />
              ) : (
                <div className="jp-company-logo-fallback">{company.name.slice(0, 2).toUpperCase()}</div>
              )}
              <div className="jp-company-info">
                <div className="jp-eyebrow">{company.industry}</div>
                <h1 className="jp-h1">{company.name}</h1>
                <p className="jp-ui-text">{company.location} • {company.size} • {(company as any).founded ? `Founded ${(company as any).founded}` : ''}</p>
              </div>
            </div>
            <div className="jp-company-description">
              <p className="jp-body">{company.description}</p>
              {(company as any).mission && (
                <div className="jp-mission-card surface-muted">
                  <h3 className="jp-h4">Our Mission</h3>
                  <p className="jp-body">{(company as any).mission}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container jp-company-content">
        <div className="jp-company-layout">
          {/* Main Content */}
          <div className="jp-company-main">
            {/* Trust Metrics */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="jp-trust-metrics"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "24px",
                marginTop: "32px"
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="jp-metric-card surface glass-card"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "16px",
                  padding: "32px 24px"
                }}
              >
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.4 }}
                  className="jp-metric-icon"
                  style={{
                    fontSize: "2rem",
                    marginBottom: "8px"
                  }}>💼</motion.div>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.4 }}
                  className="jp-metric-content"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.4 }}
                    className="jp-metric-value"
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: 700,
                      color: "var(--brand-primary, #6C63FF)",
                      lineHeight: 1
                    }}
                  >{jobs.filter((job) => job.companyId === company.id && job.status === "Open").length}</motion.div>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.3, duration: 0.4 }}
                    className="jp-metric-label"
                    style={{
                      color: "var(--text-secondary, #8888AA)",
                      fontSize: "0.875rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>Open Positions</motion.div>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="jp-metric-card surface glass-card"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "16px",
                  padding: "32px 24px"
                }}
              >
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.4 }}
                  className="jp-metric-icon"
                  style={{
                    fontSize: "2rem",
                    marginBottom: "8px"
                  }}>🏢</motion.div>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.4 }}
                  className="jp-metric-content"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.6, duration: 0.4 }}
                    className="jp-metric-value"
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: 700,
                      color: "var(--brand-secondary, #00D4AA)",
                      lineHeight: 1
                    }}
                  >{jobs.filter((job) => job.companyId === company.id).length}</motion.div>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.7, duration: 0.4 }}
                    className="jp-metric-label"
                    style={{
                      color: "var(--text-secondary, #8888AA)",
                      fontSize: "0.875rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>Total Jobs Posted</motion.div>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="jp-metric-card surface glass-card"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "16px",
                  padding: "32px 24px"
                }}
              >
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.4 }}
                  className="jp-metric-icon"
                  style={{
                    fontSize: "2rem",
                    marginBottom: "8px"
                  }}>✅</motion.div>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.4 }}
                  className="jp-metric-content"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.3, duration: 0.4 }}
                    className="jp-metric-value"
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: 700,
                      color: "var(--brand-gradient, linear-gradient(135deg, #6C63FF 0%, #3DCFEF 100%))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      lineHeight: 1
                    }}
                  >{company.status ?? "Active"}</motion.div>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.4 }}
                    className="jp-metric-label"
                    style={{
                      color: "var(--text-secondary, #8888AA)",
                      fontSize: "0.875rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>Company Status</motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
              {(company as any).employeeCount && (
                <div className="jp-metric-card surface">
                  <div className="jp-metric-icon">👥</div>
                  <div className="jp-metric-content">
                    <div className="jp-metric-value">{(company as any).employeeCount}</div>
                    <div className="jp-metric-label">Team Size</div>
                  </div>
                </div>
              )}
            </div>

            {/* Culture Section */}
            {(company as any).culture && (
              <div className="jp-culture-section surface">
                <h2 className="jp-h2">Company Culture</h2>
                <p className="jp-body">{(company as any).culture}</p>
                {(company as any).benefits && (company as any).benefits.length > 0 && (
                  <div className="jp-benefits-grid">
                    <h3 className="jp-h3">Benefits & Perks</h3>
                    <div className="jp-benefits-list">
                      {(company as any).benefits.map((benefit: string, idx: number) => (
                        <div key={idx} className="jp-benefit-item">
                          <span className="jp-benefit-icon">✨</span>
                          <span className="jp-benefit-text">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Growth Section */}
            {(company as any).growthNotes && (
              <div className="jp-growth-section surface">
                <h2 className="jp-h2">Growth & Opportunities</h2>
                <p className="jp-body">{(company as any).growthNotes}</p>
              </div>
            )}

            {/* Open Jobs */}
            <div className="jp-jobs-section">
              <div className="jp-jobs-header">
                <div>
                  <div className="jp-eyebrow">Career Opportunities</div>
                  <h2 className="jp-h2">Open Positions at {company.name}</h2>
                </div>
                <div className="jp-jobs-count">
                  <span className="jp-ui-text">
                    {jobs.filter((job) => job.companyId === company.id && job.status === "Open").length} open roles
                  </span>
                </div>
              </div>

              <div className="jp-jobs-list">
                {jobs.filter((job) => job.companyId === company.id).slice(0, 6).map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
                {!jobs.filter((job) => job.companyId === company.id).length ? (
                  <EmptyState title="No open positions yet" description="This company hasn't published active jobs yet." />
                ) : null}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="jp-company-sidebar">
            {/* Company Overview */}
            <div className="jp-overview-card surface">
              <h3 className="jp-h3">Company Overview</h3>
              <div className="jp-overview-details">
                <div className="jp-overview-item">
                  <span className="jp-overview-label">Industry</span>
                  <span className="jp-overview-value">{company.industry}</span>
                </div>
                <div className="jp-overview-item">
                  <span className="jp-overview-label">Location</span>
                  <span className="jp-overview-value">{company.location}</span>
                </div>
                <div className="jp-overview-item">
                  <span className="jp-overview-label">Company Size</span>
                  <span className="jp-overview-value">{company.size}</span>
                </div>
                {(company as any).founded && (
                  <div className="jp-overview-item">
                    <span className="jp-overview-label">Founded</span>
                    <span className="jp-overview-value">{(company as any).founded}</span>
                  </div>
                )}
                <div className="jp-overview-item">
                  <span className="jp-overview-label">Website</span>
                  <span className="jp-overview-value">
                    {company.website ? (
                      <a href={company.website} target="_blank" rel="noreferrer" className="jp-website-link">
                        {company.website.replace(/^https?:\/\//, '')}
                      </a>
                    ) : (
                      '-'
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            {(company as any).socialLinks && (
              <div className="jp-social-card surface">
                <h4 className="jp-h4">Connect With Us</h4>
                <div className="jp-social-links">
                  {(company as any).socialLinks.linkedin && (
                    <a className="jp-social-link" href={(company as any).socialLinks.linkedin} target="_blank" rel="noreferrer">
                      <span className="jp-social-icon">💼</span>
                      LinkedIn
                    </a>
                  )}
                  {(company as any).socialLinks.twitter && (
                    <a className="jp-social-link" href={(company as any).socialLinks.twitter} target="_blank" rel="noreferrer">
                      <span className="jp-social-icon">🐦</span>
                      Twitter
                    </a>
                  )}
                  {(company as any).socialLinks.github && (
                    <a className="jp-social-link" href={(company as any).socialLinks.github} target="_blank" rel="noreferrer">
                      <span className="jp-social-icon">💻</span>
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Trust Indicators */}
            <div className="jp-trust-indicators surface">
              <h4 className="jp-h4">Why Join Us?</h4>
              <div className="jp-trust-list">
                <div className="jp-trust-item">
                  <span className="jp-trust-icon">🔒</span>
                  <span className="jp-trust-text">Verified company profile</span>
                </div>
                <div className="jp-trust-item">
                  <span className="jp-trust-icon">⚡</span>
                  <span className="jp-trust-text">Fast application process</span>
                </div>
                <div className="jp-trust-item">
                  <span className="jp-trust-icon">📈</span>
                  <span className="jp-trust-text">Career growth opportunities</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="jp-actions-card">
              <a className="btn btn-primary jp-website-btn" href={company.website || "#"} target="_blank" rel="noreferrer">
                Visit Company Website
              </a>
              <a className="btn btn-secondary jp-browse-btn" href="/jobs">
                Browse More Jobs
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
