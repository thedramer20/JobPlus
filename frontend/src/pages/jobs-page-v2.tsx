
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listJobs } from "../services/jobs-service";
import type { Job } from "../types/job";
import "../styles/jobs-page-v2.css";

export function JobsPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    jobType: "",
    salary: "",
    workType: ""
  });

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
        const minSalary = parseInt(filters.salary.replace(/[^0-9]/g, ""));
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
  const getAverageMatch = () => Math.floor(filteredJobs.reduce((acc: number) => acc + getMatchScore(), 0) / filteredJobs.length) || 0;

  return (
    <div className="jp-jobs-root">
      {/* Header */}
      <header className="jp-jobs-header">
        <div className="jp-jobs-container">
          <div className="jp-jobs-title">
            <h1>Find Your Next Opportunity</h1>
            <p>Discover roles that match your career goals and skills</p>
          </div>

          {/* Info Bar */}
          <div className="jp-info-bar">
            <div className="jp-info-item">
              <span className="jp-info-value">{filteredJobs.length}</span>
              <span className="jp-info-label">Jobs</span>
            </div>
            <div className="jp-info-item">
              <span className="jp-info-value">{getAverageMatch()}%</span>
              <span className="jp-info-label">Avg Match</span>
            </div>
            <div className="jp-info-item">
              <span className="jp-info-value">Updated</span>
              <span className="jp-info-label">Just now</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="jp-jobs-container jp-jobs-main">
        {/* Left Sidebar - Filters */}
        <aside className="jp-filters-sidebar">
          <div className="jp-filters-panel">
            <div className="jp-filters-panel-head">
              <h3>Refine jobs</h3>
              <button
                type="button"
                className="jp-filters-clear"
                onClick={() =>
                  setFilters({
                    search: "",
                    location: "",
                    jobType: "",
                    salary: "",
                    workType: ""
                  })
                }
              >
                Clear all
              </button>
            </div>

            <div className="jp-filter-row">
              <span className="jp-filter-group-title">Location</span>
              <div className="jp-filter-chips">
                {["Remote", "San Francisco", "New York", "London", "Berlin"].map((location) => (
                  <button
                    key={location}
                    type="button"
                    className={`jp-filter-chip ${filters.location === location ? "is-active" : ""}`}
                    onClick={() => setFilters({ ...filters, location: filters.location === location ? "" : location })}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>

            <div className="jp-filter-row">
              <span className="jp-filter-group-title">Job Type</span>
              <div className="jp-filter-chips">
                {["Full-time", "Part-time", "Contract", "Internship"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`jp-filter-chip ${filters.jobType === type ? "is-active" : ""}`}
                    onClick={() => setFilters({ ...filters, jobType: filters.jobType === type ? "" : type })}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="jp-filter-row">
              <span className="jp-filter-group-title">Work Mode</span>
              <div className="jp-filter-chips">
                {["Remote", "Hybrid", "On-site"].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={`jp-filter-chip ${filters.workType === mode ? "is-active" : ""}`}
                    onClick={() => setFilters({ ...filters, workType: filters.workType === mode ? "" : mode })}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="jp-filter-row">
              <span className="jp-filter-group-title">Salary Range</span>
              <div className="jp-filter-chips">
                {["$60k+", "$80k+", "$100k+", "$120k+"].map((salary) => (
                  <button
                    key={salary}
                    type="button"
                    className={`jp-filter-chip ${filters.salary === salary ? "is-active" : ""}`}
                    onClick={() => setFilters({ ...filters, salary: filters.salary === salary ? "" : salary })}
                  >
                    {salary}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Center - Job List */}
        <main className="jp-jobs-list">
          {isLoading ? (
            <div className="jp-loading">Loading jobs...</div>
          ) : filteredJobs.length === 0 ? (
            <div className="jp-empty">No jobs found matching your criteria</div>
          ) : (
            filteredJobs.map((job: Job) => (
              <div
                key={job.id}
                className={`jp-job-card ${selectedJob?.id === job.id ? "is-selected" : ""}`}
                onClick={() => setSelectedJob(job)}
              >
                {/* Card Header */}
                <div className="jp-job-card-header">
                  <div className="jp-job-company">
                    <div className="jp-company-logo">
                      {job.company.charAt(0)}
                    </div>
                    <div>
                      <h3 className="jp-job-title">{job.title}</h3>
                      <p className="jp-job-company-name">{job.company}</p>
                    </div>
                  </div>
                  <div className="jp-job-match">
                    <span className="jp-match-score">{getMatchScore()}%</span>
                  </div>
                </div>

                {/* Location */}
                <div className="jp-job-location">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>{job.location}</span>
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
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                    <button className="jp-btn jp-btn-save">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                      </svg>
                    </button>
                    <Link to={`/jobs/${job.id}`} className="jp-btn jp-btn-primary">
                      View
                    </Link>
                    <Link to={`/jobs/${job.id}/apply`} className="jp-btn jp-btn-apply">
                      Apply
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </main>

        {/* Right Panel - Job Preview */}
        {selectedJob && (
          <aside className="jp-job-preview">
            <div className="jp-preview-header">
              <div className="jp-preview-company">
                <div className="jp-company-logo jp-preview-logo">
                  {selectedJob.company.charAt(0)}
                </div>
                <div>
                  <h2 className="jp-preview-title">{selectedJob.title}</h2>
                  <p className="jp-preview-company">{selectedJob.company}</p>
                </div>
              </div>
              <button
                className="jp-preview-close"
                onClick={() => setSelectedJob(null)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Decision Tools */}
            <div className="jp-decision-tools">
              <div className="jp-decision-card">
                <div className="jp-decision-header">
                  <span className="jp-decision-score">{getMatchScore()}%</span>
                  <span className="jp-decision-label">Match Score</span>
                </div>
                <p className="jp-decision-text">
                  This role aligns well with your profile and career goals.
                </p>
              </div>

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
            </div>

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
            <div className="jp-preview-actions">
              <Link to={`/jobs/${selectedJob.id}/apply`} className="jp-btn jp-btn-primary jp-btn-large">
                Apply Now
              </Link>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
