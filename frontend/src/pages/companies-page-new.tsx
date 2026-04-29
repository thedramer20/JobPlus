
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listCompanies } from "../services/companies-service";
import "../styles/companies-page-new.css";

export function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const { data: companies = [], isLoading, isError } = useQuery({
    queryKey: ["companies"],
    queryFn: listCompanies
  });

  const filterOptions = [
    { id: "industry", label: "Industry", options: ["Technology", "Finance", "Healthcare", "Design", "Marketing"] },
    { id: "location", label: "Location", options: ["Remote", "San Francisco", "New York", "London", "Berlin"] },
    { id: "size", label: "Size", options: ["1-10", "11-50", "51-200", "201-500", "500+"] },
    { id: "hiring", label: "Hiring", options: ["Actively Hiring", "Just Posted", "High Growth"] }
  ];

  const featuredCompanies = companies.slice(0, 4);
  const mainCompanies = companies.slice(4);

  const insights = [
    { type: "fastest-growing", label: "Fastest Growing", companies: companies.slice(0, 3) },
    { type: "highest-paying", label: "Highest Paying", companies: companies.slice(3, 6) },
    { type: "most-hiring", label: "Most Hiring", companies: companies.slice(6, 9) }
  ];

  const getMatchReason = (company: any) => {
    const reasons = [
      "Your skills align with their tech stack",
      "Similar companies you've viewed",
      "High growth in your field",
      "Strong culture fit indicators",
      "Competitive benefits package"
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  const getRating = () => (Math.random() * (5 - 3.5) + 3.5).toFixed(1);

  const getOpenJobs = () => Math.floor(Math.random() * 20) + 1;

  return (
    <div className="jp-companies-root">
      {/* TOP SECTION */}
      <section className="jp-companies-hero jp-reveal-up">
        <div className="jp-companies-container">
          <div className="jp-companies-header">
            <h1 className="jp-companies-title">Discover companies that match your ambition</h1>
            <p className="jp-companies-subtitle">
              Explore employer brands, culture insights, and opportunities that align with your career goals.
            </p>
          </div>

          {/* Search Bar */}
          <div className="jp-companies-search">
            <div className="jp-search-wrapper">
              <svg className="jp-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                className="jp-search-input"
                placeholder="Search companies, industries, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="jp-search-button">Search</button>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="jp-companies-filters">
            {filterOptions.map((filter) => (
              <div key={filter.id} className="jp-filter-group">
                <span className="jp-filter-label">{filter.label}</span>
                <div className="jp-filter-chips">
                  {filter.options.map((option) => (
                    <button
                      key={option}
                      className={`jp-filter-chip ${selectedFilters[filter.id] === option ? 'is-active' : ''}`}
                      onClick={() => {
                        setSelectedFilters(prev => ({
                          ...prev,
                          [filter.id]: prev[filter.id] === option ? '' : option
                        }));
                        setActiveFilter(filter.id);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED COMPANIES */}
      <section className="jp-featured-companies jp-reveal-stagger">
        <div className="jp-companies-container">
          <div className="jp-section-header">
            <h2 className="jp-section-title">Featured Companies</h2>
            <Link to="/companies" className="jp-link jp-link-primary">View all →</Link>
          </div>

          <div className="jp-featured-scroll">
            {featuredCompanies.map((company) => (
              <Link key={company.id} to={`/companies/${company.id}`} className="jp-featured-card">
                <div className="jp-featured-logo">
                  {company.logoUrl ? (
                    <img src={company.logoUrl} alt={company.name} />
                  ) : (
                    <span>{company.name.charAt(0)}</span>
                  )}
                </div>
                <div className="jp-featured-content">
                  <h3 className="jp-featured-name">{company.name}</h3>
                  <p className="jp-featured-tagline">{company.description?.substring(0, 100)}...</p>
                  <div className="jp-featured-meta">
                    <span className="jp-featured-industry">{company.industry}</span>
                    <span className="jp-featured-location">{company.location}</span>
                  </div>
                  <div className="jp-featured-status">
                    <span className="jp-status-badge jp-status-hiring">Actively Hiring</span>
                    <span className="jp-open-jobs">{getOpenJobs()} open positions</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* COMPANY INSIGHT STRIP */}
      <section className="jp-companies-insights jp-reveal-stagger">
        <div className="jp-companies-container">
          <div className="jp-insights-grid">
            {insights.map((insight) => (
              <div key={insight.type} className="jp-insight-card">
                <div className="jp-insight-header">
                  <span className="jp-insight-icon">
                    {insight.type === "fastest-growing" && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                        <polyline points="17 6 23 6 23 12"/>
                      </svg>
                    )}
                    {insight.type === "highest-paying" && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                    )}
                    {insight.type === "most-hiring" && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                    )}
                  </span>
                  <h3 className="jp-insight-title">{insight.label}</h3>
                </div>
                <div className="jp-insight-companies">
                  {insight.companies.map((company) => (
                    <Link key={company.id} to={`/companies/${company.id}`} className="jp-insight-company">
                      <span className="jp-insight-company-logo">{company.name.charAt(0)}</span>
                      <span className="jp-insight-company-name">{company.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN GRID */}
      <section className="jp-companies-main jp-reveal-stagger">
        <div className="jp-companies-container">
          <div className="jp-section-header">
            <h2 className="jp-section-title">All Companies</h2>
            <div className="jp-sort-options">
              <button className={`jp-sort-option ${activeFilter === 'relevance' ? 'is-active' : ''}`}>
                Most Relevant
              </button>
              <button className={`jp-sort-option ${activeFilter === 'newest' ? 'is-active' : ''}`}>
                Newest
              </button>
              <button className={`jp-sort-option ${activeFilter === 'rating' ? 'is-active' : ''}`}>
                Highest Rated
              </button>
            </div>
          </div>

          <div className="jp-companies-grid">
            {isLoading ? (
              <div className="jp-loading">Loading companies...</div>
            ) : isError ? (
              <div className="jp-error">Could not load companies</div>
            ) : mainCompanies.length === 0 ? (
              <div className="jp-empty">No companies found matching your criteria</div>
            ) : (
              mainCompanies.map((company) => (
                <Link key={company.id} to={`/companies/${company.id}`} className="jp-company-card jp-reveal">
                  <div className="jp-company-card-header">
                    <div className="jp-company-logo-wrapper">
                      {company.logoUrl ? (
                        <img src={company.logoUrl} alt={company.name} />
                      ) : (
                        <span className="jp-company-logo-placeholder">{company.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="jp-company-rating">
                      <span className="jp-rating-value">{getRating()}</span>
                      <svg className="jp-rating-star" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                  </div>

                  <div className="jp-company-card-body">
                    <h3 className="jp-company-name">{company.name}</h3>
                    <p className="jp-company-description">{company.description?.substring(0, 120)}...</p>

                    <div className="jp-company-meta">
                      <div className="jp-meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <span>{company.location}</span>
                      </div>
                      <div className="jp-meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        <span>{company.size}</span>
                      </div>
                      <div className="jp-meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                        </svg>
                        <span>{company.industry}</span>
                      </div>
                    </div>

                    <div className="jp-company-tags">
                      <span className="jp-tag jp-tag-remote">Remote</span>
                      <span className="jp-tag jp-tag-startup">Startup</span>
                      <span className="jp-tag jp-tag-hiring">Hiring</span>
                    </div>

                    <div className="jp-company-match">
                      <div className="jp-match-header">
                        <svg className="jp-match-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span className="jp-match-label">Why this company matches you</span>
                      </div>
                      <p className="jp-match-reason">{getMatchReason(company)}</p>
                    </div>
                  </div>

                  <div className="jp-company-card-footer">
                    <div className="jp-open-jobs-count">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      <span>{getOpenJobs()} open positions</span>
                    </div>
                    <span className="jp-view-jobs">View jobs →</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
