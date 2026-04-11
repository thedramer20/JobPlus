import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listAdminReportsData } from "../../services/admin-service";

export function AdminReportsPage() {
  const { data: reports = [] } = useQuery({ queryKey: ["admin", "reports-data"], queryFn: listAdminReportsData });
  const [status, setStatus] = useState("all");

  const filtered = useMemo(
    () => reports.filter((item) => status === "all" || item.status === status),
    [reports, status]
  );

  return (
    <section className="surface" style={{ padding: "1.2rem" }}>
      <div className="space-between">
        <div>
          <h2 style={{ margin: 0 }}>Reports / Flagged Content</h2>
          <p className="helper">Review and resolve moderation cases.</p>
        </div>
        <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewing">Reviewing</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
      </div>
      <table className="table" style={{ marginTop: "1rem" }}>
        <thead>
          <tr>
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
            <tr key={item.id}>
              <td><span className="tag">{item.reportType}</span></td>
              <td>{item.target}</td>
              <td>@{item.reportedBy}</td>
              <td>{item.reason}</td>
              <td>{item.date}</td>
              <td><span className="status status-warning">{item.status}</span></td>
              <td>
                <div className="row">
                  <button className="btn btn-secondary">Review</button>
                  <button className="btn btn-secondary">Resolve</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

