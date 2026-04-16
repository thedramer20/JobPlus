import { lazy, Suspense, type ComponentType } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AppFrame } from "../components/system/app-frame";
import { DashboardLayout } from "../layouts/dashboard-layout";
import { AdminLayout } from "../layouts/admin-layout";
import { MarketingLayout } from "../layouts/marketing-layout";
import { AuthLayout } from "../layouts/auth-layout";
import { ProtectedRoute, RoleRoute } from "../components/route-guards";

const HomePage = lazy(async () => ({ default: (await import("../pages/home-page")).HomePage }));
const LoginPage = lazy(async () => ({ default: (await import("../pages/login-page")).LoginPage }));
const RegisterPage = lazy(async () => ({ default: (await import("../pages/register-page")).RegisterPage }));
const JobsPage = lazy(async () => ({ default: (await import("../pages/jobs-page")).JobsPage }));
const JobDetailsPage = lazy(async () => ({ default: (await import("../pages/job-details-page")).JobDetailsPage }));
const ApplyPage = lazy(async () => ({ default: (await import("../pages/apply-page")).ApplyPage }));
const CompaniesPage = lazy(async () => ({ default: (await import("../pages/companies-page")).CompaniesPage }));
const AboutPage = lazy(async () => ({ default: (await import("../pages/about-page")).AboutPage }));
const ContactPage = lazy(async () => ({ default: (await import("../pages/contact-page")).ContactPage }));
const TopContentPage = lazy(async () => ({ default: (await import("../pages/top-content-page")).TopContentPage }));
const ForgotPasswordPage = lazy(async () => ({ default: (await import("../pages/forgot-password-page")).ForgotPasswordPage }));
const ResetPasswordPage = lazy(async () => ({ default: (await import("../pages/reset-password-page")).ResetPasswordPage }));
const AuthCallbackPage = lazy(async () => ({ default: (await import("../pages/auth-callback-page")).AuthCallbackPage }));
const CandidateDashboardPage = lazy(async () => ({ default: (await import("../pages/candidate-dashboard-page")).CandidateDashboardPage }));
const ApplicationsPage = lazy(async () => ({ default: (await import("../pages/applications-page")).ApplicationsPage }));
const NotificationsPage = lazy(async () => ({ default: (await import("../pages/notifications-page")).NotificationsPage }));
const MessagesPage = lazy(async () => ({ default: (await import("../pages/messages-page")).MessagesPage }));
const ProfilePage = lazy(async () => ({ default: (await import("../pages/profile-page")).ProfilePage }));
const NetworkPage = lazy(async () => ({ default: (await import("../pages/network-page")).NetworkPage }));
const SavedJobsPage = lazy(async () => ({ default: (await import("../pages/saved-jobs-page")).SavedJobsPage }));
const SettingsPage = lazy(async () => ({ default: (await import("../pages/settings-page")).SettingsPage }));
const EmployerDashboardPage = lazy(async () => ({ default: (await import("../pages/employer-dashboard-page")).EmployerDashboardPage }));
const CompanyManagementPage = lazy(async () => ({ default: (await import("../pages/company-management-page")).CompanyManagementPage }));
const CompanyProfilePage = lazy(async () => ({ default: (await import("../pages/company-profile-page")).CompanyProfilePage }));
const EmployerJobsPage = lazy(async () => ({ default: (await import("../pages/employer-jobs-page")).EmployerJobsPage }));
const PostJobPage = lazy(async () => ({ default: (await import("../pages/post-job-page")).PostJobPage }));
const EditJobPage = lazy(async () => ({ default: (await import("../pages/edit-job-page")).EditJobPage }));
const AdminDashboardPage = lazy(async () => ({ default: (await import("../pages/admin/admin-dashboard-page")).AdminDashboardPage }));
const AdminUsersPage = lazy(async () => ({ default: (await import("../pages/admin/admin-users-page")).AdminUsersPage }));
const AdminCompaniesPage = lazy(async () => ({ default: (await import("../pages/admin/admin-companies-page")).AdminCompaniesPage }));
const AdminJobsPage = lazy(async () => ({ default: (await import("../pages/admin/admin-jobs-page")).AdminJobsPage }));
const AdminApplicationsPage = lazy(async () => ({ default: (await import("../pages/admin/admin-applications-page")).AdminApplicationsPage }));
const AdminCategoriesPage = lazy(async () => ({ default: (await import("../pages/admin/admin-categories-page")).AdminCategoriesPage }));
const AdminReportsPage = lazy(async () => ({ default: (await import("../pages/admin/admin-reports-page")).AdminReportsPage }));
const AdminNotificationsPage = lazy(async () => ({ default: (await import("../pages/admin/admin-notifications-page")).AdminNotificationsPage }));
const AdminAnalyticsPage = lazy(async () => ({ default: (await import("../pages/admin/admin-analytics-page")).AdminAnalyticsPage }));
const AdminSettingsPage = lazy(async () => ({ default: (await import("../pages/admin/admin-settings-page")).AdminSettingsPage }));
const AdminProfilePage = lazy(async () => ({ default: (await import("../pages/admin/admin-profile-page")).AdminProfilePage }));
const AdminSupportPage = lazy(async () => ({ default: (await import("../pages/admin/admin-support-page")).AdminSupportPage }));
const AdminPermissionsPage = lazy(async () => ({ default: (await import("../pages/admin/admin-permissions-page")).AdminPermissionsPage }));
const AdminAuditPage = lazy(async () => ({ default: (await import("../pages/admin/admin-audit-page")).AdminAuditPage }));
const AdminMonitoringPage = lazy(async () => ({ default: (await import("../pages/admin/admin-monitoring-page")).AdminMonitoringPage }));
const ForbiddenPage = lazy(async () => ({ default: (await import("../pages/forbidden-page")).ForbiddenPage }));
const NotFoundPage = lazy(async () => ({ default: (await import("../pages/not-found-page")).NotFoundPage }));
const CategoryDetailsPage = lazy(async () => ({ default: (await import("../pages/category-details-page")).CategoryDetailsPage }));

