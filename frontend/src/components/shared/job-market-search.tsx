import { useState, useMemo } from "react";
import { SearchInput } from "./search-input";

interface JobMarketSearchProps {
  query: string;
  onApply: (query: string) => void;
}

export function JobMarketSearch({ query, onApply }: JobMarketSearchProps) {
  const [draftQuery, setDraftQuery] = useState(query);
  const [isSearching, setIsSearching] = useState(false);

  const jobSuggestions = useMemo(() => {
    if (!draftQuery.trim()) return [];
    const mockSuggestions = [
      "Software Engineer",
      "Data Scientist",
      "Product Manager",
      "UX Designer",
      "DevOps Engineer",
      "Marketing Specialist",
      "Full Stack Developer",
      "Product Designer",
      "Frontend Developer",
      "Backend Engineer"
    ].filter(s => s.toLowerCase().includes(draftQuery.toLowerCase()));
    return mockSuggestions.slice(0, 5);
  }, [draftQuery]);

  const handleSearch = async () => {
    if (!draftQuery.trim()) return;
    setIsSearching(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    onApply(draftQuery);
    setIsSearching(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="jp-market-search surface-muted">
      <div className="jp-market-search-pill">
        <span>Jobs</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="jp-market-search-fields">
        <div style={{ position: "relative", flex: 1 }}>
          <SearchInput
            label="Search job titles, keywords, or companies"
            value={draftQuery}
            onChange={setDraftQuery}
            onKeyDown={handleKeyPress}
            placeholder="Search jobs..."
          />
          {jobSuggestions.length > 0 && (
            <div className="search-suggestions">
              {jobSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="search-suggestion-item"
                  onClick={() => {
                    setDraftQuery(suggestion);
                    handleSearch();
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <button
        type="button"
        className="jp-market-search-button"
        onClick={handleSearch}
        disabled={isSearching || !draftQuery.trim()}
      >
        {isSearching ? (
          <div className="spinner" style={{ width: "22px", height: "22px" }} />
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 21L16.65 16.65M10.5 18C14.6421 18 18 14.6421 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
