import { http } from "../lib/http";
import type { Job, JobFilters } from "../types/job";
import { findDemoJob, listDemoJobs } from "../mocks/seed-system";

interface JobDto {
  id: number;
  companyId: number;
  companyName: string;
  categoryId: number;
  categoryName: string;
  title: string;
  description: string;
  requirements: string | null;
  location: string;
  jobType: string;
  workMode: string;
  experienceLevel: string;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  vacancyCount: number;
  applicationDeadline: string | null;
  status: string;
}

interface JobPayload {
  categoryId: number;
  title: string;
  description: string;
  requirements: string;
  location: string;
  jobType: string;
  workMode: string;
  experienceLevel: string;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  vacancyCount: number;
  applicationDeadline: string | null;
}

const FORCE_DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "only";
const ALLOW_DEMO_FALLBACK = import.meta.env.VITE_DEMO_MODE !== "false";

export async function listJobs(filters?: Partial<JobFilters>): Promise<Job[]> {
  if (FORCE_DEMO_MODE) {
    return listDemoJobs(filters);
  }

  try {
    const params = buildJobParams(filters);
    const { data } = await http.get<JobDto[]>(params ? `/jobs?${params.toString()}` : "/jobs");
    const mapped = data.map(mapJob);
    if (mapped.length > 0) {
      return mapped;
    }
    return ALLOW_DEMO_FALLBACK ? listDemoJobs(filters) : [];
  } catch {
    return ALLOW_DEMO_FALLBACK ? listDemoJobs(filters) : [];
  }
}

export async function getJob(id: number): Promise<Job> {
  if (!Number.isFinite(id) || id <= 0) {
    throw new Error("Invalid job id");
  }

  if (FORCE_DEMO_MODE) {
    const demo = findDemoJob(id);
    if (!demo) {
      throw new Error("Job not found");
    }
    return demo;
  }

  try {
    const { data } = await http.get<JobDto>(`/jobs/${id}`);
    return mapJob(data);
  } catch {
    if (!ALLOW_DEMO_FALLBACK) {
      throw new Error("Unable to load job details.");
    }
    const demo = findDemoJob(id);
    if (!demo) {
      throw new Error("Job not found");
    }
    return demo;
  }
}

export async function listEmployerJobs(): Promise<Job[]> {
  const { data } = await http.get<JobDto[]>("/jobs/my-company");
  return data.map(mapJob);
}

export async function createJob(payload: JobPayload): Promise<Job> {
  const { data } = await http.post<JobDto>("/jobs", payload);
  return mapJob(data);
}

export async function updateJob(id: number, payload: JobPayload): Promise<Job> {
  const { data } = await http.put<JobDto>(`/jobs/${id}`, payload);
  return mapJob(data);
}

function buildJobParams(filters?: Partial<JobFilters>) {
  if (!filters) {
    return null;
  }

  const params = new URLSearchParams();

  if (filters.query?.trim()) {
    params.set("query", filters.query.trim());
  }

  appendMany(params, "jobType", filters.jobType);
  appendMany(params, "experienceLevel", filters.experienceLevel);
  appendMany(params, "locations", filters.locations);
  appendMany(params, "companies", filters.companies);
  appendMany(params, "workType", filters.workType);

  if (filters.minSalary?.[0]) {
    params.set("minSalary", filters.minSalary[0]);
  }

  return params.toString() ? params : null;
}

function appendMany(params: URLSearchParams, key: string, values?: string[]) {
  values?.filter(Boolean).forEach((value) => params.append(key, value));
}

function mapJob(dto: JobDto): Job {
  return {
    id: dto.id,
    title: dto.title,
    company: dto.companyName,
    companyId: dto.companyId,
    location: dto.location,
    workMode: normalizeWorkMode(dto.workMode),
    type: normalizeJobType(dto.jobType),
    category: dto.categoryName,
    categoryId: dto.categoryId,
    level: normalizeLevel(dto.experienceLevel),
    salary: formatSalary(dto.salaryMin, dto.salaryMax, dto.currency),
    status: titleCase(dto.status),
    postedAt: "Recently",
    description: dto.description,
    requirements: dto.requirements ? dto.requirements.split(",").map((item) => item.trim()).filter(Boolean) : [],
    deadline: dto.applicationDeadline ?? undefined,
    currency: dto.currency,
    salaryMin: dto.salaryMin,
    salaryMax: dto.salaryMax,
    vacancyCount: dto.vacancyCount
  };
}

function formatSalary(min: number | null, max: number | null, currency: string) {
  const symbol = currency === "USD" ? "$" : `${currency} `;
  if (min == null && max == null) {
    return "Salary not specified";
  }
  if (min != null && max != null) {
    return `${symbol}${min.toLocaleString()} - ${symbol}${max.toLocaleString()}`;
  }
  return `${symbol}${(min ?? max ?? 0).toLocaleString()}`;
}

function titleCase(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeJobType(value: string) {
  const map: Record<string, string> = {
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time",
    CONTRACT: "Contract",
    TEMPORARY: "Temporary",
    INTERNSHIP: "Internship",
    VOLUNTEER: "Volunteer"
  };
  return map[value] ?? titleCase(value);
}

function normalizeWorkMode(value: string) {
  const map: Record<string, string> = {
    ONSITE: "On-site",
    ON_SITE: "On-site",
    REMOTE: "Remote",
    HYBRID: "Hybrid"
  };
  return map[value] ?? titleCase(value);
}

function normalizeLevel(value: string) {
  const map: Record<string, string> = {
    INTERNSHIP: "Internship",
    ENTRY: "Entry level",
    ENTRY_LEVEL: "Entry level",
    ASSOCIATE: "Associate",
    MID: "Mid-Senior level",
    MID_SENIOR: "Mid-Senior level",
    SENIOR: "Mid-Senior level",
    LEAD: "Director",
    DIRECTOR: "Director",
    EXECUTIVE: "Executive"
  };
  return map[value] ?? titleCase(value);
}