function withSuspense(Component: ComponentType) {
  return (
    <Suspense fallback={null}>
      <Component />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    element: <AppFrame />,
    children: [
      {
        element: <MarketingLayout />,
        children: [
          { path: "/", element: withSuspense(HomePage) },
          { path: "/companies", element: withSuspense(CompaniesPage) },
          { path: "/about", element: withSuspense(AboutPage) },
          { path: "/contact", element: withSuspense(ContactPage) },
          { path: "/top-content", element: withSuspense(TopContentPage) },
          { path: "/jobs", element: withSuspense(JobsPage) },
          { path: "/jobs/:jobId", element: withSuspense(JobDetailsPage) },
          { path: "/jobs/:jobId/apply", element: withSuspense(ApplyPage) },
          { path: "/companies/:companyId", element: withSuspense(CompanyProfilePage) },
          { path: "/category/:categoryName", element: withSuspense(CategoryDetailsPage) },
          { path: "/profile/:username", element: withSuspense(ProfilePage) }
        ]
      },
      {
        element: <AuthLayout />,
        children: [
          { path: "/login", element: withSuspense(LoginPage) },
          { path: "/register", element: withSuspense(RegisterPage) },
          { path: "/forgot-password", element: withSuspense(ForgotPasswordPage) },
          { path: "/reset-password", element: withSuspense(ResetPasswordPage) },
          { path: "/auth/callback", element: withSuspense(AuthCallbackPage) }
        ]
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <RoleRoute allowedRoles={["candidate"]} />,
            children: [
              {
                path: "/app",
                element: <DashboardLayout />,
                children: [
                  { path: "dashboard", element: withSuspense(CandidateDashboardPage) },
                  { path: "applications", element: withSuspense(ApplicationsPage) },
                  { path: "messages", element: withSuspense(MessagesPage) },
                  { path: "notifications", element: withSuspense(NotificationsPage) },
                  { path: "network", element: withSuspense(NetworkPage) },
                  { path: "profile", element: withSuspense(ProfilePage) },
                  { path: "saved-jobs", element: withSuspense(SavedJobsPage) },
                  { path: "settings", element: withSuspense(SettingsPage) }
                ]
              }
            ]
          },
          {
            element: <RoleRoute allowedRoles={["employer"]} />,
            children: [
              {
                path: "/employer",
                element: <DashboardLayout />,
                children: [
                  { path: "dashboard", element: withSuspense(EmployerDashboardPage) },
                  { path: "company", element: withSuspense(CompanyManagementPage) },
                  { path: "jobs", element: withSuspense(EmployerJobsPage) },
                  { path: "jobs/new", element: withSuspense(PostJobPage) },
                  { path: "jobs/:jobId/edit", element: withSuspense(EditJobPage) },
                  { path: "messages", element: withSuspense(MessagesPage) },
                  { path: "notifications", element: withSuspense(NotificationsPage) },
                  { path: "network", element: withSuspense(NetworkPage) },
                  { path: "settings", element: withSuspense(SettingsPage) }
                ]
              }
            ]
          },
          {
            element: <RoleRoute allowedRoles={["admin"]} />,
            children: [
              {
                path: "/admin",
                element: <AdminLayout />,
                children: [
                  { index: true, element: withSuspense(AdminDashboardPage) },
                  { path: "users", element: withSuspense(AdminUsersPage) },
                  { path: "companies", element: withSuspense(AdminCompaniesPage) },
                  { path: "jobs", element: withSuspense(AdminJobsPage) },
                  { path: "applications", element: withSuspense(AdminApplicationsPage) },
                  { path: "categories", element: withSuspense(AdminCategoriesPage) },
                  { path: "reports", element: withSuspense(AdminReportsPage) },
                  { path: "notifications", element: withSuspense(AdminNotificationsPage) },
                  { path: "analytics", element: withSuspense(AdminAnalyticsPage) },
                  { path: "support", element: withSuspense(AdminSupportPage) },
                  { path: "permissions", element: withSuspense(AdminPermissionsPage) },
                  { path: "audit-logs", element: withSuspense(AdminAuditPage) },
                  { path: "monitoring", element: withSuspense(AdminMonitoringPage) },
                  { path: "settings", element: withSuspense(AdminSettingsPage) },
                  { path: "profile", element: withSuspense(AdminProfilePage) }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  { path: "/403", element: withSuspense(ForbiddenPage) },
  { path: "*", element: withSuspense(NotFoundPage) }
]);
