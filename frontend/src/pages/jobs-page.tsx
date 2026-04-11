import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { EmptyState } from "../components/shared/empty-state";
import { JobCard } from "../components/shared/job-card";
import { JobFilterBar } from "../components/shared/job-filter-bar";
import { JobMarketSearch } from "../components/shared/job-market-search";
import { SelectedFilterChips } from "../components/shared/selected-filter-chips";
import { SkeletonList } from "../components/shared/skeleton-list";
import { listJobs } from "../services/jobs-service";
import { authStore } from "../store/auth-store";
import { defaultJobFilters, type Job, type JobFilterConfig, type JobFilterOption, type JobFilters } from "../types/job";

const filterConfigs: JobFilterConfig[] = [
  { key: "postedWithin", label: "Any time", selectionMode: "single" },
  { key: "companies", label: "Company", selectionMode: "multiple", searchable: true, searchPlaceholder: "Add a company" },
  { key: "jobType", label: "Job type", selectionMode: "multiple" },
  { key: "experienceLevel", label: "Experience level", selectionMode: "multiple" },
  { key: "locations", label: "Location", selectionMode: "multiple", searchable: true, searchPlaceholder: "Add a location" },
  { key: "minSalary", label: "Salary", selectionMode: "single" },
  { key: "workType", label: "Remote", selectionMode: "multiple" }
];

const salaryLabels: Record<string, string> = {
  "40000": "$40,000+",
  "60000": "$60,000+",
  "80000": "$80,000+",
  "100000": "$100,000+",
  "120000": "$120,000+"
};

const postedWithinLabels: Record<string, string> = {
  "any-time": "Any time",
  "past-24-hours": "Past 24 hours",
  "past-week": "Past week",
  "past-month": "Past month"
};

export function JobsPage() {
  const [filters, setFilters] = useState<JobFilters>(defaultJobFilters);
  const { user } = authStore();

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
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  });

  const filterOptions = useMemo(() => buildFilterOptions(allJobs), [allJobs]);
  const chips = useMemo(() => buildFilterChips(filters, setFilters), [filters]);

  return (
    <section className="section-tight">
      <div className="container stack" style={{ gap: "1rem" }}>
        <div className="jp-jobs-toolbar-shell">
          <div className="jp-jobs-toolbar-top">
            <NavLink to="/" className="jp-jobs-toolbar-brand headline">
              JOBPLUS
            </NavLink>
            <JobMarketSearch
              query={filters.query}
              location={filters.locations[0] ?? ""}
              onApply={({ query, location }) => {
                setFilters((current) => ({
                  ...current,
                  query,
                  locations: location ? [location] : []
                }));
              }}
            />
            <NavLink to={resolveProfileHref(user?.role)} className="jp-toolbar-avatar" aria-label="Open account">
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

        <div className="space-between">
          <div className="helper">{isLoading ? "Loading jobs..." : `${jobs.length} roles found`}</div>
          <div className="jp-jobs-toolbar">
            <span className="helper">{isFetching && !isLoading ? "Applying filters..." : "Updated just now"}</span>
            <select className="select" style={{ maxWidth: "220px" }}>
              <option>Sort by newest</option>
              <option>Sort by salary</option>
              <option>Sort by relevance</option>
            </select>
          </div>
        </div>

        {isLoading ? <SkeletonList count={4} /> : null}
        {isError ? <EmptyState title="Could not load jobs" description="Check that the Spring Boot backend is running and reachable." /> : null}
        {!isLoading && !isError && jobs.length === 0 ? (
          <EmptyState title="No jobs match these filters" description="Try clearing one or two filters, or search a broader location or company name." />
        ) : null}
        {!isLoading && !isError ? jobs.map((job) => <JobCard key={job.id} job={job} />) : null}
      </div>
    </section>
  );
}

function buildFilterOptions(jobs: Job[]): Record<string, JobFilterOption[]> {
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

function buildFilterChips(filters: JobFilters, setFilters: Dispatch<SetStateAction<JobFilters>>) {
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
