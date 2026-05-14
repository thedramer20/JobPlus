import type { JobFilterConfig, JobFilterOption, JobFilters } from "../../types/job";
import { useTranslation } from "react-i18next";
import { FilterDropdown } from "./filter-dropdown";

interface JobFilterBarProps {
  filterConfigs: JobFilterConfig[];
  filterOptions: Record<string, JobFilterOption[]>;
  filters: JobFilters;
  onApply: (key: JobFilterConfig["key"], nextValue: string[]) => void;
  onReset: () => void;
  applying: boolean;
}

export function JobFilterBar({ filterConfigs, filterOptions, filters, onApply, onReset, applying }: JobFilterBarProps) {
  const { t } = useTranslation();
  return (
    <div className="jp-filter-bar">
      <button type="button" className={`jp-filter-trigger jp-filter-reset ${applying ? "is-busy" : ""}`} onClick={onReset}>
        <span>{applying ? t("jobsPage.applyingFilters") : t("jobsPage.resetFilters")}</span>
      </button>
      {filterConfigs.map((config) => (
        <FilterDropdown
          key={config.key}
          config={config}
          options={filterOptions[config.key] ?? []}
          value={filters[config.key] as string[]}
          onApply={(nextValue) => onApply(config.key, nextValue)}
        />
      ))}
    </div>
  );
}
