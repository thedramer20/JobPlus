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
  severity?: "normal" | "watch" | "critical";
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
  verification: "verified" | "pending" | "unverified";
  country: string;
  riskLevel: "low" | "medium" | "high";
  premium: boolean;
  lastIp: string;
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
  trustScore: number;
  complaintCount: number;
  recruitersLinked: number;
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
  reportCount: number;
  qualityScore: number;
  fraudRiskScore: number;
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
  severity: "critical" | "high" | "medium" | "low";
}

export interface AdminNotificationRow {
  id: number;
  message: string;
  type: "info" | "warning" | "alert" | "success";
  isRead: boolean;
  createdAt: string;
  priority: "critical" | "high" | "medium" | "low";
  module: "users" | "companies" | "jobs" | "moderation" | "support" | "system";
}

export interface AdminSystemSettings {
  platformName: string;
  registrationEnabled: boolean;
  companyApprovalRequired: boolean;
  jobApprovalRequired: boolean;
  notificationsEnabled: boolean;
  maintenanceMode: boolean;
  defaultRole: "candidate" | "employer";
  featureFlags: string[];
  moderationThreshold: number;
  verificationSlaHours: number;
}

export interface AdminSupportTicketRow {
  id: number;
  subject: string;
  requester: string;
  requesterRole: "candidate" | "employer";
  category: "verification" | "payment" | "technical" | "appeal" | "abuse";
  priority: "critical" | "high" | "medium" | "low";
  status: "open" | "in_progress" | "waiting" | "resolved";
  assignedTo: string;
  slaHoursLeft: number;
  createdAt: string;
}

export interface AdminAuditLogRow {
  id: number;
  actor: string;
  action: string;
  target: string;
  severity: "critical" | "high" | "medium" | "low";
  previousValue: string;
  newValue: string;
  reason: string;
  timestamp: string;
}

export interface AdminRolePermission {
  id: string;
  roleName: string;
  description: string;
  members: number;
  permissions: string[];
}

export interface AdminSystemAlert {
  id: number;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  module: "security" | "moderation" | "applications" | "infrastructure";
  startedAt: string;
  isAcknowledged: boolean;
}
