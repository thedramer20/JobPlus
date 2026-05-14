import { http } from "../lib/http";
import type { CandidateProfile, Resume, SavedJob, UserProfile } from "../types/profile";
import { demoSavedJobs, demoJobs } from "../mocks/comprehensive-demo-data";

// Demo saved jobs store
let demoSavedJobsStore: SavedJob[] = [...demoSavedJobs];
let demoNextSavedJobId = 4;

export async function getUserProfile(): Promise<UserProfile> {
  const { data } = await http.get<UserProfile>("/users/me");
  return data;
}

export async function updateUserProfile(payload: { fullName: string; email: string; phone: string }): Promise<UserProfile> {
  const { data } = await http.put<UserProfile>("/users/me", payload);
  return data;
}

export async function getCandidateProfile(): Promise<CandidateProfile> {
  const { data } = await http.get<CandidateProfile>("/candidate-profile/me");
  return data;
}

export async function updateCandidateProfile(payload: {
  address: string;
  education: string;
  experienceSummary: string;
  avatarUrl?: string;
  linkedinUrl: string;
  githubUrl: string;
}): Promise<CandidateProfile> {
  const { data } = await http.put<CandidateProfile>("/candidate-profile/me", payload);
  return data;
}

export async function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<void> {
  await http.put("/users/me/password", payload);
}

export async function listResumes(): Promise<Resume[]> {
  const { data } = await http.get<Resume[]>("/resumes/me");
  return data;
}

export async function createResume(payload: { fileName: string; filePath: string }): Promise<Resume> {
  const { data } = await http.post<Resume>("/resumes", payload);
  return data;
}

export async function deleteResume(id: number): Promise<void> {
  await http.delete(`/resumes/${id}`);
}

export async function listSavedJobs(): Promise<SavedJob[]> {
  // Return demo saved jobs for testing
  return Promise.resolve([...demoSavedJobsStore]);

  // Original code commented out for demo:
  // const { data } = await http.get<SavedJob[]>("/saved-jobs/me");
  // return data;
}

export async function saveJob(jobId: number): Promise<SavedJob> {
  // Check if job is already saved
  const existing = demoSavedJobsStore.find(item => item.jobId === jobId);
  if (existing) {
    return existing;
  }

  // Find job details from demo data
  const job = demoJobs.find(j => j.id === jobId);
  if (!job) {
    throw new Error("Job not found");
  }

  // Create new saved job entry with actual job details
  const newSavedJob: SavedJob = {
    id: demoNextSavedJobId++,
    jobId,
    jobTitle: job.title,
    companyName: job.company,
    location: job.location,
    jobType: job.type,
    status: job.status,
    savedAt: new Date().toISOString()
  };

  demoSavedJobsStore = [newSavedJob, ...demoSavedJobsStore];
  return newSavedJob;

  // Original code commented out for demo:
  // const { data } = await http.post<SavedJob>("/saved-jobs", { jobId });
  // return data;
}

export async function removeSavedJob(jobId: number): Promise<void> {
  // Remove from demo store
  demoSavedJobsStore = demoSavedJobsStore.filter(item => item.jobId !== jobId);

  // Original code commented out for demo:
  // await http.delete(`/saved-jobs/${jobId}`);
}
