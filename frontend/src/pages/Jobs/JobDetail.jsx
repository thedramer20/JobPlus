// src/pages/Jobs/JobDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Bookmark, BookmarkCheck, ArrowLeft, Share2, ExternalLink } from 'lucide-react';
import './JobDetail.css';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Mock data - replace with API call
    const mockJob = {
      id: 1,
      title: 'Senior React Developer',
      company: {
        id: 1,
        name: 'TechCorp Inc.',
        logo: '/api/placeholder/80/80',
        description: 'Leading technology company focused on innovative solutions.',
        website: 'https://techcorp.com',
        size: '1000-5000 employees',
        industry: 'Technology'
      },
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120k - $150k',
      postedAt: '2 days ago',
      description: `
        <h3>About the Role</h3>
        <p>We are looking for a Senior React Developer to join our dynamic team. You will be responsible for building and maintaining high-quality web applications using modern React patterns and best practices.</p>

        <h3>Responsibilities</h3>
        <ul>
          <li>Develop and maintain React applications</li>
          <li>Collaborate with design and backend teams</li>
          <li>Write clean, maintainable, and efficient code</li>
          <li>Participate in code reviews and mentoring</li>
          <li>Stay up-to-date with latest React developments</li>
        </ul>

        <h3>Requirements</h3>
        <ul>
          <li>5+ years of React development experience</li>
          <li>Strong TypeScript skills</li>
          <li>Experience with state management (Redux, Zustand)</li>
          <li>Familiarity with testing frameworks</li>
          <li>Knowledge of modern build tools and CI/CD</li>
        </ul>

        <h3>What We Offer</h3>
        <ul>
          <li>Competitive salary and equity</li>
          <li>Comprehensive health benefits</li>
          <li>Flexible work arrangements</li>
          <li>Professional development budget</li>
          <li>Modern office with great amenities</li>
        </ul>
      `,
      tags: ['React', 'TypeScript', 'Node.js', 'Redux'],
      matchScore: 89,
      applicationCount: 45,
      benefits: ['Health Insurance', '401k', 'Remote Work', 'Flexible Hours'],
      requirements: ['5+ years experience', 'TypeScript', 'React', 'Node.js']
    };

    setTimeout(() => {
      setJob(mockJob);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleSaveToggle = async () => {
    // Mock save toggle
    setIsSaved(!isSaved);
  };

  const handleApply = () => {
    // Mock apply functionality
    alert('Application submitted successfully!');
  };

  if (loading) {
    return (
      <div className="job-detail">
        <div className="job-detail__loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="job-detail">
        <div className="job-detail__error">
          <h2>Job not found</h2>
          <Link to="/jobs" className="btn btn--primary">Browse Jobs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="job-detail">
      {/* HEADER */}
      <div className="job-detail__header">
        <div className="job-detail__nav">
          <Link to="/jobs" className="back-link">
            <ArrowLeft size={20} />
            Back to Jobs
          </Link>
        </div>

        <div className="job-detail__header-content">
          <div className="job-detail__company">
            <img src={job.company.logo} alt={job.company.name} />
            <div>
              <h1>{job.title}</h1>
              <Link to={`/companies/${job.company.id}`} className="company-link">
                {job.company.name}
                <ExternalLink size={14} />
              </Link>
            </div>
          </div>

          <div className="job-detail__actions">
            <button
              className={`btn ${isSaved ? 'btn--outline' : 'btn--ghost'}`}
              onClick={handleSaveToggle}
            >
              {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              {isSaved ? 'Saved' : 'Save Job'}
            </button>
            <button className="btn btn--ghost">
              <Share2 size={18} />
              Share
            </button>
            <button className="btn btn--primary" onClick={handleApply}>
              Apply Now
            </button>
          </div>
        </div>

        <div className="job-detail__meta">
          <div className="meta-item">
            <MapPin size={16} />
            <span>{job.location}</span>
          </div>
          <div className="meta-item">
            <Clock size={16} />
            <span>{job.type}</span>
          </div>
          <div className="meta-item">
            <DollarSign size={16} />
            <span>{job.salary}</span>
          </div>
          <div className="meta-item match-score">
            <span>{job.matchScore}% match</span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="job-detail__content">
        <div className="job-detail__main">
          {/* DESCRIPTION */}
          <section className="job-section">
            <h2>Job Description</h2>
            <div
              className="job-description"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </section>

          {/* REQUIREMENTS */}
          <section className="job-section">
            <h2>Requirements</h2>
            <div className="requirements-grid">
              {job.requirements.map((req, index) => (
                <div key={index} className="requirement-item">
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </section>

          {/* BENEFITS */}
          <section className="job-section">
            <h2>Benefits & Perks</h2>
            <div className="benefits-grid">
              {job.benefits.map((benefit, index) => (
                <div key={index} className="benefit-item">
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* SIDEBAR */}
        <div className="job-detail__sidebar">
          <div className="sidebar-card">
            <h3>Company Overview</h3>
            <div className="company-overview">
              <p>{job.company.description}</p>
              <div className="company-stats">
                <div className="stat">
                  <span className="stat-label">Industry</span>
                  <span className="stat-value">{job.company.industry}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Company Size</span>
                  <span className="stat-value">{job.company.size}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Website</span>
                  <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="stat-link">
                    {job.company.website}
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar-card">
            <h3>Job Details</h3>
            <div className="job-details">
              <div className="detail-item">
                <span className="detail-label">Posted</span>
                <span className="detail-value">{job.postedAt}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Applications</span>
                <span className="detail-value">{job.applicationCount}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Job Type</span>
                <span className="detail-value">{job.type}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Location</span>
                <span className="detail-value">{job.location}</span>
              </div>
            </div>
          </div>

          <div className="sidebar-card">
            <h3>Similar Jobs</h3>
            <div className="similar-jobs">
              <div className="similar-job">
                <h4>Frontend Developer</h4>
                <p>Similar Company</p>
                <span>$95k - $125k</span>
              </div>
              <div className="similar-job">
                <h4>React Engineer</h4>
                <p>Another Company</p>
                <span>$110k - $140k</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;