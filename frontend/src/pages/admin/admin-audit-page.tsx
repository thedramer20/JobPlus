import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listAdminAuditLogsData } from "../../services/admin-service";

export function AdminAuditPage() {
  const { data: logs = [] } = useQuery({ queryKey: ["admin", "audit-logs"], queryFn: listAdminAuditLogsData });
  const [severity, setSeverity] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      const normalized = query.toLowerCase();
      const matchesQuery =
        log.actor.toLowerCase().includes(normalized) ||
        log.target.toLowerCase().includes(normalized) ||
        log.action.toLowerCase().includes(normalized);
      const matchesSeverity = severity === "all" || log.severity === severity;
      return matchesQuery && matchesSeverity;
    });
  }, [logs, severity, query]);

  return (
    <section className="surface jp-admin-section">
      <div className="space-between">
        <div>
          <h2 style={{ margin: 0 }}>Audit Logs</h2>
          <p className="helper">Track every admin action with before-after values and reason trails.</p>
        </div>
        <div className="row">
          <button className="btn btn-secondary">Export Logs</button>
          <button className="btn btn-secondary">Saved Filters</button>
        </div>
      </div>

      <div className="row jp-admin-filter-row">
        <input className="input" placeholder="Search actor, target, action..." value={query} onChange={(event) => setQuery(event.target.value)} />
        <select className="select" value={severity} onChange={(event) => setSeverity(event.target.value)}>
          <option value="all">All severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <table className="table" style={{ marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>Actor</th>
            <th>Action</th>
            <th>Target</th>
            <th>Previous</th>
            <th>New</th>
            <th>Reason</th>
            <th>Severity</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((log) => (
            <tr key={log.id}>
              <td>@{log.actor}</td>
              <td><span className="tag">{log.action}</span></td>
              <td>{log.target}</td>
              <td>{log.previousValue}</td>
              <td>{log.newValue}</td>
              <td>{log.reason}</td>
              <td><span className={`status ${log.severity === "critical" ? "status-danger" : log.severity === "high" ? "status-warning" : "status-info"}`}>{log.severity}</span></td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
