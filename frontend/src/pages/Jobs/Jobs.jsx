// src/pages/Jobs/Jobs.jsx
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, X, Bookmark, BookmarkCheck, ExternalLink, Star, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, Input, Badge, Skeleton } from '../../components/system';
import './Jobs.css';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    remote: false,
    type: '',
    experience: '',
    salaryMin: '',
    salaryMax: '',
    companySize: '',
    industry: '',
    cultureScore: 0,
    hideGhostJobs: false
  });
  const [sortBy, setSortBy] = useState('bestMatch');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data with enhanced fields per master plan
  useEffect(() => {
    const mockJobs = [
      {
        id: 1,
        title: 'Senior React Developer',
        company: {
          id: 1,
          name: 'TechCorp Inc.',
          logo: '/api/placeholder/44/44',
          size: '500-1000',
          industry: 'Technology'
        },
        location: 'San Francisco, CA',
        remote: false,
        type: 'Full-time',
        experience: 'Senior',
        salary: { min: 120000, max: 150000, currency: 'USD' },
        skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
        postedAt: '2 days ago',
        applicantCount: 45,
        matchScore: 89,
        cultureFit: 91,
        isGhostJob: false,
        isSaved: false,
        description: 'We are looking for a Senior React Developer to join our team...',
        requirements: ['5+ years React experience', 'TypeScript proficiency', 'Node.js background'],
        benefits: ['Health insurance', '401k matching', 'Unlimited PTO']
      },
      {
        id: 2,
        title: 'Product Manager',
        company: {
          id: 2,
          name: 'InnovateLabs',
          logo: '/api/placeholder/44/44',
          size: '50-200',
          industry: 'SaaS'
        },
        location: 'Remote',
        remote: true,
        type: 'Full-time',
        experience: 'Mid',
        salary: { min: 130000, max: 160000, currency: 'USD' },
        skills: ['Product Strategy', 'Analytics', 'Agile', 'SQL'],
        postedAt: '1 week ago',
        applicantCount: 32,
        matchScore: 76,
        cultureFit: 85,
        isGhostJob: false,
        isSaved: true,
        description: 'Join our product team to drive innovation...',
        requirements: ['3+ years PM experience', 'Data-driven mindset', 'Technical background'],
        benefits: ['Remote work', 'Equity package', 'Learning budget']
      },
      {
        id: 3,
        title: 'UX Designer',
        company: {
          id: 3,
          name: 'DesignStudio',
          logo: '/api/placeholder/44/44',
          size: '10-50',
          industry: 'Design'
        },
        location: 'New York, NY',
        remote: false,
        type: 'Full-time',
        experience: 'Mid',
        salary: { min: 90000, max: 120000, currency: 'USD' },
        skills: ['UX Design', 'Figma', 'User Research', 'Prototyping'],
        postedAt: '3 days ago',
        applicantCount: 28,
        matchScore: 82,
        cultureFit: 78,
        isGhostJob: true, // This is a ghost job
        isSaved: false,
        description: 'Create amazing user experiences...',
        requirements: ['3+ years UX experience', 'Figma expertise', 'Portfolio required'],
        benefits: ['Creative freedom', 'Design conferences', 'Flexible hours']
      }
    ];

    setTimeout(() => {
      setJobs(mockJobs);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveToggle = async (jobId) => {
    setJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, isSaved: !job.isSaved } : job
    ));
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !filters.search ||
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.company.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(filters.search.toLowerCase()));

    const matchesLocation = !filters.location ||
      job.location.toLowerCase().includes(filters.location.toLowerCase());

    const matchesRemote = !filters.remote || job.remote;

    const matchesType = !filters.type || job.type === filters.type;

    const matchesExperience = !filters.experience || job.experience === filters.experience;

    const matchesSalary = (!filters.salaryMin || job.salary.min >= parseInt(filters.salaryMin)) &&
                         (!filters.salaryMax || job.salary.max <= parseInt(filters.salaryMax));

    const matchesCultureScore = job.cultureFit >= filters.cultureScore;

    const matchesGhostJobs = !filters.hideGhostJobs || !job.isGhostJob;

    return matchesSearch && matchesLocation && matchesRemote && matchesType &&
           matchesExperience && matchesSalary && matchesCultureScore && matchesGhostJobs;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case 'mostRecent': return new Date(b.postedAt) - new Date(a.postedAt);
      case 'highestSalary': return b.salary.max - a.salary.max;
      case 'mostApplicants': return b.applicantCount - a.applicantCount;
      case 'leastApplicants': return a.applicantCount - b.applicantCount;
      case 'bestMatch':
      default: return b.matchScore - a.matchScore;
    }
  });

  const JobCard = ({ job, isSelected, onClick }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`job-card cursor-pointer transition-all duration-200 ${
          isSelected ? 'ring-2 ring-brand-primary bg-bg-elevated' : 'hover:shadow-lg'
        }`}
        onClick={onClick}
      >
        <div className="job-card__header">
          <div className="job-card__company">
            <img src={job.company.logo} alt={job.company.name} className="company-logo" />
            <div>
              <h3 className="job-title">{job.title}</h3>
              <p className="company-name">{job.company.name}</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSaveToggle(job.id);
            }}
            className="save-button"
          >
            {job.isSaved ? <BookmarkCheck size={20} className="text-accent" /> : <Bookmark size={20} />}
          </button>
        </div>

        <div className="job-card__details">
          <div className="location">
            <MapPin size={16} />
            <span>{job.location}{job.remote && ' (Remote)'}</span>
          </div>
          <div className="salary">
            ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
          </div>
        </div>

        <div className="job-card__skills">
          {job.skills.slice(0, 4).map(skill => (
            <Badge key={skill} variant="secondary" size="sm">{skill}</Badge>
          ))}
          {job.skills.length > 4 && <Badge variant="outline" size="sm">+{job.skills.length - 4}</Badge>}
        </div>

        <div className="job-card__footer">
          <div className="job-meta">
            <span className="posted-at">{job.postedAt}</span>
            <span className="applicants">{job.applicantCount} applicants</span>
          </div>

          <div className="job-scores">
            <div className="match-score">
              <span className="score">{job.matchScore}% match</span>
            </div>
            <div className="culture-fit">
              <Star size={14} className="text-warning" />
              <span>{job.cultureFit}% culture fit</span>
            </div>
            {job.isGhostJob && (
              <div className="ghost-job-warning">
                <AlertTriangle size={14} className="text-danger" />
                <span>Potential ghost job</span>
              </div>
            )}
          </div>
        </div>

        <div className="job-card__actions">
          <Button variant="primary" size="sm" className="apply-button">
            {job.matchScore > 80 ? 'Easy Apply' : 'Apply Now'}
          </Button>
        </div>
      </Card>
    </motion.div>
  );

  const JobDetailPanel = ({ job }) => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="job-detail-panel"
    >
      <Card className="job-detail-card">
        <div className="job-detail__header">
          <div className="company-info">
            <img src={job.company.logo} alt={job.company.name} className="company-logo-large" />
            <div>
              <h1 className="job-title-large">{job.title}</h1>
              <p className="company-name-large">{job.company.name}</p>
              <div className="job-meta-large">
                <span>{job.location}{job.remote && ' (Remote)'}</span>
                <span>•</span>
                <span>{job.type}</span>
                <span>•</span>
                <span>${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="job-actions">
            <Button variant="ghost" size="sm">
              <Bookmark size={18} />
              Save
            </Button>
            <Button variant="ghost" size="sm">
              <ExternalLink size={18} />
              Share
            </Button>
            <Button variant="primary" size="md">
              Apply Now
            </Button>
          </div>
        </div>

        <div className="job-detail__content">
          <div className="application-status">
            <Badge variant={job.applicantCount < 50 ? "success" : "warning"}>
              {job.applicantCount} applicants • Typically responds in 2-3 days
            </Badge>
          </div>

          <div className="scores-section">
            <div className="score-item">
              <div className="score-label">Match Score</div>
              <div className="score-value">{job.matchScore}%</div>
              <div className="score-bar">
                <div className="score-fill" style={{ width: `${job.matchScore}%` }}></div>
              </div>
            </div>
            <div className="score-item">
              <div className="score-label">Culture Fit</div>
              <div className="score-value">{job.cultureFit}%</div>
              <div className="score-bar">
                <div className="score-fill" style={{ width: `${job.cultureFit}%` }}></div>
              </div>
            </div>
          </div>

          <div className="job-section">
            <h3>About the Role</h3>
            <p>{job.description}</p>
          </div>

          <div className="job-section">
            <h3>Requirements</h3>
            <ul>
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          <div className="job-section">
            <h3>Benefits</h3>
            <ul>
              {job.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>

          <div className="job-section">
            <h3>About {job.company.name}</h3>
            <div className="company-stats">
              <div className="stat">
                <span className="stat-label">Industry</span>
                <span className="stat-value">{job.company.industry}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Company Size</span>
                <span className="stat-value">{job.company.size} employees</span>
              </div>
            </div>
          </div>

          <div className="ai-features">
            <Button variant="ghost" className="ai-button">
              🤖 Ask AI about this job
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="jobs-page">
        <div className="jobs-loading">
          <Skeleton className="h-8 w-64 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2 mb-4" />
                <Skeleton className="h-20 w-full mb-4" />
                <Skeleton className="h-8 w-24" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="jobs-page">
      {/* Top Search Bar */}
      <div className="jobs-header">
        <div className="search-bar">
          <div className="search-input-group">
            <Search size={20} />
            <Input
              placeholder="Job title, company, or skills"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="search-input"
            />
          </div>
          <div className="search-input-group">
            <MapPin size={20} />
            <Input
              placeholder="Location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="search-input"
            />
          </div>
          <Button
            variant="ghost"
            onClick={() => setShowFilters(!showFilters)}
            className="filter-toggle"
          >
            <Filter size={20} />
            Filters
          </Button>
        </div>
      </div>

      <div className="jobs-content">
        {/* Left Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="filters-panel"
            >
              <Card className="filters-card">
                <div className="filters-header">
                  <h3>Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                  >
                    <X size={18} />
                  </Button>
                </div>

                <div className="filters-content">
                  {/* Job Type */}
                  <div className="filter-group">
                    <label>Job Type</label>
                    <select
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                    >
                      <option value="">All Types</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  {/* Experience Level */}
                  <div className="filter-group">
                    <label>Experience Level</label>
                    <select
                      value={filters.experience}
                      onChange={(e) => handleFilterChange('experience', e.target.value)}
                    >
                      <option value="">All Levels</option>
                      <option value="Entry">Entry Level</option>
                      <option value="Mid">Mid Level</option>
                      <option value="Senior">Senior Level</option>
                      <option value="Executive">Executive</option>
                    </select>
                  </div>

                  {/* Salary Range */}
                  <div className="filter-group">
                    <label>Salary Range (USD)</label>
                    <div className="salary-inputs">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.salaryMin}
                        onChange={(e) => handleFilterChange('salaryMin', e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.salaryMax}
                        onChange={(e) => handleFilterChange('salaryMax', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Culture Score Filter */}
                  <div className="filter-group">
                    <label>Minimum Culture Fit</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.cultureScore}
                      onChange={(e) => handleFilterChange('cultureScore', parseInt(e.target.value))}
                      className="culture-slider"
                    />
                    <span>{filters.cultureScore}%</span>
                  </div>

                  {/* Ghost Job Filter */}
                  <div className="filter-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={filters.hideGhostJobs}
                        onChange={(e) => handleFilterChange('hideGhostJobs', e.target.checked)}
                      />
                      Hide potential ghost jobs
                    </label>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Job Listings */}
        <div className="jobs-listings">
          <div className="listings-header">
            <div className="results-count">
              {sortedJobs.length} jobs found
            </div>
            <div className="sort-options">
              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="bestMatch">Best Match</option>
                <option value="mostRecent">Most Recent</option>
                <option value="highestSalary">Highest Salary</option>
                <option value="mostApplicants">Most Applicants</option>
                <option value="leastApplicants">Least Applicants</option>
              </select>
            </div>
          </div>

          <div className="jobs-grid">
            {sortedJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                isSelected={selectedJob?.id === job.id}
                onClick={() => setSelectedJob(job)}
              />
            ))}
          </div>
        </div>

        {/* Job Detail Panel */}
        <AnimatePresence>
          {selectedJob && (
            <JobDetailPanel job={selectedJob} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Jobs;
