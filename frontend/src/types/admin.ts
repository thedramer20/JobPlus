export type AdminEntityStatus =
  | "active"
  | "inactive"
  | "pending"
  | "suspended"
  | "flagged"
  | "resolved"
  | "open"
  | "closed";

export interface AdminKpi {
  key: string;
  title: string;
  value: number;
  deltaText: string;
  status: "up" | "down" | "neutral";
}

export interface AdminTrendPoint {
  label: string;
  users: number;
  jobs: number;
  applications: number;
}

export interface AdminActivityItem {
  id: string;
  message: string;
  at: string;
  type: "user" | "company" | "job" | "application" | "report" | "system";
}

export interface AdminUserRow {
  id: number;
  avatar: string;
  fullName: string;
  username: string;
  email: string;
  role: "candidate" | "employer" | "admin";
  status: AdminEntityStatus;
  joinedDate: string;
  lastActivity: string;
}

export interface AdminCompanyRow {
  id: number;
  logo: string;
  companyName: string;
  industry: string;
  location: string;
  owner: string;
  jobsCount: number;
  verificationStatus: "verified" | "unverified" | "pending";
  status: AdminEntityStatus;
  createdDate: string;
}

export interface AdminJobRow {
  id: number;
  title: string;
  company: string;
  type: string;
  location: string;
  salary: string;
  category: string;
  postedDate: string;
  applicationsCount: number;
  status: AdminEntityStatus;
}

export interface AdminApplicationRow {
  id: number;
  applicantName: string;
  jobTitle: string;
  company: string;
  applicationDate: string;
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "accepted";
  resumeAvailable: boolean;
  contactEmail: string;
}

export interface AdminCategoryRow {
  id: number;
  icon: string;
  name: string;
  description: string;
  totalJobs: number;
  status: "active" | "inactive";
}

export interface AdminReportRow {
  id: number;
  reportType: "user" | "job" | "company" | "content";
  target: string;
  reportedBy: string;
  reason: string;
  date: string;
  status: "pending" | "reviewing" | "resolved" | "dismissed";
}

export interface AdminNotificationRow {
  id: number;
  message: string;
  type: "info" | "warning" | "alert" | "success";
  isRead: boolean;
  createdAt: string;
}

export interface AdminSystemSettings {
  platformName: string;
  registrationEnabled: boolean;
  companyApprovalRequired: boolean;
  jobApprovalRequired: boolean;
  notificationsEnabled: boolean;
  maintenanceMode: boolean;
  defaultRole: "candidate" | "employer";
}
