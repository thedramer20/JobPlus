import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listAdminReportsData } from "../../services/admin-service";

export function AdminReportsPage() {
  const { data: reports = [] } = useQuery({ queryKey: ["admin", "reports-data"], queryFn: listAdminReportsData });
  const [status, setStatus] = useState("all");
  const [severity, setSeverity] = useState("all");
  const [selectedReports, setSelectedReports] = useState<number[]>([]);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return reports.filter((item) => {
      const matchesStatus = status === "all" || item.status === status;
      const matchesSeverity = severity === "all" || item.severity === severity;
      return matchesStatus && matchesSeverity;
    });
  }, [reports, status, severity]);

  const handleBulkDismiss = async () => {
    if (selectedReports.length === 0) return;
    setLoadingAction("dismiss");
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Dismissed reports:", selectedReports);
    setSelectedReports([]);
    setLoadingAction(null);
  };

  const handleReportAction = async (reportId: number, action: string) => {
    setLoadingAction(`${action}-${reportId}`);
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log(`${action} report ${reportId}`);
    setLoadingAction(null);
  };

  const toggleReportSelection = (reportId: number) => {
    setSelectedReports(prev =>
      prev.includes(reportId)
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const selectAll = () => {
    setSelectedReports(filtered.map(r => r.id));
  };

  const clearSelection = () => {
    setSelectedReports([]);
  };

  return (
    <section className="surface jp-admin-section">
      <div className="space-between">
        <div>
          <h2 style={{ margin: 0 }}>Trust & Safety Moderation Center</h2>
          <p className="helper">Prioritize critical incidents, inspect evidence, and resolve abuse cases safely.</p>
        </div>
        <div className="row">
          <button
            className="btn btn-secondary"
            disabled={selectedReports.length === 0 || loadingAction === "dismiss"}
            onClick={handleBulkDismiss}
          >
            {loadingAction === "dismiss" ? "Dismissing..." : `Dismiss (${selectedReports.length})`}
          </button>
          <button className="btn btn-primary" onClick={() => console.log("Escalate Critical")}>Escalate Critical</button>
        </div>
      </div>
      <div className="row jp-admin-filter-row">
        <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewing">Reviewing</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
        <select className="select" value={severity} onChange={(e) => setSeverity(e.target.value)}>
          <option value="all">All severity levels</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div className="row" style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
        <span className="helper">{filtered.length} reports found</span>
        {selectedReports.length > 0 && (
          <div className="row">
            <button className="btn btn-ghost" onClick={selectAll}>Select All</button>
            <button className="btn btn-ghost" onClick={clearSelection}>Clear</button>
          </div>
        )}
      </div>

      <table className="table" style={{ marginTop: "0.5rem" }}>
        <thead>
          <tr>
            <th style={{ width: "40px" }}>
              <input
                type="checkbox"
                checked={selectedReports.length === filtered.length && filtered.length > 0}
                onChange={(e) => e.target.checked ? selectAll() : clearSelection()}
              />
            </th>
            <th>Severity</th>
            <th>Type</th>
            <th>Target</th>
            <th>Reported By</th>
            <th>Reason</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item) => (
            <tr key={item.id} className={selectedReports.includes(item.id) ? "selected" : ""}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedReports.includes(item.id)}
                  onChange={() => toggleReportSelection(item.id)}
                />
              </td>
              <td>
                <span className={`status status-${item.severity === "critical" ? "danger" : item.severity === "high" ? "warning" : "info"}`}>
                  {item.severity}
                </span>
              </td>
              <td><span className="tag">{item.reportType}</span></td>
              <td>{item.target}</td>
              <td>@{item.reportedBy}</td>
              <td>{item.reason}</td>
              <td>{item.date}</td>
              <td>
                <span className={`status status-${item.status === "resolved" ? "success" : item.status === "dismissed" ? "info" : "warning"}`}>
                  {item.status}
                </span>
              </td>
              <td>
                <div className="row" style={{ gap: "0.5rem" }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleReportAction(item.id, "inspect")}
                    disabled={loadingAction === `inspect-${item.id}`}
                  >
                    {loadingAction === `inspect-${item.id}` ? "..." : "Inspect"}
                  </button>
                  {item.status !== "resolved" ? (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleReportAction(item.id, "resolve")}
                      disabled={loadingAction === `resolve-${item.id}`}
                    >
                      {loadingAction === `resolve-${item.id}` ? "..." : "Resolve"}
                    </button>
                  ) : null}
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleReportAction(item.id, "suspend")}
                    disabled={loadingAction === `suspend-${item.id}`}
                  >
                    {loadingAction === `suspend-${item.id}` ? "..." : "Suspend"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🚨</div>
          <h3>No reports found</h3>
          <p>Try adjusting your filters</p>
        </div>
      )}
    </section>
  );
}
