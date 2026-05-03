import type {
  AdminActivityItem,
  AdminApplicationRow,
  AdminAuditLogRow,
  AdminCategoryRow,
  AdminCompanyRow,
  AdminJobRow,
  AdminKpi,
  AdminNotificationRow,
  AdminReportRow,
  AdminRolePermission,
  AdminSupportTicketRow,
  AdminSystemAlert,
  AdminSystemSettings,
  AdminTrendPoint,
  AdminUserRow
} from "../types/admin";

// Remove artificial delay - return data immediately

const universities = [
  "Shanghai University of Engineering and Science",
  "Hangzhou Dianzi University",
  "Shanghai Polytechnic University",
  "Shaoxing University",
  "Nanjing University of Technology",
  "SIAS University"
];

const countries = [
  "China",
  "United Arab Emirates",
  "Singapore",
  "Germany",
  "United Kingdom",
  "Canada",
  "Egypt",
  "Saudi Arabia",
  "India",
  "France",
  "Spain"
];

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Logistics",
  "Retail",
  "Marketing",
  "Manufacturing",
  "Cybersecurity",
  "Consulting"
];

const categoriesPool = [
  "Technology",
  "Business Strategy",
  "Marketing",
  "Finance",
  "Design",
  "Healthcare",
  "Education",
  "Project Management",
  "Customer Success",
  "Operations"
];

const firstNames = [
  "Amina",
  "Noah",
  "Lina",
  "Omar",
  "Sophia",
  "Ethan",
  "Nadia",
  "Karim",
  "Emma",
  "Hassan",
  "Maya",
  "Ray",
  "Olivia",
  "Daniel",
  "Fatima",
  "Leo",
  "Jia",
  "Samuel"
];

const lastNames = [
  "Yusuf",
  "Lin",
  "Morgan",
  "Rahman",
  "Ahmed",
  "Park",
  "Mensah",
  "Haddad",
  "Vega",
  "Cole",
  "Silva",
  "Kim",
  "Chen",
  "Tran",
  "Gomez",
  "Roberts",
  "White",
  "Khan"
];

const companyPrefixes = ["Nova", "Apex", "Vertex", "Blue", "Quantum", "Talent", "Orbit", "Spark", "Scale", "Pioneer"];
const companySuffixes = ["Systems", "Labs", "Works", "Dynamics", "Cloud", "Bridge", "Flow", "Pulse", "Core", "Stack"];

let users: AdminUserRow[] = buildUsers();
let companies: AdminCompanyRow[] = buildCompanies();
let jobs: AdminJobRow[] = buildJobs();
let applications: AdminApplicationRow[] = buildApplications();
let categories: AdminCategoryRow[] = buildCategories();
let reports: AdminReportRow[] = buildReports();
let notifications: AdminNotificationRow[] = buildNotifications();
let tickets: AdminSupportTicketRow[] = buildSupportTickets();
let auditLogs: AdminAuditLogRow[] = buildAuditLogs();
let alerts: AdminSystemAlert[] = buildSystemAlerts();
let rolePermissions: AdminRolePermission[] = buildRolePermissions();

let settings: AdminSystemSettings = {
  platformName: "JobPlus",
  registrationEnabled: true,
  companyApprovalRequired: true,
  jobApprovalRequired: false,
  notificationsEnabled: true,
  maintenanceMode: false,
  defaultRole: "candidate",
  featureFlags: ["enhanced-screening", "trust-score-v2", "smart-queue"],
  moderationThreshold: 72,
  verificationSlaHours: 36
};

const trendPoints: AdminTrendPoint[] = [
  { label: "Nov", users: 9200, jobs: 4200, applications: 27600 },
  { label: "Dec", users: 10350, jobs: 4650, applications: 29800 },
  { label: "Jan", users: 11870, jobs: 5120, applications: 33250 },
  { label: "Feb", users: 12490, jobs: 5380, applications: 35790 },
  { label: "Mar", users: 13620, jobs: 5890, applications: 40110 },
  { label: "Apr", users: 14780, jobs: 6320, applications: 42890 }
];

