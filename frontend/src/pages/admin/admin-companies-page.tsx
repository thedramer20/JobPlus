import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listAdminCompaniesData } from "../../services/admin-service";

export function AdminCompaniesPage() {
  const { data: companies = [] } = useQuery({ queryKey: ["admin", "companies-data"], queryFn: listAdminCompaniesData });
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(
    () =>
      companies.filter((item) => {
        const q = query.toLowerCase();
        const matchesQ = item.companyName.toLowerCase().includes(q) || item.industry.toLowerCase().includes(q) || item.owner.toLowerCase().includes(q);
        const matchesStatus = status === "all" || item.status === status;
        return matchesQ && matchesStatus;
      }),
    [companies, query, status]
  );

  return (
    <section className="surface" style={{ padding: "1.2rem" }}>
      <div className="space-between">
        <div>
          <h2 style={{ margin: 0 }}>Companies Management</h2>
          <p className="helper">Approve, verify, suspend and manage employer companies.</p>
        </div>
        <button className="btn btn-primary">Approve Selected</button>
      </div>
      <div className="row" style={{ marginTop: "0.9rem" }}>
        <input className="input" placeholder="Search companies..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>
      <table className="table" style={{ marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>Company</th>
            <th>Industry</th>
            <th>Location</th>
            <th>Owner</th>
            <th>Jobs</th>
            <th>Verification</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item) => (
            <tr key={item.id}>
              <td><strong>{item.logo} {item.companyName}</strong></td>
              <td>{item.industry}</td>
              <td>{item.location}</td>
              <td>@{item.owner}</td>
              <td>{item.jobsCount}</td>
              <td><span className="tag">{item.verificationStatus}</span></td>
              <td><span className={`status ${item.status === "active" ? "status-success" : item.status === "pending" ? "status-warning" : "status-danger"}`}>{item.status}</span></td>
              <td>
                <div className="row">
                  <button className="btn btn-secondary">Verify</button>
                  <button className="btn btn-secondary">Suspend</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

