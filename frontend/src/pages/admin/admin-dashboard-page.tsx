import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getAdminActivities,
  getAdminKpis,
  getAdminTrends,
  listAdminReportsData,
  listAdminSupportTicketsData,
  listAdminSystemAlertsData
} from "../../services/admin-service";

export function AdminDashboardPage() {
  const { data: kpis = [] } = useQuery({ queryKey: ["admin", "kpis"], queryFn: getAdminKpis });
  const { data: trends = [] } = useQuery({ queryKey: ["admin", "trends"], queryFn: getAdminTrends });
  const { data: activities = [] } = useQuery({ queryKey: ["admin", "activities"], queryFn: getAdminActivities });
  const { data: reports = [] } = useQuery({ queryKey: ["admin", "reports-data"], queryFn: listAdminReportsData });
  const { data: tickets = [] } = useQuery({ queryKey: ["admin", "support-tickets"], queryFn: listAdminSupportTicketsData });
  const { data: alerts = [] } = useQuery({ queryKey: ["admin", "system-alerts"], queryFn: listAdminSystemAlertsData });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"all" | "reports" | "tickets" | "alerts">("all");

  const maxValue = Math.max(...trends.flatMap((item) => [item.users, item.jobs, item.applications]), 1);

  const moderationQueue = useMemo(() => reports.filter((item) => item.status === "pending" || item.status === "reviewing").slice(0, 6), [reports]);
  const ticketQueue = useMemo(() => tickets.filter((item) => item.status !== "resolved").slice(0, 6), [tickets]);
  const criticalAlerts = useMemo(() => alerts.filter((item) => !item.isAcknowledged).slice(0, 4), [alerts]);

  return (
    <div className="stack" style={{ padding: "0 1rem 1rem" }}>
      {/* Search & Filter Section */}
      <section className="surface" style={{ padding: "2rem", borderRadius: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", marginBottom: "2rem" }}>
        <div className="stack" style={{ gap: "1.5rem" }}>
          <div style={{ display: "flex", gap: "0.8rem", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--text-secondary)" }}>
                Global Search
              </label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ position: "absolute", left: "0.8rem", pointerEvents: "none", color: "var(--text-secondary)" }}
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search reports, tickets, users, companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    paddingLeft: "2.5rem",
                    paddingRight: "2.5rem",
                    padding: "0.75rem 0.8rem 0.75rem 2.5rem",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    fontSize: "0.95rem",
                    backgroundColor: "var(--surface-alt)",
                    transition: "all var(--transition-fast)",
                    outline: "none"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--primary)";
                    e.target.style.backgroundColor = "var(--surface)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border)";
                    e.target.style.backgroundColor = "var(--surface-alt)";
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    style={{
                      position: "absolute",
                      right: "0.8rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "0.25rem",
                      color: "var(--text-secondary)",
                      fontSize: "1.1rem",
                      lineHeight: 1
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div style={{ minWidth: "180px" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--text-secondary)" }}>
                Filter By
              </label>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as any)}
                style={{
                  width: "100%",
                  padding: "0.75rem 0.8rem",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  fontSize: "0.95rem",
                  backgroundColor: "var(--surface-alt)",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)"
                }}
              >
                <option value="all">All Items</option>
                <option value="reports">Reports Only</option>
                <option value="tickets">Tickets Only</option>
                <option value="alerts">Alerts Only</option>
              </select>
            </div>
          </div>

          {searchQuery && (
            <div className="helper" style={{ color: "var(--text-secondary)" }}>
              Found results for "{searchQuery}" • Showing <strong>0</strong> matches
            </div>
          )}
        </div>
      </section>

      {/* KPI Cards */}
      <div className="grid grid-4">
        {kpis.map((item) => (
          <article
            key={item.key}
            className={`surface jp-admin-kpi ${item.severity === "critical" ? "jp-admin-kpi-critical" : ""}`}
            style={{
              padding: "1.4rem",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              transition: "all var(--transition-normal)",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 16px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.6rem" }}>
              <span className="helper" style={{ fontSize: "0.85rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {item.title}
              </span>
              <span
                className={`status ${item.status === "up" ? "status-success" : item.status === "down" ? "status-danger" : "status-info"}`}
                style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem", borderRadius: "6px" }}
              >
                {item.status === "up" ? "↑" : item.status === "down" ? "↓" : "→"} {Math.abs(parseInt(item.deltaText))}%
              </span>
            </div>
            <strong style={{ fontSize: "2rem", display: "block", marginBottom: "0.4rem" }}>{item.value.toLocaleString("en-US")}</strong>
            <span className="helper" style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              {item.deltaText}
            </span>
          </article>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-2">
        {/* Growth Intelligence */}
        <section className="surface jp-admin-section" style={{ padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border)" }}>
          <div className="space-between">
            <div>
              <strong style={{ fontSize: "1.1rem", display: "block", marginBottom: "0.25rem" }}>Growth Intelligence</strong>
              <span className="helper">Users, jobs, applications trend</span>
            </div>
            <button className="btn btn-secondary" style={{ padding: "0.5rem 0.8rem", fontSize: "0.85rem" }}>
              View Details
            </button>
          </div>
          <div className="jp-admin-trend-chart" style={{ marginTop: "1.2rem" }}>
            {trends.map((point) => (
              <div key={point.label} className="jp-admin-trend-col" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                <div
                  className="jp-admin-bar-stack"
                  style={{
                    display: "flex",
                    backgroundColor: "var(--surface-alt)",
                    borderRadius: "6px",
                    overflow: "hidden",
                    height: "120px",
                    width: "100%",
                    flexDirection: "column-reverse"
                  }}
                >
                  <span style={{ height: `${(point.users / maxValue) * 100}%`, backgroundColor: "var(--primary)", transition: "all var(--transition-normal)" }} className="jp-admin-bar users" />
                  <span style={{ height: `${(point.jobs / maxValue) * 100}%`, backgroundColor: "var(--accent)", transition: "all var(--transition-normal)" }} className="jp-admin-bar jobs" />
                  <span style={{ height: `${(point.applications / maxValue) * 100}%`, backgroundColor: "var(--success)", transition: "all var(--transition-normal)" }} className="jp-admin-bar applications" />
                </div>
                <span className="helper" style={{ fontSize: "0.8rem" }}>{point.label}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", fontSize: "0.85rem" }}>
            <div className="row" style={{ gap: "0.4rem", alignItems: "center" }}>
              <div style={{ width: "12px", height: "12px", backgroundColor: "var(--primary)", borderRadius: "3px" }} />
              <span className="helper">Users</span>
            </div>
            <div className="row" style={{ gap: "0.4rem", alignItems: "center" }}>
              <div style={{ width: "12px", height: "12px", backgroundColor: "var(--accent)", borderRadius: "3px" }} />
              <span className="helper">Jobs</span>
            </div>
            <div className="row" style={{ gap: "0.4rem", alignItems: "center" }}>
              <div style={{ width: "12px", height: "12px", backgroundColor: "var(--success)", borderRadius: "3px" }} />
              <span className="helper">Applications</span>
            </div>
          </div>
        </section>

        {/* Critical Alert Stream */}
        <section className="surface jp-admin-section" style={{ padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border)" }}>
          <div className="space-between">
            <div>
              <strong style={{ fontSize: "1.1rem", display: "block", marginBottom: "0.25rem" }}>Critical Alert Stream</strong>
              <span className="helper">System & platform alerts</span>
            </div>
            <Link className="btn btn-secondary" to="/admin/monitoring" style={{ padding: "0.5rem 0.8rem", fontSize: "0.85rem" }}>
              View All
            </Link>
          </div>
          <div className="stack" style={{ marginTop: "1rem", gap: "0.6rem" }}>
            {criticalAlerts.map((alert) => (
              <article
                key={alert.id}
                className="jp-admin-activity-item"
                style={{
                  padding: "0.8rem",
                  backgroundColor: "var(--surface-alt)",
                  borderRadius: "8px",
                  borderLeft: `3px solid ${alert.severity === "critical" ? "var(--danger)" : "var(--warning)"}`
                }}
              >
                <div className="space-between">
                  <div className="stack" style={{ gap: "0.15rem" }}>
                    <strong style={{ fontSize: "0.95rem" }}>{alert.title}</strong>
                    <span className="helper">{alert.description}</span>
                  </div>
                  <span className={`status ${alert.severity === "critical" ? "status-danger" : "status-warning"}`} style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
              </article>
            ))}
            {!criticalAlerts.length && <span className="helper">No critical alerts at this time</span>}
          </div>
        </section>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-3">
        {/* Moderation Queue */}
        <section className="surface jp-admin-section" style={{ padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border)" }}>
          <div className="space-between">
            <div>
              <strong style={{ fontSize: "1rem", display: "block", marginBottom: "0.25rem" }}>Moderation Queue</strong>
              <span className="helper">{moderationQueue.length} items pending</span>
            </div>
            <Link className="btn btn-secondary" to="/admin/reports" style={{ padding: "0.5rem 0.8rem", fontSize: "0.85rem" }}>
              Review All
            </Link>
          </div>
          <div className="stack" style={{ marginTop: "1rem", gap: "0.6rem" }}>
            {moderationQueue.map((report) => (
              <article
                key={report.id}
                className="jp-admin-activity-item"
                style={{
                  padding: "0.8rem",
                  backgroundColor: "var(--surface-alt)",
                  borderRadius: "8px",
                  borderLeft: `3px solid ${report.severity === "critical" ? "var(--danger)" : report.severity === "high" ? "var(--warning)" : "var(--info)"}`
                }}
              >
                <div className="space-between">
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.95rem" }}>{report.reason}</div>
                    <div className="helper" style={{ marginTop: "0.2rem", fontSize: "0.85rem" }}>
                      #{report.id} · Target: <strong>{report.target}</strong>
                    </div>
                  </div>
                  <span
                    className={`status ${report.severity === "critical" ? "status-danger" : report.severity === "high" ? "status-warning" : "status-info"}`}
                    style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
                  >
                    {report.severity}
                  </span>
                </div>
              </article>
            ))}
            {!moderationQueue.length && <span className="helper">No items in moderation queue</span>}
          </div>
        </section>

        {/* Support Backlog */}
        <section className="surface jp-admin-section" style={{ padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border)" }}>
          <div className="space-between">
            <div>
              <strong style={{ fontSize: "1rem", display: "block", marginBottom: "0.25rem" }}>Support Backlog</strong>
              <span className="helper">{ticketQueue.length} active tickets</span>
            </div>
            <Link className="btn btn-secondary" to="/admin/support" style={{ padding: "0.5rem 0.8rem", fontSize: "0.85rem" }}>
              Open Tickets
            </Link>
          </div>
          <div className="stack" style={{ marginTop: "1rem", gap: "0.6rem" }}>
            {ticketQueue.map((ticket) => (
              <article
                key={ticket.id}
                className="jp-admin-activity-item"
                style={{
                  padding: "0.8rem",
                  backgroundColor: "var(--surface-alt)",
                  borderRadius: "8px",
                  borderLeft: `3px solid ${ticket.priority === "critical" ? "var(--danger)" : ticket.priority === "high" ? "var(--warning)" : "var(--info)"}`
                }}
              >
                <div className="space-between">
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.95rem", fontWeight: 500 }}>{ticket.subject}</div>
                    <div className="helper" style={{ marginTop: "0.2rem", fontSize: "0.85rem" }}>
                      {ticket.assignedTo} · SLA: <strong>{ticket.slaHoursLeft}h</strong>
                    </div>
                  </div>
                  <span
                    className={`status ${ticket.priority === "critical" ? "status-danger" : ticket.priority === "high" ? "status-warning" : "status-info"}`}
                    style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
                  >
                    {ticket.priority}
                  </span>
                </div>
              </article>
            ))}
            {!ticketQueue.length && <span className="helper">All tickets resolved</span>}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="surface jp-admin-section" style={{ padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border)" }}>
          <div className="space-between">
            <div>
              <strong style={{ fontSize: "1rem", display: "block", marginBottom: "0.25rem" }}>Recent Activity</strong>
              <span className="helper">Latest audit logs</span>
            </div>
            <Link className="btn btn-secondary" to="/admin/audit-logs" style={{ padding: "0.5rem 0.8rem", fontSize: "0.85rem" }}>
              Open Audit
            </Link>
          </div>
          <div className="stack" style={{ marginTop: "1rem", gap: "0.6rem" }}>
            {activities.map((activity) => (
              <article key={activity.id} className="jp-admin-activity-item" style={{ padding: "0.8rem", backgroundColor: "var(--surface-alt)", borderRadius: "8px", borderLeft: "3px solid var(--primary)" }}>
                <div className="space-between" style={{ alignItems: "flex-start" }}>
                  <span style={{ fontSize: "0.95rem" }}>{activity.message}</span>
                  <span className="helper" style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}>{activity.at}</span>
                </div>
              </article>
            ))}
            {!activities.length && <span className="helper">No recent activity</span>}
          </div>
        </section>
      </div>

      {/* Quick Actions Section */}
      <section className="surface" style={{ padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border)", backgroundColor: "linear-gradient(135deg, var(--surface-alt) 0%, var(--surface) 100%)" }}>
        <div className="stack" style={{ gap: "1rem" }}>
          <div>
            <strong style={{ fontSize: "1.1rem", display: "block", marginBottom: "0.25rem" }}>Quick Enterprise Actions</strong>
            <span className="helper">High-impact controls for operations teams</span>
          </div>
          <div className="row" style={{ flexWrap: "wrap", gap: "0.6rem" }}>
            <Link className="btn btn-primary" to="/admin/companies" style={{ padding: "0.7rem 1.2rem" }}>
              ✓ Approve Companies
            </Link>
            <Link className="btn btn-secondary" to="/admin/jobs" style={{ padding: "0.7rem 1.2rem" }}>
              📝 Moderate Jobs
            </Link>
            <Link className="btn btn-secondary" to="/admin/reports" style={{ padding: "0.7rem 1.2rem" }}>
              🔍 Resolve Reports
            </Link>
            <Link className="btn btn-secondary" to="/admin/permissions" style={{ padding: "0.7rem 1.2rem" }}>
              🔑 Manage Permissions
            </Link>
            <Link className="btn btn-secondary" to="/admin/settings" style={{ padding: "0.7rem 1.2rem" }}>
              ⚙️ Platform Controls
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
