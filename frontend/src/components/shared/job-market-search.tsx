import { useState } from "react";
import { SearchInput } from "./search-input";

interface JobMarketSearchProps {
  query: string;
  location: string;
  onApply: (payload: { query: string; location: string }) => void;
}

export function JobMarketSearch({ query, location, onApply }: JobMarketSearchProps) {
  const [draftQuery, setDraftQuery] = useState(query);
  const [draftLocation, setDraftLocation] = useState(location);

  return (
    <div className="jp-market-search surface-muted">
      <div className="jp-market-search-pill">
        <span>Jobs</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="jp-market-search-fields">
        <SearchInput
          label="Search job titles or companies"
          value={draftQuery}
          onChange={setDraftQuery}
          placeholder="Search job titles or companies"
        />
        <SearchInput
          label="Location"
          value={draftLocation}
          onChange={setDraftLocation}
          placeholder="United States"
        />
      </div>
      <button type="button" className="jp-market-search-button" onClick={() => onApply({ query: draftQuery, location: draftLocation })}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 21L16.65 16.65M10.5 18C14.6421 18 18 14.6421 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
