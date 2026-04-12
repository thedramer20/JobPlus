import type { UserRole } from "../types/auth";

export interface NavItem {
  key: string;
  labelKey: string;
  path: string;
}

export const publicNavigation: NavItem[] = [
  { key: "jobs", labelKey: "common.jobs", path: "/jobs" },
  { key: "companies", labelKey: "common.companies", path: "/companies" },
  { key: "about", labelKey: "nav.about", path: "/about" },
  { key: "contact", labelKey: "nav.contact", path: "/contact" },
  { key: "for-employers", labelKey: "nav.forEmployers", path: "/register" }
];

export const roleNavigation: Record<Exclude<UserRole, "guest">, NavItem[]> = {
  candidate: [
    { key: "dashboard", labelKey: "nav.dashboard", path: "/app/dashboard" },
    { key: "applications", labelKey: "nav.applications", path: "/app/applications" },
    { key: "messages", labelKey: "common.messages", path: "/app/messages" },
    { key: "saved-jobs", labelKey: "nav.savedJobs", path: "/app/saved-jobs" },
    { key: "notifications", labelKey: "common.notifications", path: "/app/notifications" },
    { key: "profile", labelKey: "common.profile", path: "/app/profile" },
    { key: "settings", labelKey: "common.settings", path: "/app/settings" }
  ],
  employer: [
    { key: "dashboard", labelKey: "nav.dashboard", path: "/employer/dashboard" },
    { key: "company", labelKey: "nav.company", path: "/employer/company" },
    { key: "jobs", labelKey: "common.jobs", path: "/employer/jobs" },
    { key: "messages", labelKey: "common.messages", path: "/employer/messages" },
    { key: "notifications", labelKey: "common.notifications", path: "/employer/notifications" },
    { key: "post-job", labelKey: "nav.postJob", path: "/employer/jobs/new" },
    { key: "settings", labelKey: "common.settings", path: "/employer/settings" }
  ],
  admin: [
    { key: "dashboard", labelKey: "nav.dashboard", path: "/admin" },
    { key: "users", labelKey: "nav.users", path: "/admin/users" },
    { key: "companies", labelKey: "common.companies", path: "/admin/companies" },
    { key: "jobs", labelKey: "common.jobs", path: "/admin/jobs" },
    { key: "applications", labelKey: "nav.applications", path: "/admin/applications" },
    { key: "categories", labelKey: "nav.categories", path: "/admin/categories" },
    { key: "reports", labelKey: "nav.reports", path: "/admin/reports" },
    { key: "notifications", labelKey: "common.notifications", path: "/admin/notifications" },
    { key: "analytics", labelKey: "nav.analytics", path: "/admin/analytics" },
    { key: "settings", labelKey: "common.settings", path: "/admin/settings" },
    { key: "profile", labelKey: "common.profile", path: "/admin/profile" }
  ]
};
