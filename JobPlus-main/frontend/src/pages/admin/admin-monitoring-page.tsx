import { useQuery } from "@tanstack/react-query";
import { listAdminSystemAlertsData } from "../../services/admin-service";

export function AdminMonitoringPage() {
  const { data: alerts = [] } = useQuery({ queryKey: ["admin", "system-alerts"], queryFn: listAdminSystemAlertsData });

  return (
    <section className="stack">
      <section className="surface jp-admin-section">
        <div className="space-between">
          <div>
            <h2 style={{ margin: 0 }}>System Monitoring</h2>
            <p className="helper">Watch trust-and-safety spikes, security signals, and infrastructure anomalies.</p>
          </div>
          <div className="row">
            <button className="btn btn-secondary">Acknowledge Selected</button>
            <button className="btn btn-primary">Create Incident</button>
          </div>
        </div>
      </section>

      <div className="grid grid-3">
        {alerts.map((alert) => (
          <article key={alert.id} className="surface jp-admin-alert-card">
            <div className="space-between">
              <span className={`status ${alert.severity === "critical" ? "status-danger" : alert.severity === "high" ? "status-warning" : "status-info"}`}>
                {alert.severity}
              </span>
              <span className="tag">{alert.module}</span>
            </div>
            <h3 style={{ marginBottom: "0.35rem" }}>{alert.title}</h3>
            <p className="helper" style={{ marginTop: 0 }}>{alert.description}</p>
            <div className="space-between">
              <span className="helper">{new Date(alert.startedAt).toLocaleString()}</span>
              <span className={`pill ${alert.isAcknowledged ? "status-success" : ""}`}>{alert.isAcknowledged ? "Acknowledged" : "Unacknowledged"}</span>
            </div>
            <div className="row" style={{ marginTop: "0.8rem" }}>
              <button className="btn btn-secondary">Open Incident</button>
              <button className="btn btn-secondary">Jump to Module</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