function buildUsers(): AdminUserRow[] {
  return Array.from({ length: 180 }).map((_, index) => {
    const first = firstNames[index % firstNames.length];
    const last = lastNames[(index * 3) % lastNames.length];
    const username = `${first}.${last}.${index + 1}`.toLowerCase();
    const role: AdminUserRow["role"] = index % 29 === 0 ? "admin" : index % 5 === 0 ? "employer" : "candidate";
    const status = index % 21 === 0 ? "suspended" : index % 11 === 0 ? "inactive" : "active";
    return {
      id: index + 1,
      avatar: `https://i.pravatar.cc/120?img=${(index % 70) + 1}`,
      fullName: `${first} ${last}`,
      username,
      email: `${username}@jobplus.app`,
      role,
      status,
      joinedDate: new Date(Date.now() - (index + 1) * 86400000 * 2).toISOString().slice(0, 10),
      lastActivity: status === "active" ? `${(index % 50) + 1} mins ago` : `${(index % 8) + 1} days ago`,
      verification: index % 6 === 0 ? "pending" : index % 4 === 0 ? "unverified" : "verified",
      country: countries[index % countries.length],
      riskLevel: index % 19 === 0 ? "high" : index % 7 === 0 ? "medium" : "low",
      premium: index % 3 === 0,
      lastIp: `10.24.${index % 255}.${(index * 7) % 255}`
    };
  });
}

function buildCompanies(): AdminCompanyRow[] {
  return Array.from({ length: 34 }).map((_, index) => {
    const name = `${companyPrefixes[index % companyPrefixes.length]} ${companySuffixes[(index + 2) % companySuffixes.length]}`;
    return {
      id: index + 1,
      logo: `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(name)}`,
      companyName: name,
      industry: industries[index % industries.length],
      location: countries[index % countries.length],
      owner: users[(index + 3) % users.length].username,
      jobsCount: 6 + (index % 18),
      verificationStatus: index % 8 === 0 ? "pending" : index % 5 === 0 ? "unverified" : "verified",
      status: index % 10 === 0 ? "suspended" : index % 6 === 0 ? "pending" : "active",
      createdDate: new Date(Date.now() - (index + 2) * 86400000 * 5).toISOString().slice(0, 10),
      trustScore: 58 + (index % 40),
      complaintCount: index % 6,
      recruitersLinked: 2 + (index % 12)
    };
  });
}

function buildJobs(): AdminJobRow[] {
  return Array.from({ length: 240 }).map((_, index) => {
    const category = categoriesPool[index % categoriesPool.length];
    const company = companies[index % companies.length];
    const min = 35000 + (index % 16) * 7000;
    const max = min + 22000;
    return {
      id: 2000 + index,
      title: `${["Junior", "Senior", "Lead", "Principal"][index % 4]} ${category} Specialist`,
      company: company.companyName,
      type: ["Full-time", "Part-time", "Contract", "Internship"][index % 4],
      location: ["Remote", "Hybrid", "On-site"][index % 3],
      salary: `$${min.toLocaleString("en-US")} - $${max.toLocaleString("en-US")}`,
      category,
      postedDate: new Date(Date.now() - (index % 28) * 86400000).toISOString().slice(0, 10),
      applicationsCount: 3 + (index % 90),
      status: index % 9 === 0 ? "closed" : "open",
      reportCount: index % 7,
      qualityScore: 55 + (index % 45),
      fraudRiskScore: 9 + (index % 68)
    };
  });
}

function buildApplications(): AdminApplicationRow[] {
  return Array.from({ length: 420 }).map((_, index) => {
    const user = users[(index * 3) % users.length];
    const job = jobs[index % jobs.length];
    return {
      id: 7000 + index,
      applicantName: user.fullName,
      jobTitle: job.title,
      company: job.company,
      applicationDate: new Date(Date.now() - (index % 40) * 86400000).toISOString().slice(0, 10),
      status: ["pending", "reviewed", "shortlisted", "rejected", "accepted"][index % 5] as AdminApplicationRow["status"],
      resumeAvailable: index % 6 !== 0,
      contactEmail: user.email
    };
  });
}

function buildCategories(): AdminCategoryRow[] {
  return categoriesPool.map((name, index) => ({
    id: index + 1,
    icon: ["💻", "🧠", "📈", "💰", "🎨", "🏥", "🎓", "🧩", "🤝", "⚙️"][index % 10],
    name,
    description: `${name} opportunities for high-growth hiring teams.`,
    totalJobs: jobs.filter((job) => job.category === name).length,
    status: index % 9 === 0 ? "inactive" : "active"
  }));
}

function buildReports(): AdminReportRow[] {
  const reasons = [
    "Potential spam outreach",
    "Misleading salary details",
    "Suspicious duplicate posting",
    "Abusive message content",
    "Fake company profile"
  ];
  return Array.from({ length: 96 }).map((_, index) => ({
    id: 9000 + index,
    reportType: (["user", "job", "company", "content"][index % 4] as AdminReportRow["reportType"]),
    target: index % 2 === 0 ? users[index % users.length].username : jobs[index % jobs.length].title,
    reportedBy: users[(index + 5) % users.length].username,
    reason: reasons[index % reasons.length],
    date: new Date(Date.now() - (index % 14) * 86400000).toISOString().slice(0, 10),
    status: (["pending", "reviewing", "resolved", "dismissed"][index % 4] as AdminReportRow["status"]),
    severity: (["critical", "high", "medium", "low"][index % 4] as AdminReportRow["severity"])
  }));
}

