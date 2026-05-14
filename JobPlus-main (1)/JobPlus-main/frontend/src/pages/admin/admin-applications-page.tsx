import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listAdminApplicationsData } from "../../services/admin-service";

export function AdminApplicationsPage() {
  const { data: applications = [] } = useQuery({ queryKey: ["admin", "applications-data"], queryFn: listAdminApplicationsData });
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(
    () =>
      applications.filter((item) => {
        const q = query.toLowerCase();
        const matchesQ = item.applicantName.toLowerCase().includes(q) || item.jobTitle.toLowerCase().includes(q) || item.company.toLowerCase().includes(q);
        const matchesStatus = status === "all" || item.status === status;
        return matchesQ && matchesStatus;
      }),
    [applications, query, status]
  );

  return (
    <section className="surface" style={{ padding: "1.2rem" }}>
      <div className="space-between">
        <div>
          <h2 style={{ margin: 0 }}>Applications Management</h2>
          <p className="helper">Review candidate pipeline and update statuses quickly.</p>
        </div>
        <button className="btn btn-secondary">Bulk Update</button>
      </div>
      <div className="row" style={{ marginTop: "0.9rem" }}>
        <input className="input" placeholder="Search applications..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
          <option value="accepted">Accepted</option>
        </select>
      </div>

      <table className="table" style={{ marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>Applicant</th>
            <th>Job</th>
            <th>Company</th>
            <th>Date</th>
            <th>Status</th>
            <th>Resume</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item) => (
            <tr key={item.id}>
              <td>{item.applicantName}</td>
              <td>{item.jobTitle}</td>
              <td>{item.company}</td>
              <td>{item.applicationDate}</td>
              <td><span className="tag">{item.status}</span></td>
              <td>{item.resumeAvailable ? "Available" : "Not uploaded"}</td>
              <td>{item.contactEmail}</td>
              <td>
                <div className="row">
                  <button className="btn btn-secondary">Review</button>
                  <button className="btn btn-secondary">Shortlist</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

