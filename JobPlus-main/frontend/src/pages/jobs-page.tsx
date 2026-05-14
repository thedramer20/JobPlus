import { useDeferredValue, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { Link, NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { EmptyState } from "../components/shared/empty-state";
import { JobCard } from "../components/shared/job-card";
import { JobFilterBar } from "../components/shared/job-filter-bar";
import { JobMarketSearch } from "../components/shared/job-market-search";
import { SelectedFilterChips } from "../components/shared/selected-filter-chips";
import { SkeletonList } from "../components/shared/skeleton-list";
import { SortDropdown, type SortOption } from "../components/shared/sort-dropdown";
import { listJobs } from "../services/jobs-service";
import { authStore } from "../store/auth-store";
import { defaultJobFilters, type Job, type JobFilterConfig, type JobFilterOption, type JobFilters } from "../types/job";
import { recordIntentInteraction } from "../lib/ui-intelligence";

export function JobsPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<JobFilters>(defaultJobFilters);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [careerWeights, setCareerWeights] = useState({
    salary: 65,
    growth: 72,
    stability: 58,
    brand: 44,
    workLife: 62
  });
  const { user } = authStore();
  const deferredCareerWeights = useDeferredValue(careerWeights);
  const [tradeoffValue, setTradeoffValue] = useState(58);
  const [qualityLocked, setQualityLocked] = useState(false);
  const filterConfigs: JobFilterConfig[] = useMemo(
    () => [
      { key: "postedWithin", label: t("jobsPage.filters.anyTime"), selectionMode: "single" },
      { key: "companies", label: t("jobsPage.filters.company"), selectionMode: "multiple", searchable: true, searchPlaceholder: t("jobsPage.filters.addCompany") },
      { key: "jobType", label: t("jobsPage.filters.jobType"), selectionMode: "multiple" },
      { key: "experienceLevel", label: t("jobsPage.filters.experienceLevel"), selectionMode: "multiple" },
      { key: "locations", label: t("jobsPage.filters.location"), selectionMode: "multiple", searchable: true, searchPlaceholder: t("jobsPage.filters.addLocation") },
      { key: "minSalary", label: t("jobsPage.filters.salary"), selectionMode: "single" },
      { key: "workType", label: t("jobsPage.filters.remote"), selectionMode: "multiple" }
    ],
    [t]
  );
  const salaryLabels: Record<string, string> = useMemo(
    () => ({
      "40000": "$40,000+",
      "60000": "$60,000+",
      "80000": "$80,000+",
      "100000": "$100,000+",
      "120000": "$120,000+"
    }),
    []
  );
  const postedWithinLabels: Record<string, string> = useMemo(
    () => ({
      "any-time": t("jobsPage.filters.anyTime"),
      "past-24-hours": t("jobsPage.filters.past24h"),
      "past-week": t("jobsPage.filters.pastWeek"),
      "past-month": t("jobsPage.filters.pastMonth")
    }),
    [t]
  );
  const sortOptions: SortOption[] = useMemo(
    () => [
      { value: "newest", label: t("jobsPage.sort.newest"), helper: t("jobsPage.sort.newestHint") },
      { value: "strategy", label: "Smart strategy", helper: "Personalized by your current tradeoff priorities" },
      { value: "salary-high", label: t("jobsPage.sort.salaryHigh"), helper: t("jobsPage.sort.salaryHighHint") },
      { value: "salary-low", label: t("jobsPage.sort.salaryLow"), helper: t("jobsPage.sort.salaryLowHint") },
      { value: "company", label: t("jobsPage.sort.company"), helper: t("jobsPage.sort.companyHint") }
    ],
    [t]
  );

  // Optimize queries with better caching
  const { data: allJobs = [] } = useQuery({
    queryKey: ["jobs", "all"],
    queryFn: () => listJobs(),
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 5 * 60 * 1000,
  });

  const { data: jobs = [], isLoading, isError, isFetching } = useQuery({
    queryKey: ["jobs", filters],
    queryFn: () => listJobs(filters),
    placeholderData: (previous) => previous,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  });

  const filterOptions = useMemo(() => buildFilterOptions(allJobs, postedWithinLabels, salaryLabels), [allJobs, postedWithinLabels, salaryLabels]);
  const chips = useMemo(() => buildFilterChips(filters, setFilters, postedWithinLabels, salaryLabels), [filters, postedWithinLabels, salaryLabels]);
  const sortedJobs = useMemo(() => sortJobs(jobs, sortBy, deferredCareerWeights), [jobs, sortBy, deferredCareerWeights]);
  const strategyHighlights = useMemo(() => sortedJobs.slice(0, 3).map((job) => ({ job, analysis: buildRoleRealitySnapshot(job, deferredCareerWeights) })), [sortedJobs, deferredCareerWeights]);

  return (
    <section className="section-tight">
      <div className="container stack" style={{ gap: "1rem" }}>
        <div className="jp-jobs-toolbar-shell">
          <div className="jp-jobs-toolbar-top">
            <Link to="/" className="jp-jobs-toolbar-brand">
              JOBPLUS
            </Link>
            <JobMarketSearch
              query={filters.query}
              onApply={(query) => setFilters({ ...filters, query })}
            />
            <NavLink to={resolveProfileHref(user?.role)} className="jp-toolbar-avatar" aria-label={t("jobsPage.openAccount")}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 21C20 17.6863 16.4183 15 12 15C7.58172 15 4 17.6863 4 21M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </NavLink>
          </div>

          <JobFilterBar
            filterConfigs={filterConfigs}
            filterOptions={filterOptions}
            filters={filters}
            applying={isFetching && !isLoading}
          onReset={() => setFilters(defaultJobFilters)}
          onApply={(key, nextValue) => {
            setFilters((current) => ({
              ...current,
              [key]: key === "minSalary" || key === "postedWithin" ? nextValue.slice(0, 1) : nextValue
            }));
          }}
        />
        </div>

        <SelectedFilterChips chips={chips} onClearAll={() => setFilters(defaultJobFilters)} />

        <section className="section-tight">
          <div className="container stack" style={{ gap: "1.5rem" }}>
            <div className="space-between" style={{ alignItems: "center" }}>
              <div>
                <div className="eyebrow">Job Marketplace</div>
                <h2 className="headline">Find Your Next Opportunity</h2>
              </div>
              <NavLink to={resolveProfileHref(user?.role)} className="jp-toolbar-avatar" aria-label="Your profile">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 21C20 17.6863 16.4183 15 12 15C7.58172 15 4 17.6863 4 21M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </NavLink>
            </div>
          </div>
        </section>

        <div className="space-between">
          <div className="helper">{isLoading ? t("jobsPage.loadingJobs") : t("jobsPage.rolesFound", { count: sortedJobs.length })}</div>
          <div className="jp-jobs-toolbar">
            <span className="helper">{isFetching && !isLoading ? t("jobsPage.applyingFilters") : t("jobsPage.updatedNow")}</span>
            <SortDropdown
              value={sortBy}
              options={sortOptions}
              onChange={(value) => {
                recordIntentInteraction("jobs", 1);
                setSortBy(value);
              }}
            />
            {user?.role === "candidate" ? (
              <NavLink
                className="btn btn-secondary"
                to="/app/saved-jobs"
                onClick={() => recordIntentInteraction("jobs", 1)}
              >
                {t("jobsPage.viewSavedJobs")}
              </NavLink>
            ) : null}
          </div>
        </div>

        {isLoading ? <SkeletonList count={4} /> : null}
        {isError ? <EmptyState title={t("jobsPage.loadErrorTitle")} description={t("jobsPage.loadErrorDesc")} /> : null}
        {!isLoading && !isError && sortedJobs.length === 0 ? (
          <EmptyState title={t("jobsPage.noMatchTitle")} description={t("jobsPage.noMatchDesc")} />
        ) : null}
        {!isLoading && !isError ? sortedJobs.map((job) => <JobCard key={job.id} job={job} />) : null}
      </div>
    </section>
  );
}

function buildFilterOptions(jobs: Job[], postedWithinLabels: Record<string, string>, salaryLabels: Record<string, string>): Record<string, JobFilterOption[]> {
  const salaryOptions = [40000, 60000, 80000, 100000, 120000].map((amount) => ({
    value: String(amount),
    label: salaryLabels[String(amount)],
    count: jobs.filter((job) => (job.salaryMax ?? job.salaryMin ?? 0) >= amount).length
  }));

  const postedWithinOptions = Object.entries(postedWithinLabels).map(([value, label]) => ({
    value,
    label,
    count: jobs.length
  }));

  return {
    postedWithin: postedWithinOptions,
    companies: createOptions(jobs, (job) => job.company),
    jobType: normalizeStaticOptions(["Full-time", "Part-time", "Contract", "Temporary", "Internship", "Volunteer"], jobs, (job) => job.type),
    experienceLevel: normalizeStaticOptions(
      ["Internship", "Entry level", "Associate", "Mid-Senior level", "Director", "Executive"],
      jobs,
      (job) => job.level
    ),
    locations: createOptions(jobs, (job) => job.location),
    minSalary: salaryOptions,
    workType: normalizeStaticOptions(["On-site", "Remote", "Hybrid"], jobs, (job) => job.workMode)
  };
}

function createOptions(jobs: Job[], getValue: (job: Job) => string): JobFilterOption[] {
  const counts = new Map<string, number>();
  jobs.forEach((job) => {
    const value = getValue(job);
    counts.set(value, (counts.get(value) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([value, count]) => ({ value, label: value, count }));
}

function normalizeStaticOptions(values: string[], jobs: Job[], getValue: (job: Job) => string): JobFilterOption[] {
  return values.map((value) => ({
    value,
    label: value,
    count: jobs.filter((job) => getValue(job) === value).length
  }));
}

function buildFilterChips(filters: JobFilters, setFilters: Dispatch<SetStateAction<JobFilters>>, postedWithinLabels: Record<string, string>, salaryLabels: Record<string, string>) {
  const chips = [
    ...filters.postedWithin.map((value) => ({ id: `posted-${value}`, label: postedWithinLabels[value] ?? value, key: "postedWithin" as const, value })),
    ...filters.jobType.map((value) => ({ id: `jobType-${value}`, label: value, key: "jobType" as const, value })),
    ...filters.experienceLevel.map((value) => ({ id: `experience-${value}`, label: value, key: "experienceLevel" as const, value })),
    ...filters.locations.map((value) => ({ id: `location-${value}`, label: value, key: "locations" as const, value })),
    ...filters.companies.map((value) => ({ id: `company-${value}`, label: value, key: "companies" as const, value })),
    ...filters.workType.map((value) => ({ id: `work-${value}`, label: value, key: "workType" as const, value })),
    ...filters.minSalary.map((value) => ({ id: `salary-${value}`, label: salaryLabels[value] ?? value, key: "minSalary" as const, value }))
  ];

  return chips.map((chip) => ({
    id: chip.id,
    label: chip.label,
    onRemove: () =>
      setFilters((current) => ({
        ...current,
        [chip.key]: (current[chip.key] as string[]).filter((entry) => entry !== chip.value)
      }))
  }));
}

function resolveProfileHref(role?: string) {
  if (role === "employer") {
    return "/employer/dashboard";
  }
  if (role === "admin") {
    return "/admin";
  }
  if (role === "candidate") {
    return "/app/dashboard";
  }
  return "/login";
}

function sortJobs(
  jobs: Job[],
  sortBy: string,
  careerWeights: { salary: number; growth: number; stability: number; brand: number; workLife: number }
): Job[] {
  const copy = [...jobs];
  switch (sortBy) {
    case "strategy":
      return copy.sort((left, right) => scoreJobForStrategy(right, careerWeights) - scoreJobForStrategy(left, careerWeights));
    case "salary-high":
      return copy.sort((left, right) => extractSalaryRank(right) - extractSalaryRank(left));
    case "salary-low":
      return copy.sort((left, right) => extractSalaryRank(left) - extractSalaryRank(right));
    case "company":
      return copy.sort((left, right) => left.company.localeCompare(right.company));
    case "newest":
    default:
      return copy.sort((left, right) => right.id - left.id);
  }
}

function extractSalaryRank(job: Job): number {
  return job.salaryMax ?? job.salaryMin ?? 0;
}

function scoreJobForStrategy(
  job: Job,
  weights: { salary: number; growth: number; stability: number; brand: number; workLife: number }
): number {
  const salary = Math.min(100, Math.round((extractSalaryRank(job) / 180000) * 100));
  const growth = job.level.toLowerCase().includes("senior") || job.level.toLowerCase().includes("director") ? 80 : 64;
  const stability = job.type.toLowerCase().includes("full") ? 78 : job.type.toLowerCase().includes("contract") ? 48 : 58;
  const brand = Math.min(100, 45 + Math.min(35, job.company.length));
  const workLife = job.workMode.toLowerCase().includes("remote") ? 86 : job.workMode.toLowerCase().includes("hybrid") ? 72 : 56;

  return Math.round(
    (salary * weights.salary +
      growth * weights.growth +
      stability * weights.stability +
      brand * weights.brand +
      workLife * weights.workLife) /
      (weights.salary + weights.growth + weights.stability + weights.brand + weights.workLife)
  );
}

function buildRoleRealitySnapshot(
  job: Job,
  weights: { salary: number; growth: number; stability: number; brand: number; workLife: number }
) {
  const score = scoreJobForStrategy(job, weights);
  if (score >= 78) {
    return {
      score,
      strategy: "Apply now",
      summary: "High strategic alignment. This role matches your current priorities and has strong near-term upside."
    };
  }
  if (score >= 60) {
    return {
      score,
      strategy: "Apply with tuning",
      summary: "Good opportunity, but tune your profile headline and top skills first for stronger recruiter conversion."
    };
  }
  return {
    score,
    strategy: "Improve first",
    summary: "This role has lower strategic fit right now. Improve profile clarity or prioritize better aligned roles first."
  };
}