function buildNotifications(): AdminNotificationRow[] {
  const messages = [
    "Verification queue exceeded SLA threshold.",
    "Sudden spike in reported jobs detected.",
    "Premium conversion increased in APAC region.",
    "Support backlog crossed warning limit.",
    "Security policy update has been deployed.",
    "Moderation queue recovered to healthy level."
  ];

  return Array.from({ length: 84 }).map((_, index) => ({
    id: index + 1,
    message: messages[index % messages.length],
    type: (["alert", "warning", "success", "info"][index % 4] as AdminNotificationRow["type"]),
    isRead: index % 3 === 0,
    createdAt: new Date(Date.now() - index * 1000 * 60 * 35).toISOString(),
    priority: (["critical", "high", "medium", "low"][index % 4] as AdminNotificationRow["priority"]),
    module: (["moderation", "jobs", "system", "support", "users", "companies"][index % 6] as AdminNotificationRow["module"])
  }));
}

function buildSupportTickets(): AdminSupportTicketRow[] {
  return Array.from({ length: 72 }).map((_, index) => ({
    id: 51000 + index,
    subject: [
      "Verification appeal for recruiter account",
      "Unable to update company legal document",
      "Application status not updating",
      "Premium billing mismatch",
      "Suspended account review request"
    ][index % 5],
    requester: users[(index + 11) % users.length].fullName,
    requesterRole: index % 5 === 0 ? "employer" : "candidate",
    category: (["verification", "technical", "appeal", "payment", "abuse"][index % 5] as AdminSupportTicketRow["category"]),
    priority: (["critical", "high", "medium", "low"][index % 4] as AdminSupportTicketRow["priority"]),
    status: (["open", "in_progress", "waiting", "resolved"][index % 4] as AdminSupportTicketRow["status"]),
    assignedTo: ["Ops Team", "Support Team", "Trust & Safety", "Verification Desk"][index % 4],
    slaHoursLeft: 48 - (index % 40),
    createdAt: new Date(Date.now() - index * 1000 * 60 * 90).toISOString()
  }));
}

function buildAuditLogs(): AdminAuditLogRow[] {
  return Array.from({ length: 140 }).map((_, index) => ({
    id: 62000 + index,
    actor: users[(index + 7) % users.length].username,
    action: ["SUSPEND_USER", "VERIFY_COMPANY", "REMOVE_JOB", "UPDATE_ROLE", "RESOLVE_REPORT"][index % 5],
    target: index % 2 === 0 ? users[index % users.length].username : companies[index % companies.length].companyName,
    severity: (["critical", "high", "medium", "low"][index % 4] as AdminAuditLogRow["severity"]),
    previousValue: index % 2 === 0 ? "active" : "pending",
    newValue: index % 2 === 0 ? "suspended" : "verified",
    reason: "Policy alignment and trust-safety enforcement",
    timestamp: new Date(Date.now() - index * 1000 * 60 * 18).toISOString()
  }));
}

function buildSystemAlerts(): AdminSystemAlert[] {
  return Array.from({ length: 18 }).map((_, index) => ({
    id: 73000 + index,
    title: [
      "Moderation queue latency",
      "Suspicious login spike",
      "Application API elevated response time",
      "Verification pipeline backlog"
    ][index % 4],
    description: "Automated monitor detected deviation from baseline thresholds.",
    severity: (["critical", "high", "medium", "low"][index % 4] as AdminSystemAlert["severity"]),
    module: (["moderation", "security", "applications", "infrastructure"][index % 4] as AdminSystemAlert["module"]),
    startedAt: new Date(Date.now() - index * 1000 * 60 * 60).toISOString(),
    isAcknowledged: index % 3 === 0
  }));
}

