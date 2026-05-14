import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listAdminCompaniesData } from "../../services/admin-service";

export function AdminCompaniesPage() {
  const { data: companies = [] } = useQuery({ queryKey: ["admin", "companies-data"], queryFn: listAdminCompaniesData });
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [verification, setVerification] = useState("all");
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return companies.filter((item) => {
      const normalized = query.toLowerCase();
      const matchesQ =
        item.companyName.toLowerCase().includes(normalized) ||
        item.industry.toLowerCase().includes(normalized) ||
        item.owner.toLowerCase().includes(normalized);
      const matchesStatus = status === "all" || item.status === status;
      const matchesVerification = verification === "all" || item.verificationStatus === verification;
      return matchesQ && matchesStatus && matchesVerification;
    });
  }, [companies, query, status, verification]);

  const handleBulkVerify = async () => {
    if (selectedCompanies.length === 0) return;
    setLoadingAction("verify");
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Verified companies:", selectedCompanies);
    setSelectedCompanies([]);
    setLoadingAction(null);
  };

  const handleCompanyAction = async (companyId: number, action: string) => {
    setLoadingAction(`${action}-${companyId}`);
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log(`${action} company ${companyId}`);
    setLoadingAction(null);
  };

  const toggleCompanySelection = (companyId: number) => {
    setSelectedCompanies(prev =>
      prev.includes(companyId)
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };

  const selectAll = () => {
    setSelectedCompanies(filtered.map(c => c.id));
  };

  const clearSelection = () => {
    setSelectedCompanies([]);
  };

  return (
    <section className="surface jp-admin-section">
      <div className="space-between">
        <div>
          <h2 style={{ margin: 0 }}>Company Management</h2>
          <p className="helper">Review verification, trust, risk, and hiring performance across employer accounts.</p>
        </div>
        <div className="row">
          <button
            className="btn btn-secondary"
            disabled={selectedCompanies.length === 0 || loadingAction === "verify"}
            onClick={handleBulkVerify}
          >
            {loadingAction === "verify" ? "Verifying..." : `Verify (${selectedCompanies.length})`}
          </button>
          <button className="btn btn-primary" onClick={() => console.log("Approve Selected")}>Approve Selected</button>
        </div>
      </div>

      <div className="row jp-admin-filter-row">
        <input className="input" placeholder="Search companies..." value={query} onChange={(event) => setQuery(event.target.value)} />
        <select className="select" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
        <select className="select" value={verification} onChange={(event) => setVerification(event.target.value)}>
          <option value="all">All verification</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>

      <div className="row" style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
        <span className="helper">{filtered.length} companies found</span>
        {selectedCompanies.length > 0 && (
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
                checked={selectedCompanies.length === filtered.length && filtered.length > 0}
                onChange={(e) => e.target.checked ? selectAll() : clearSelection()}
              />
            </th>
            <th>Company</th>
            <th>Industry</th>
            <th>Location</th>
            <th>Owner</th>
            <th>Active Jobs</th>
            <th>Recruiters</th>
            <th>Trust Score</th>
            <th>Complaints</th>
            <th>Verification</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item) => (
            <tr key={item.id} className={selectedCompanies.includes(item.id) ? "selected" : ""}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedCompanies.includes(item.id)}
                  onChange={() => toggleCompanySelection(item.id)}
                />
              </td>
              <td>
                <div className="row" style={{ alignItems: "center" }}>
                  <img src={item.logo} alt={item.companyName} style={{ width: 32, height: 32, borderRadius: 10 }} />
                  <strong>{item.companyName}</strong>
                </div>
              </td>
              <td>{item.industry}</td>
              <td>{item.location}</td>
              <td>@{item.owner}</td>
              <td>{item.jobsCount}</td>
              <td>{item.recruitersLinked}</td>
              <td><strong style={{ color: item.trustScore < 65 ? "var(--warning)" : "var(--success)" }}>{item.trustScore}</strong></td>
              <td>{item.complaintCount}</td>
              <td>
                <span className={`status status-${item.verificationStatus === "verified" ? "success" : item.verificationStatus === "pending" ? "warning" : "danger"}`}>
                  {item.verificationStatus}
                </span>
              </td>
              <td>
                <span className={`status status-${item.status === "active" ? "success" : item.status === "pending" ? "warning" : "danger"}`}>
                  {item.status}
                </span>
              </td>
              <td>
                <div className="row" style={{ gap: "0.5rem" }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleCompanyAction(item.id, "view")}
                    disabled={loadingAction === `view-${item.id}`}
                  >
                    {loadingAction === `view-${item.id}` ? "..." : "View"}
                  </button>
                  {item.verificationStatus !== "verified" ? (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleCompanyAction(item.id, "verify")}
                      disabled={loadingAction === `verify-${item.id}`}
                    >
                      {loadingAction === `verify-${item.id}` ? "..." : "Verify"}
                    </button>
                  ) : null}
                  {item.status === "active" ? (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleCompanyAction(item.id, "suspend")}
                      disabled={loadingAction === `suspend-${item.id}`}
                    >
                      {loadingAction === `suspend-${item.id}` ? "..." : "Suspend"}
                    </button>
                  ) : (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleCompanyAction(item.id, "activate")}
                      disabled={loadingAction === `activate-${item.id}`}
                    >
                      {loadingAction === `activate-${item.id}` ? "..." : "Activate"}
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🏢</div>
          <h3>No companies found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </section>
  );
}
