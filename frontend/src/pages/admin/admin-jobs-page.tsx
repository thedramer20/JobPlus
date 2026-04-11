import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listAdminJobsData } from "../../services/admin-service";

export function AdminJobsPage() {
  const { data: jobs = [] } = useQuery({ queryKey: ["admin", "jobs-data"], queryFn: listAdminJobsData });
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(
    () =>
      jobs.filter((item) => {
        const q = query.toLowerCase();
        const matchesQ = item.title.toLowerCase().includes(q) || item.company.toLowerCase().includes(q) || item.location.toLowerCase().includes(q);
        const matchesCategory = category === "all" || item.category === category;
        const matchesStatus = status === "all" || item.status === status;
        return matchesQ && matchesCategory && matchesStatus;
      }),
    [jobs, query, category, status]
  );

  return (
    <section className="surface" style={{ padding: "1.2rem" }}>
      <div className="space-between">
        <div>
          <h2 style={{ margin: 0 }}>Jobs Management</h2>
          <p className="helper">Moderate, feature, close and reopen jobs.</p>
        </div>
        <button className="btn btn-primary">Add New Job</button>
      </div>
      <div className="row" style={{ marginTop: "0.9rem", flexWrap: "wrap" }}>
        <input className="input" placeholder="Search jobs..." value={query} onChange={(e) => setQuery(e.target.value)} style={{ minWidth: "260px" }} />
        <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All categories</option>
          {[...new Set(jobs.map((item) => item.category))].map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>
      <table className="table" style={{ marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>Job</th>
            <th>Company</th>
            <th>Type</th>
            <th>Location</th>
            <th>Salary</th>
            <th>Category</th>
            <th>Applications</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item) => (
            <tr key={item.id}>
              <td>
                <strong>{item.title}</strong>
                <div className="helper">{item.postedDate}</div>
              </td>
              <td>{item.company}</td>
              <td>{item.type}</td>
              <td>{item.location}</td>
              <td>{item.salary}</td>
              <td><span className="tag">{item.category}</span></td>
              <td>{item.applicationsCount}</td>
              <td><span className={`status ${item.status === "open" ? "status-success" : "status-warning"}`}>{item.status}</span></td>
              <td>
                <div className="row">
                  <button className="btn btn-secondary">Edit</button>
                  <button className="btn btn-secondary">{item.status === "open" ? "Close" : "Reopen"}</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

