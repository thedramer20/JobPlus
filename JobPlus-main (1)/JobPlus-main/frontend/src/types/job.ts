export interface Job {
  id: number;
  title: string;
  company: string;
  companyId?: number;
  location: string;
  workMode: string;
  type: string;
  category: string;
  categoryId?: number;
  level: string;
  salary: string;
  status: string;
  postedAt: string;
  description: string;
  requirements: string[];
  deadline?: string;
  currency?: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  vacancyCount?: number;
}

export interface JobFilters {
  query: string;
  postedWithin: string[];
  jobType: string[];
  experienceLevel: string[];
  locations: string[];
  companies: string[];
  workType: string[];
  minSalary: string[];
}

export interface JobFilterOption {
  value: string;
  label: string;
  count: number;
}

export interface JobFilterConfig {
  key: keyof Pick<JobFilters, "postedWithin" | "jobType" | "experienceLevel" | "locations" | "companies" | "workType" | "minSalary">;
  label: string;
  selectionMode: "single" | "multiple";
  searchable?: boolean;
  searchPlaceholder?: string;
}

export const defaultJobFilters: JobFilters = {
  query: "",
  postedWithin: [],
  jobType: [],
  experienceLevel: [],
  locations: [],
  companies: [],
  workType: [],
  minSalary: []
};
