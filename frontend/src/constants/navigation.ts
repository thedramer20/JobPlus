import type { UserRole } from "../types/auth";

export interface NavItem {
  label: string;
  path: string;
}

export const publicNavigation: NavItem[] = [
  { label: "Jobs", path: "/jobs" },
  { label: "Companies", path: "/companies" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "For Employers", path: "/register" }
];

export const roleNavigation: Record<Exclude<UserRole, "guest">, NavItem[]> = {
  candidate: [
    { label: "Dashboard", path: "/app/dashboard" },
    { label: "Applications", path: "/app/applications" },
    { label: "Saved Jobs", path: "/app/saved-jobs" },
    { label: "Notifications", path: "/app/notifications" },
    { label: "Profile", path: "/app/profile" },
    { label: "Settings", path: "/app/settings" }
  ],
  employer: [
    { label: "Dashboard", path: "/employer/dashboard" },
    { label: "Company", path: "/employer/company" },
    { label: "Jobs", path: "/employer/jobs" },
    { label: "Post Job", path: "/employer/jobs/new" },
    { label: "Settings", path: "/employer/settings" }
  ],
  admin: [
    { label: "Dashboard", path: "/admin" },
    { label: "Users", path: "/admin/users" },
    { label: "Companies", path: "/admin/companies" },
    { label: "Jobs", path: "/admin/jobs" },
    { label: "Applications", path: "/admin/applications" },
    { label: "Categories", path: "/admin/categories" },
    { label: "Reports", path: "/admin/reports" },
    { label: "Notifications", path: "/admin/notifications" },
    { label: "Analytics", path: "/admin/analytics" },
    { label: "Settings", path: "/admin/settings" },
    { label: "Profile", path: "/admin/profile" }
  ]
};
