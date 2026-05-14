import { http } from "../lib/http";
import type { Application } from "../types/application";

interface ApplicationDto {
  id: number;
  jobId: number;
  jobTitle: string;
  candidateUserId: number;
  candidateUsername: string;
  resumeId: number | null;
  coverLetter: string | null;
  status: string;
  appliedAt: string;
  updatedAt: string;
}

export async function listMyApplications(): Promise<Application[]> {
  const { data } = await http.get<ApplicationDto[]>("/applications/me");
  return data.map(mapApplication);
}

export async function listApplicationsByJob(jobId: number): Promise<Application[]> {
  const { data } = await http.get<ApplicationDto[]>(`/applications/jobs/${jobId}`);
  return data.map(mapApplication);
}

export async function applyToJob(payload: { jobId: number; resumeId?: number | null; coverLetter?: string }): Promise<Application> {
  const { data } = await http.post<ApplicationDto>("/applications", payload);
  return mapApplication(data);
}

export async function updateApplicationStatus(id: number, status: string): Promise<Application> {
  const { data } = await http.patch<ApplicationDto>(`/applications/${id}/status`, { status });
  return mapApplication(data);
}

function mapApplication(dto: ApplicationDto): Application {
  return {
    id: dto.id,
    jobId: dto.jobId,
    jobTitle: dto.jobTitle,
    status: toTitleStatus(dto.status),
    appliedAt: dto.appliedAt.slice(0, 10),
    candidateUsername: dto.candidateUsername,
    resumeId: dto.resumeId,
    coverLetter: dto.coverLetter
  };
}

function toTitleStatus(value: string): Application["status"] {
  if (value === "REVIEWED") {
    return "Reviewed";
  }
  if (value === "SHORTLISTED") {
    return "Shortlisted";
  }
  if (value === "REJECTED") {
    return "Rejected";
  }
  if (value === "ACCEPTED") {
    return "Accepted";
  }
  return "Pending";
}
