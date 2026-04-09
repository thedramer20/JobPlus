import { createBrowserRouter } from "react-router-dom";
import { DashboardLayout } from "../layouts/dashboard-layout";
import { MarketingLayout } from "../layouts/marketing-layout";
import { ProtectedRoute, RoleRoute } from "../components/route-guards";
import { HomePage } from "../pages/home-page";
import { LoginPage } from "../pages/login-page";
import { RegisterPage } from "../pages/register-page";
import { JobsPage } from "../pages/jobs-page";
import { JobDetailsPage } from "../pages/job-details-page";
import { ApplyPage } from "../pages/apply-page";
import { CompaniesPage } from "../pages/companies-page";
import { AboutPage } from "../pages/about-page";
import { ContactPage } from "../pages/contact-page";
import { ForgotPasswordPage } from "../pages/forgot-password-page";
import { ResetPasswordPage } from "../pages/reset-password-page";
import { CandidateDashboardPage } from "../pages/candidate-dashboard-page";
import { ApplicationsPage } from "../pages/applications-page";
import { NotificationsPage } from "../pages/notifications-page";
import { ProfilePage } from "../pages/profile-page";
import { SavedJobsPage } from "../pages/saved-jobs-page";
import { SettingsPage } from "../pages/settings-page";
import { EmployerDashboardPage } from "../pages/employer-dashboard-page";
import { CompanyManagementPage } from "../pages/company-management-page";
import { CompanyProfilePage } from "../pages/company-profile-page";
import { EmployerJobsPage } from "../pages/employer-jobs-page";
import { PostJobPage } from "../pages/post-job-page";
import { EditJobPage } from "../pages/edit-job-page";
import { AdminPage } from "../pages/admin-page";
import { ForbiddenPage } from "../pages/forbidden-page";
import { NotFoundPage } from "../pages/not-found-page";

export const router = createBrowserRouter([
  {
    element: <MarketingLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/reset-password", element: <ResetPasswordPage /> },
      { path: "/companies", element: <CompaniesPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/jobs", element: <JobsPage /> },
      { path: "/jobs/:jobId", element: <JobDetailsPage /> },
      { path: "/jobs/:jobId/apply", element: <ApplyPage /> },
      { path: "/companies/:companyId", element: <CompanyProfilePage /> }
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
              { path: "dashboard", element: <CandidateDashboardPage /> },
              { path: "applications", element: <ApplicationsPage /> },
              { path: "notifications", element: <NotificationsPage /> },
              { path: "profile", element: <ProfilePage /> },
              { path: "saved-jobs", element: <SavedJobsPage /> },
              { path: "settings", element: <SettingsPage /> }
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
              { path: "dashboard", element: <EmployerDashboardPage /> },
              { path: "company", element: <CompanyManagementPage /> },
              { path: "jobs", element: <EmployerJobsPage /> },
              { path: "jobs/new", element: <PostJobPage /> },
              { path: "jobs/:jobId/edit", element: <EditJobPage /> },
              { path: "settings", element: <SettingsPage /> }
            ]
          }
        ]
      },
      {
        element: <RoleRoute allowedRoles={["admin"]} />,
        children: [
          {
            path: "/admin",
            element: <DashboardLayout />,
            children: [
              { index: true, element: <AdminPage /> },
              { path: "users", element: <AdminPage /> },
              { path: "companies", element: <AdminPage /> },
              { path: "jobs", element: <AdminPage /> }
            ]
          }
        ]
      }
    ]
  },
  { path: "/403", element: <ForbiddenPage /> },
  { path: "*", element: <NotFoundPage /> }
]);
