import { useQuery } from "@tanstack/react-query";
import { getAdminActivities, getAdminKpis, getAdminTrends } from "../../services/admin-service";

export function AdminDashboardPage() {
  const { data: kpis = [] } = useQuery({ queryKey: ["admin", "kpis"], queryFn: getAdminKpis });
  const { data: trends = [] } = useQuery({ queryKey: ["admin", "trends"], queryFn: getAdminTrends });
  const { data: activities = [] } = useQuery({ queryKey: ["admin", "activities"], queryFn: getAdminActivities });

  const maxValue = Math.max(...trends.flatMap((item) => [item.users, item.jobs, item.applications]), 1);

  return (
    <div className="stack">
      <div className="grid grid-4">
        {kpis.map((item) => (
          <article key={item.key} className="surface jp-admin-kpi">
            <span className="helper">{item.title}</span>
            <strong>{item.value.toLocaleString("en-US")}</strong>
            <span className={`status ${item.status === "up" ? "status-success" : item.status === "down" ? "status-danger" : "status-info"}`}>
              {item.deltaText}
            </span>
          </article>
        ))}
      </div>

      <div className="grid grid-2">
        <section className="surface" style={{ padding: "1.2rem" }}>
          <div className="space-between">
            <strong>Growth Trends</strong>
            <span className="helper">Users, jobs, applications</span>
          </div>
          <div className="jp-admin-trend-chart">
            {trends.map((point) => (
              <div key={point.label} className="jp-admin-trend-col">
                <div className="jp-admin-bar-stack">
                  <span style={{ height: `${(point.users / maxValue) * 100}%` }} className="jp-admin-bar users" />
                  <span style={{ height: `${(point.jobs / maxValue) * 100}%` }} className="jp-admin-bar jobs" />
                  <span style={{ height: `${(point.applications / maxValue) * 100}%` }} className="jp-admin-bar applications" />
                </div>
                <span className="helper">{point.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="surface" style={{ padding: "1.2rem" }}>
          <div className="space-between">
            <strong>Recent Activity</strong>
            <span className="helper">Live moderation stream</span>
          </div>
          <div className="stack" style={{ marginTop: "0.8rem" }}>
            {activities.map((activity) => (
              <article key={activity.id} className="jp-admin-activity-item">
                <div className="space-between" style={{ alignItems: "center" }}>
                  <span>{activity.message}</span>
                  <span className="helper">{activity.at}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="surface" style={{ padding: "1.2rem" }}>
        <div className="space-between">
          <strong>Quick Actions</strong>
          <span className="helper">High impact moderation shortcuts</span>
        </div>
        <div className="row" style={{ flexWrap: "wrap", marginTop: "0.9rem" }}>
          <button className="btn btn-primary">Approve Company</button>
          <button className="btn btn-secondary">Create Category</button>
          <button className="btn btn-secondary">Review Reports</button>
          <button className="btn btn-secondary">Feature Jobs</button>
        </div>
      </section>
    </div>
  );
}
