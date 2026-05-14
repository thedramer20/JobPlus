import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SearchInput } from "./search-input";

interface SearchBarProps {
  compact?: boolean;
  onSearch?: (keyword: string) => void;
}

export function SearchBar({ compact = false, onSearch }: SearchBarProps) {
  const { t } = useTranslation();
  const [keyword, setKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const suggestions = useMemo(() => {
    if (!keyword.trim()) return [];
    // Mock suggestions based on keyword
    const mockSuggestions = [
      "Software Engineer",
      "Data Analyst",
      "Product Manager",
      "UX Designer",
      "Marketing Manager",
      "Sales Representative",
      "Full Stack Developer",
      "DevOps Engineer",
      "Product Designer",
      "Data Scientist"
    ].filter(s => s.toLowerCase().includes(keyword.toLowerCase()));
    return mockSuggestions.slice(0, 5);
  }, [keyword]);

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setIsSearching(true);
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log("Searching for:", { keyword });
    onSearch?.(keyword);
    setIsSearching(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <motion.div
      className="surface-muted"
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{ padding: compact ? "0.85rem" : "1rem", position: "relative" }}
    >
      <div className="form-grid" style={{ gridTemplateColumns: compact ? "1fr auto" : "1fr auto" }}>
        <div style={{ position: "relative" }}>
          <SearchInput
            label={t("search.jobs")}
            value={keyword}
            onChange={setKeyword}
            onKeyDown={handleKeyPress}
            placeholder={t("search.jobs")}
          />
          {suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="search-suggestion-item"
                  onClick={() => {
                    setKeyword(suggestion);
                    handleSearch();
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          className="btn btn-primary"
          onClick={handleSearch}
          disabled={isSearching || !keyword.trim()}
          style={{ minWidth: "120px" }}
        >
          {isSearching ? "Searching..." : "Search"}
        </button>
      </div>
    </motion.div>
  );
}
