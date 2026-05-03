// src/pages/CompanyProfile/CompanyProfile.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Users, Calendar, ExternalLink, Star, Globe, Building } from 'lucide-react';
import JobCard from '../../components/common/JobCard/JobCard';
import './CompanyProfile.css';

const CompanyProfile = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with API call
    const mockCompany = {
      id: 1,
      name: 'TechCorp Inc.',
      logo: '/api/placeholder/120/120',
      coverImage: '/api/placeholder/1200/400',
      description: 'Leading technology company focused on innovative solutions for the modern workplace.',
      industry: 'Technology',
      size: '1000-5000',
      founded: '2015',
      website: 'https://techcorp.com',
      location: 'San Francisco, CA',
      culture: {
        values: ['Innovation', 'Collaboration', 'Excellence'],
        benefits: ['Health Insurance', '401k', 'Remote Work', 'Flexible Hours'],
        perks: ['Free Lunch', 'Gym Membership', 'Learning Budget']
      },
      stats: {
        employees: 2500,
        rating: 4.2,
        reviews: 847,
        openJobs: 12
      }
    };

    const mockJobs = [
      {
        id: 1,
        title: 'Senior React Developer',
        company: mockCompany,
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: '$120k - $150k',
        tags: ['React', 'TypeScript', 'Node.js'],
        postedAt: '2 days ago',
        applicantCount: 45,
        matchScore: 89,
        isSaved: false
      },
      {
        id: 2,
        title: 'Product Manager',
        company: mockCompany,
        location: 'Remote',
        type: 'Full-time',
        salary: '$130k - $160k',
        tags: ['Product', 'Strategy', 'Analytics'],
        postedAt: '1 week ago',
        applicantCount: 32,
        matchScore: 76,
        isSaved: true
      }
    ];

    setTimeout(() => {
      setCompany(mockCompany);
      setJobs(mockJobs);
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="company-profile">
        <div className="company-profile__loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="company-profile">
        <div className="company-profile__error">
          <h2>Company not found</h2>
          <Link to="/companies" className="btn btn--primary">Browse Companies</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="company-profile">
      {/* HEADER */}
      <div className="company-profile__header">
        <div className="company-profile__cover">
          <img src={company.coverImage} alt={company.name} />
        </div>

        <div className="company-profile__header-content">
          <div className="company-profile__logo">
            <img src={company.logo} alt={company.name} />
          </div>

          <div className="company-profile__info">
            <h1 className="company-profile__name">{company.name}</h1>
            <div className="company-profile__meta">
              <span className="company-profile__industry">{company.industry}</span>
              <span className="company-profile__size">{company.size} employees</span>
              <span className="company-profile__location">
                <MapPin size={14} />
                {company.location}
              </span>
            </div>
          </div>

          <div className="company-profile__actions">
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--outline"
            >
              <Globe size={16} />
              Visit Website
            </a>
            <button className="btn btn--primary">
              Follow Company
            </button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="company-profile__stats">
        <div className="stat-card">
          <Users size={20} />
          <div>
            <strong>{company.stats.employees.toLocaleString()}</strong>
            <span>Employees</span>
          </div>
        </div>
        <div className="stat-card">
          <Star size={20} />
          <div>
            <strong>{company.stats.rating}</strong>
            <span>Rating ({company.stats.reviews} reviews)</span>
          </div>
        </div>
        <div className="stat-card">
          <Building size={20} />
          <div>
            <strong>{company.stats.openJobs}</strong>
            <span>Open Jobs</span>
          </div>
        </div>
        <div className="stat-card">
          <Calendar size={20} />
          <div>
            <strong>{company.founded}</strong>
            <span>Founded</span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="company-profile__content">
        {/* ABOUT */}
        <section className="company-section">
          <h2>About {company.name}</h2>
          <p className="company-description">{company.description}</p>
        </section>

        {/* CULTURE */}
        <section className="company-section">
          <h2>Company Culture</h2>

          <div className="culture-grid">
            <div className="culture-card">
              <h3>Values</h3>
              <div className="culture-tags">
                {company.culture.values.map(value => (
                  <span key={value} className="culture-tag">{value}</span>
                ))}
              </div>
            </div>

            <div className="culture-card">
              <h3>Benefits</h3>
              <div className="culture-tags">
                {company.culture.benefits.map(benefit => (
                  <span key={benefit} className="culture-tag">{benefit}</span>
                ))}
              </div>
            </div>

            <div className="culture-card">
              <h3>Perks</h3>
              <div className="culture-tags">
                {company.culture.perks.map(perk => (
                  <span key={perk} className="culture-tag">{perk}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* OPEN JOBS */}
        <section className="company-section">
          <div className="section-header">
            <h2>Open Positions</h2>
            <Link to="/jobs" className="btn btn--ghost">
              View All Jobs
              <ExternalLink size={16} />
            </Link>
          </div>

          <div className="jobs-grid">
            {jobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onSaveToggle={(jobId, saved) => {
                  // Handle save toggle
                  console.log('Toggle save:', jobId, saved);
                }}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CompanyProfile;