function buildRolePermissions(): AdminRolePermission[] {
  return [
    {
      id: "super-admin",
      roleName: "Super Admin",
      description: "Global control over platform security, moderation, and billing settings.",
      members: 3,
      permissions: ["users:all", "companies:all", "jobs:all", "reports:all", "settings:all", "audit:all"]
    },
    {
      id: "operations-admin",
      roleName: "Operations Admin",
      description: "Manages day-to-day job, company, and application operations.",
      members: 12,
      permissions: ["users:view", "companies:edit", "jobs:edit", "applications:all", "support:all"]
    },
    {
      id: "moderation-admin",
      roleName: "Moderation Admin",
      description: "Handles trust and safety queues with escalation controls.",
      members: 8,
      permissions: ["reports:all", "users:suspend", "jobs:remove", "alerts:view"]
    },
    {
      id: "analytics-admin",
      roleName: "Analytics Admin",
      description: "Owns executive reporting, funnels, and growth insights.",
      members: 5,
      permissions: ["analytics:all", "export:all", "audit:view"]
    },
    {
      id: "support-admin",
      roleName: "Support Admin",
      description: "Resolves user tickets and escalation workflows.",
      members: 10,
      permissions: ["support:all", "users:view", "notifications:all"]
    }
  ];
}

export async function getAdminKpis(): Promise<AdminKpi[]> {
  return [
    { key: "users", title: "Total Users", value: users.length, deltaText: "+8.4% month over month", status: "up" },
    { key: "activeUsers", title: "Active Users Today", value: users.filter((user) => user.status === "active").length, deltaText: "+1.8% vs yesterday", status: "up" },
    { key: "companies", title: "Companies", value: companies.length, deltaText: `${companies.filter((company) => company.verificationStatus === "pending").length} pending verification`, status: "neutral", severity: "watch" },
    { key: "jobs", title: "Job Posts", value: jobs.length, deltaText: `${jobs.filter((job) => job.status === "open").length} currently open`, status: "up" },
    { key: "applications", title: "Applications", value: applications.length, deltaText: "+12.1% weekly growth", status: "up" },
    { key: "reports", title: "Flagged Reports", value: reports.filter((report) => report.status !== "resolved").length, deltaText: "Needs moderation attention", status: "down", severity: "critical" },
    { key: "tickets", title: "Support Tickets", value: tickets.length, deltaText: `${tickets.filter((ticket) => ticket.status !== "resolved").length} open queue`, status: "neutral", severity: "watch" },
    { key: "alerts", title: "Active Alerts", value: alerts.filter((alert) => !alert.isAcknowledged).length, deltaText: "Real-time signal monitoring", status: "down", severity: "critical" }
  ];
}

export async function getAdminTrends(): Promise<AdminTrendPoint[]> {
  return trendPoints;
}

export async function getAdminActivities(): Promise<AdminActivityItem[]> {
  return [
    { id: "a1", type: "user", message: "New recruiter verification submitted by Nova Systems", at: "3 mins ago" },
    { id: "a2", type: "job", message: "High-risk job flagged for manual review", at: "11 mins ago" },
    { id: "a3", type: "report", message: "Escalated abuse report assigned to moderation admin", at: "24 mins ago" },
    { id: "a4", type: "application", message: "Application funnel dropped for Finance category", at: "32 mins ago" },
    { id: "a5", type: "system", message: "Verification pipeline threshold exceeded", at: "47 mins ago" }
  ];
}

export async function listAdminUsersData(): Promise<AdminUserRow[]> {
  return users;
}

export async function listAdminCompaniesData(): Promise<AdminCompanyRow[]> {
  return companies;
}

export async function listAdminJobsData(): Promise<AdminJobRow[]> {
  return jobs;
}

export async function listAdminApplicationsData(): Promise<AdminApplicationRow[]> {
  return applications;
}

export async function listAdminCategoriesData(): Promise<AdminCategoryRow[]> {
  categories = categories.map((category) => ({
    ...category,
    totalJobs: jobs.filter((job) => job.category === category.name).length
  }));
  return categories;
}

export async function listAdminReportsData(): Promise<AdminReportRow[]> {
  return reports;
}

export async function listAdminNotificationsData(): Promise<AdminNotificationRow[]> {
  return notifications;
}

export async function markNotificationAsRead(id: number): Promise<void> {
  notifications = notifications.map((item) => (item.id === id ? { ...item, isRead: true } : item));
}

export async function getAdminSettings(): Promise<AdminSystemSettings> {
  return settings;
}

export async function saveAdminSettings(payload: AdminSystemSettings): Promise<AdminSystemSettings> {
  settings = payload;
  return settings;
}

export async function listAdminSupportTicketsData(): Promise<AdminSupportTicketRow[]> {
  return tickets;
}

export async function listAdminAuditLogsData(): Promise<AdminAuditLogRow[]> {
  return auditLogs;
}

export async function listAdminRolesData(): Promise<AdminRolePermission[]> {
  return rolePermissions;
}

export async function listAdminSystemAlertsData(): Promise<AdminSystemAlert[]> {
  return alerts;
}
