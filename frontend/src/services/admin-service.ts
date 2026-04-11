import type {
  AdminActivityItem,
  AdminApplicationRow,
  AdminCategoryRow,
  AdminCompanyRow,
  AdminJobRow,
  AdminKpi,
  AdminNotificationRow,
  AdminReportRow,
  AdminSystemSettings,
  AdminTrendPoint,
  AdminUserRow
} from "../types/admin";

const wait = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

const avatars = [
  "https://i.pravatar.cc/120?img=1",
  "https://i.pravatar.cc/120?img=5",
  "https://i.pravatar.cc/120?img=9",
  "https://i.pravatar.cc/120?img=15",
  "https://i.pravatar.cc/120?img=21"
];

let users: AdminUserRow[] = [
  { id: 1, avatar: avatars[0], fullName: "Amina Yusuf", username: "amina", email: "amina@jobplus.app", role: "candidate", status: "active", joinedDate: "2026-03-20", lastActivity: "2 mins ago" },
  { id: 2, avatar: avatars[1], fullName: "Nadia Mensah", username: "nadia", email: "nadia@jobplus.app", role: "employer", status: "active", joinedDate: "2026-03-19", lastActivity: "18 mins ago" },
  { id: 3, avatar: avatars[2], fullName: "Omar Khaled", username: "omark", email: "omar@jobplus.app", role: "candidate", status: "inactive", joinedDate: "2026-03-16", lastActivity: "3 days ago" },
  { id: 4, avatar: avatars[3], fullName: "Platform Admin", username: "admin", email: "admin@jobplus.app", role: "admin", status: "active", joinedDate: "2026-03-10", lastActivity: "Online now" },
  { id: 5, avatar: avatars[4], fullName: "Maria Costa", username: "maria", email: "maria@jobplus.app", role: "candidate", status: "suspended", joinedDate: "2026-03-05", lastActivity: "5 days ago" }
];

let companies: AdminCompanyRow[] = [
  { id: 1, logo: "🚀", companyName: "JobPlus Labs", industry: "Technology", location: "Shanghai", owner: "nadia", jobsCount: 9, verificationStatus: "verified", status: "active", createdDate: "2026-03-20" },
  { id: 2, logo: "🏥", companyName: "Care Nexus", industry: "Healthcare", location: "Dubai", owner: "care-admin", jobsCount: 6, verificationStatus: "pending", status: "pending", createdDate: "2026-03-22" },
  { id: 3, logo: "📈", companyName: "GrowthPilot", industry: "Marketing", location: "Cairo", owner: "pilot-owner", jobsCount: 4, verificationStatus: "unverified", status: "active", createdDate: "2026-03-18" }
];

let jobs: AdminJobRow[] = [
  { id: 101, title: "Frontend Engineer", company: "JobPlus Labs", type: "Full-time", location: "Remote", salary: "$4,000 - $6,000", category: "Technology", postedDate: "2026-04-01", applicationsCount: 27, status: "open" },
  { id: 102, title: "Marketing Specialist", company: "GrowthPilot", type: "Full-time", location: "Cairo", salary: "$2,500 - $3,400", category: "Marketing", postedDate: "2026-03-31", applicationsCount: 16, status: "open" },
  { id: 103, title: "Project Manager", company: "Care Nexus", type: "Contract", location: "Dubai", salary: "$3,800 - $5,000", category: "Business Strategy", postedDate: "2026-03-26", applicationsCount: 9, status: "closed" }
];

let applications: AdminApplicationRow[] = [
  { id: 801, applicantName: "Amina Yusuf", jobTitle: "Frontend Engineer", company: "JobPlus Labs", applicationDate: "2026-04-09", status: "shortlisted", resumeAvailable: true, contactEmail: "amina@jobplus.app" },
  { id: 802, applicantName: "Sami Noor", jobTitle: "Marketing Specialist", company: "GrowthPilot", applicationDate: "2026-04-10", status: "pending", resumeAvailable: true, contactEmail: "sami@jobplus.app" },
  { id: 803, applicantName: "Laila Ahmed", jobTitle: "Project Manager", company: "Care Nexus", applicationDate: "2026-04-08", status: "reviewed", resumeAvailable: false, contactEmail: "laila@jobplus.app" }
];

let categories: AdminCategoryRow[] = [
  { id: 1, icon: "💻", name: "Technology", description: "Software, data, infrastructure roles", totalJobs: 44, status: "active" },
  { id: 2, icon: "📈", name: "Marketing", description: "Growth and campaign focused roles", totalJobs: 28, status: "active" },
  { id: 3, icon: "🎓", name: "Education", description: "Learning and training opportunities", totalJobs: 15, status: "active" },
  { id: 4, icon: "🧠", name: "Business Strategy", description: "Operations and strategic planning", totalJobs: 21, status: "active" },
  { id: 5, icon: "🏥", name: "Healthcare", description: "Medical and health management roles", totalJobs: 12, status: "inactive" }
];

