import { http } from "../lib/http";
import type { AdminOverview, JobCategory, Notification } from "../types/meta";
import type { Company } from "../types/company";
import type { Job } from "../types/job";
import type { UserProfile } from "../types/profile";
import { listJobs } from "./jobs-service";
import { listCompanies } from "./companies-service";

export async function listJobCategories(): Promise<JobCategory[]> {
  const { data } = await http.get<JobCategory[]>("/job-categories");
  return data;
}

export async function listNotifications(): Promise<Notification[]> {
  const { data } = await http.get<Notification[]>("/notifications/me");
  return data;
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const { data } = await http.get<AdminOverview>("/admin/overview");
  return data;
}

export async function getAdminUsers(): Promise<UserProfile[]> {
  const { data } = await http.get<UserProfile[]>("/admin/users");
  return data;
}

export async function getAdminCompanies(): Promise<Company[]> {
  return listCompanies();
}

export async function getAdminJobs(): Promise<Job[]> {
  return listJobs();
}
