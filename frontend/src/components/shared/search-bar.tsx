import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SearchInput } from "./search-input";

interface SearchBarProps {
  compact?: boolean;
}

export function SearchBar({ compact = false }: SearchBarProps) {
  const { t } = useTranslation();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  return (
    <div className="surface-muted" style={{ padding: compact ? "0.85rem" : "1rem" }}>
      <div className="form-grid" style={{ gridTemplateColumns: compact ? "2fr 1.3fr auto" : undefined }}>
        <SearchInput label={t("search.jobs")} value={keyword} onChange={setKeyword} placeholder={t("search.jobs")} />
        <SearchInput label={t("search.location")} value={location} onChange={setLocation} placeholder={t("search.location")} />
        <button className="btn btn-primary">Search</button>
      </div>
    </div>
  );
}
