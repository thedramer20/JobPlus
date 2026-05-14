import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listAdminJobsData } from "../../services/admin-service";

export function AdminJobsPage() {
  const { data: jobs = [] } = useQuery({ queryKey: ["admin", "jobs-data"], queryFn: listAdminJobsData });
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [risk, setRisk] = useState("all");
  const [selectedJobs, setSelectedJobs] = useState<number[]>([]);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return jobs.filter((item) => {
      const normalized = query.toLowerCase();
      const matchesQ =
        item.title.toLowerCase().includes(normalized) ||
        item.company.toLowerCase().includes(normalized) ||
        item.location.toLowerCase().includes(normalized);
      const matchesCategory = category === "all" || item.category === category;
      const matchesStatus = status === "all" || item.status === status;
      const matchesRisk = risk === "all" || (risk === "high" ? item.fraudRiskScore >= 70 : risk === "medium" ? item.fraudRiskScore >= 45 && item.fraudRiskScore < 70 : item.fraudRiskScore < 45);
      return matchesQ && matchesCategory && matchesStatus && matchesRisk;
    });
  }, [jobs, query, category, status, risk]);

  const handleBulkArchive = async () => {
    if (selectedJobs.length === 0) return;
    setLoadingAction("archive");
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Archived jobs:", selectedJobs);
    setSelectedJobs([]);
    setLoadingAction(null);
  };

  const handleJobAction = async (jobId: number, action: string) => {
    setLoadingAction(`${action}-${jobId}`);
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log(`${action} job ${jobId}`);
    setLoadingAction(null);
  };

  const toggleJobSelection = (jobId: number) => {
    setSelectedJobs(prev =>
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const selectAll = () => {
    setSelectedJobs(filtered.map(j => j.id));
  };

  const clearSelection = () => {
    setSelectedJobs([]);
  };

  return (
    <section className="surface jp-admin-section">
      <div className="space-between">
        <div>
          <h2 style={{ margin: 0 }}>Job Post Management</h2>
          <p className="helper">Detect risky listings, control visibility, and monitor application volume.</p>
        </div>
        <div className="row">
          <button
            className="btn btn-secondary"
            disabled={selectedJobs.length === 0 || loadingAction === "archive"}
            onClick={handleBulkArchive}
          >
            {loadingAction === "archive" ? "Archiving..." : `Archive (${selectedJobs.length})`}
          </button>
          <button className="btn btn-primary" onClick={() => console.log("Add New Job")}>Add New Job</button>
        </div>
      </div>

      <div className="row jp-admin-filter-row" style={{ flexWrap: "wrap" }}>
        <input className="input" placeholder="Search jobs..." value={query} onChange={(event) => setQuery(event.target.value)} style={{ minWidth: "260px" }} />
        <select className="select" value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="all">All categories</option>
          {[...new Set(jobs.map((item) => item.category))].map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select className="select" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
        <select className="select" value={risk} onChange={(event) => setRisk(event.target.value)}>
          <option value="all">All risk levels</option>
          <option value="high">High fraud risk</option>
          <option value="medium">Medium fraud risk</option>
          <option value="low">Low fraud risk</option>
        </select>
      </div>

      <div className="row" style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
        <span className="helper">{filtered.length} jobs found</span>
        {selectedJobs.length > 0 && (
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
                checked={selectedJobs.length === filtered.length && filtered.length > 0}
                onChange={(e) => e.target.checked ? selectAll() : clearSelection()}
              />
            </th>
            <th>Job</th>
            <th>Company</th>
            <th>Location</th>
            <th>Salary</th>
            <th>Category</th>
            <th>Applications</th>
            <th>Reports</th>
            <th>Quality</th>
            <th>Fraud Risk</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item) => (
            <tr key={item.id} className={selectedJobs.includes(item.id) ? "selected" : ""}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedJobs.includes(item.id)}
                  onChange={() => toggleJobSelection(item.id)}
                />
              </td>
              <td>
                <strong>{item.title}</strong>
                <div className="helper">{item.postedDate}</div>
              </td>
              <td>{item.company}</td>
              <td>{item.location}</td>
              <td>{item.salary}</td>
              <td><span className="tag">{item.category}</span></td>
              <td>{item.applicationsCount}</td>
              <td>{item.reportCount}</td>
              <td><strong style={{ color: item.qualityScore < 65 ? "var(--warning)" : "var(--success)" }}>{item.qualityScore}</strong></td>
              <td>
                <span className={`status status-${item.fraudRiskScore > 70 ? "danger" : item.fraudRiskScore > 45 ? "warning" : "success"}`}>
                  {item.fraudRiskScore}
                </span>
              </td>
              <td>
                <span className={`status status-${item.status === "open" ? "success" : "warning"}`}>
                  {item.status}
                </span>
              </td>
              <td>
                <div className="row" style={{ gap: "0.5rem" }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleJobAction(item.id, "inspect")}
                    disabled={loadingAction === `inspect-${item.id}`}
                  >
                    {loadingAction === `inspect-${item.id}` ? "..." : "Inspect"}
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleJobAction(item.id, item.status === "open" ? "close" : "reopen")}
                    disabled={loadingAction === `${item.status === "open" ? "close" : "reopen"}-${item.id}`}
                  >
                    {loadingAction === `${item.status === "open" ? "close" : "reopen"}-${item.id}` ? "..." : item.status === "open" ? "Close" : "Reopen"}
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleJobAction(item.id, "archive")}
                    disabled={loadingAction === `archive-${item.id}`}
                  >
                    {loadingAction === `archive-${item.id}` ? "..." : "Archive"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">💼</div>
          <h3>No jobs found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </section>
  );
}
