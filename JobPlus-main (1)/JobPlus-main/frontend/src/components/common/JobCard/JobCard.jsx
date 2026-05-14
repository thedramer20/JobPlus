// src/components/common/JobCard/JobCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Bookmark, BookmarkCheck } from 'lucide-react';
import './JobCard.css';

const JobCard = ({ job, onSaveToggle }) => {
  const [isSaved, setIsSaved] = useState(job.isSaved || false);

  const handleSaveToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // Call API to toggle save
      await onSaveToggle?.(job.id, !isSaved);
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Failed to toggle save:', error);
    }
  };

  return (
    <Link to={`/jobs/${job.id}`} className="job-card">
      <div className="job-card__header">
        <div className="job-card__logo">
          <img src={job.company.logo || '/api/placeholder/44/44'} alt={job.company.name} />
        </div>

        <div className="job-card__actions">
          <div className="job-card__match">
            {job.matchScore}% match
          </div>
          <button
            className={`job-card__save ${isSaved ? 'job-card__save--saved' : ''}`}
            onClick={handleSaveToggle}
            aria-label={isSaved ? 'Unsave job' : 'Save job'}
          >
            {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>
        </div>
      </div>

      <div className="job-card__content">
        <h3 className="job-card__title">{job.title}</h3>
        <p className="job-card__company">{job.company.name}</p>

        <div className="job-card__meta">
          <div className="job-card__meta-item">
            <MapPin size={14} />
            <span>{job.location}</span>
          </div>
          <div className="job-card__meta-item">
            <Clock size={14} />
            <span>{job.type}</span>
          </div>
          <div className="job-card__meta-item">
            <DollarSign size={14} />
            <span>{job.salary}</span>
          </div>
        </div>

        <div className="job-card__tags">
          {job.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="job-card__tag">{tag}</span>
          ))}
        </div>

        <div className="job-card__footer">
          <span className="job-card__posted">{job.postedAt}</span>
          <span className="job-card__applicants">{job.applicantCount} applicants</span>
        </div>
      </div>

      {/* Shimmer border */}
      <div className="job-card__shimmer"></div>
    </Link>
  );
};

export default JobCard;