let reports: AdminReportRow[] = [
  { id: 9001, reportType: "job", target: "Project Manager - Care Nexus", reportedBy: "amina", reason: "Salary details are unclear", date: "2026-04-10", status: "pending" },
  { id: 9002, reportType: "user", target: "maria", reportedBy: "sami", reason: "Spam messages", date: "2026-04-09", status: "reviewing" },
  { id: 9003, reportType: "company", target: "GrowthPilot", reportedBy: "laila", reason: "Misleading company description", date: "2026-04-08", status: "resolved" }
];

let notifications: AdminNotificationRow[] = [
  { id: 1, message: "New company registration requires approval.", type: "alert", isRead: false, createdAt: "2026-04-11T09:30:00Z" },
  { id: 2, message: "2 new job reports were submitted.", type: "warning", isRead: false, createdAt: "2026-04-11T08:10:00Z" },
  { id: 3, message: "Weekly analytics report is ready.", type: "info", isRead: true, createdAt: "2026-04-10T20:45:00Z" }
];

let settings: AdminSystemSettings = {
  platformName: "JobPlus",
  registrationEnabled: true,
  companyApprovalRequired: true,
  jobApprovalRequired: false,
  notificationsEnabled: true,
  maintenanceMode: false,
  defaultRole: "candidate"
};

const trendPoints: AdminTrendPoint[] = [
  { label: "Jan", users: 120, jobs: 55, applications: 230 },
  { label: "Feb", users: 170, jobs: 73, applications: 290 },
  { label: "Mar", users: 220, jobs: 96, applications: 360 },
  { label: "Apr", users: 275, jobs: 114, applications: 421 }
];

export async function getAdminKpis(): Promise<AdminKpi[]> {
  await wait();
  return [
    { key: "users", title: "Total Users", value: users.length, deltaText: "+12 this week", status: "up" },
    { key: "companies", title: "Total Companies", value: companies.length, deltaText: "+3 pending approvals", status: "neutral" },
    { key: "jobs", title: "Total Jobs", value: jobs.length, deltaText: "+8 today", status: "up" },
    { key: "applications", title: "Applications", value: applications.length, deltaText: "+15 this week", status: "up" },
    { key: "activeJobs", title: "Active Jobs", value: jobs.filter((item) => item.status === "open").length, deltaText: "2 closed this week", status: "neutral" },
    { key: "reports", title: "Flagged Reports", value: reports.filter((item) => item.status !== "resolved").length, deltaText: "-1 resolved today", status: "down" }
  ];
}

export async function getAdminTrends(): Promise<AdminTrendPoint[]> {
  await wait();
  return trendPoints;
}

export async function getAdminActivities(): Promise<AdminActivityItem[]> {
  await wait();
  return [
    { id: "a1", type: "user", message: "New user registered: noor99", at: "2 mins ago" },
    { id: "a2", type: "company", message: "Company submitted verification: Care Nexus", at: "12 mins ago" },
    { id: "a3", type: "job", message: "Job posted: Marketing Specialist", at: "28 mins ago" },
    { id: "a4", type: "report", message: "Report filed on user maria", at: "54 mins ago" }
  ];
}

export async function listAdminUsersData(): Promise<AdminUserRow[]> {
  await wait();
  return users;
}

export async function listAdminCompaniesData(): Promise<AdminCompanyRow[]> {
  await wait();
  return companies;
}

export async function listAdminJobsData(): Promise<AdminJobRow[]> {
  await wait();
  return jobs;
}

export async function listAdminApplicationsData(): Promise<AdminApplicationRow[]> {
  await wait();
  return applications;
}

export async function listAdminCategoriesData(): Promise<AdminCategoryRow[]> {
  await wait();
  return categories;
}

export async function listAdminReportsData(): Promise<AdminReportRow[]> {
  await wait();
  return reports;
}

export async function listAdminNotificationsData(): Promise<AdminNotificationRow[]> {
  await wait();
  return notifications;
}

export async function markNotificationAsRead(id: number): Promise<void> {
  await wait();
  notifications = notifications.map((item) => (item.id === id ? { ...item, isRead: true } : item));
}

export async function getAdminSettings(): Promise<AdminSystemSettings> {
  await wait();
  return settings;
}

export async function saveAdminSettings(payload: AdminSystemSettings): Promise<AdminSystemSettings> {
  await wait();
  settings = payload;
  return settings;
}
