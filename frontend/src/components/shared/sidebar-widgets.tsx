import { NavLink } from "react-router-dom";
import type { Job } from "../../types/job";
import type { Company } from "../../types/company";
import type { Notification } from "../../types/meta";

interface ProfileSummaryWidgetProps {
  name: string;
  roleLabel: string;
  title?: string;
  profileHref: string;
}

interface SuggestedJobsWidgetProps {
  jobs: Job[];
  loading?: boolean;
}

interface SuggestedCompaniesWidgetProps {
  companies: Company[];
  loading?: boolean;
}

interface HiringInsightsWidgetProps {
  notifications: Notification[];
  loading?: boolean;
}

export function ProfileSummaryWidget({ name, roleLabel, title, profileHref }: ProfileSummaryWidgetProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="surface jp-dashboard-widget jp-profile-summary-widget">
      <div className="eyebrow">Profile summary</div>
      <div className="jp-profile-summary-head">
        <div className="jp-profile-summary-avatar" aria-hidden="true">
          {initials}
        </div>
        <div className="jp-profile-summary-copy">
          <h3 className="jp-profile-summary-name">{name}</h3>
          <div className="helper jp-profile-summary-role">{roleLabel}</div>
        </div>
      </div>
      <p className="helper jp-profile-summary-text">
        {title ?? `Signed in as ${roleLabel}. Complete your profile to improve matching quality.`}
      </p>
      <NavLink className="btn btn-secondary jp-profile-summary-action" to={profileHref}>
        Open profile
      </NavLink>
    </article>
  );
}

export function SuggestedJobsWidget({ jobs, loading }: SuggestedJobsWidgetProps) {
  return (
    <article className="surface jp-dashboard-widget">
      <div className="space-between jp-dashboard-widget-header">
        <strong className="jp-dashboard-widget-title">Suggested roles</strong>
        <NavLink className="helper" to="/jobs">
          View all
        </NavLink>
      </div>
      <div className="stack jp-dashboard-widget-list">
        {loading ? (
          <div className="helper">Loading roles...</div>
        ) : (
          jobs.slice(0, 3).map((job) => (
            <NavLink key={job.id} className="jp-dashboard-mini-link" to={`/jobs/${job.id}`}>
              <strong>{job.title}</strong>
              <small>
                {job.company} - {job.location}
              </small>
            </NavLink>
          ))
        )}
        {!loading && !jobs.length ? <div className="helper">No suggestions yet.</div> : null}
      </div>
    </article>
  );
}

export function SuggestedCompaniesWidget({ companies, loading }: SuggestedCompaniesWidgetProps) {
  return (
    <article className="surface jp-dashboard-widget">
      <div className="space-between jp-dashboard-widget-header">
        <strong className="jp-dashboard-widget-title">Suggested companies</strong>
        <NavLink className="helper" to="/companies">
          Browse
        </NavLink>
      </div>
      <div className="stack jp-dashboard-widget-list">
        {loading ? (
          <div className="helper">Loading companies...</div>
        ) : (
          companies.slice(0, 3).map((company) => (
            <NavLink key={company.id} className="jp-dashboard-mini-link" to={`/companies/${company.id}`}>
              <strong>{company.name}</strong>
              <small>
                {company.industry} - {company.location}
              </small>
            </NavLink>
          ))
        )}
        {!loading && !companies.length ? <div className="helper">No company suggestions yet.</div> : null}
      </div>
    </article>
  );
}

export function HiringInsightsWidget({ notifications, loading }: HiringInsightsWidgetProps) {
  return (
    <article className="surface jp-dashboard-widget">
      <strong className="jp-dashboard-widget-title">Hiring insights</strong>
      <div className="stack jp-dashboard-widget-list">
        {loading ? (
          <div className="helper">Loading insights...</div>
        ) : (
          notifications.slice(0, 3).map((notification) => (
            <div key={notification.id} className="jp-dashboard-mini-line">
              <small>{notification.type}</small>
              <span>{notification.message}</span>
            </div>
          ))
        )}
        {!loading && !notifications.length ? <div className="helper">No updates yet.</div> : null}
      </div>
    </article>
  );
}
