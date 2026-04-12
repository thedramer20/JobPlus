import { http } from "../lib/http";
import type { CandidateProfile, Resume, SavedJob, UserProfile } from "../types/profile";

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
  const { data } = await http.get<SavedJob[]>("/saved-jobs/me");
  return data;
}

export async function saveJob(jobId: number): Promise<SavedJob> {
  const { data } = await http.post<SavedJob>("/saved-jobs", { jobId });
  return data;
}

export async function removeSavedJob(jobId: number): Promise<void> {
  await http.delete(`/saved-jobs/${jobId}`);
}
