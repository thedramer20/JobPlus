import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listAdminUsersData } from "../../services/admin-service";

export function AdminUsersPage() {
  const { data: users = [] } = useQuery({ queryKey: ["admin", "users-data"], queryFn: listAdminUsersData });
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return users.filter((item) => {
      const normalized = query.toLowerCase();
      const matchesQuery =
        item.fullName.toLowerCase().includes(normalized) ||
        item.username.toLowerCase().includes(normalized) ||
        item.email.toLowerCase().includes(normalized);
      const matchesRole = roleFilter === "all" || item.role === roleFilter;
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesCountry = countryFilter === "all" || item.country === countryFilter;
      const matchesVerification = verificationFilter === "all" || item.verification === verificationFilter;
      const matchesRisk = riskFilter === "all" || item.riskLevel === riskFilter;
      return matchesQuery && matchesRole && matchesStatus && matchesCountry && matchesVerification && matchesRisk;
    });
  }, [users, query, roleFilter, statusFilter, countryFilter, verificationFilter, riskFilter]);

  const countries = [...new Set(users.map((item) => item.country))];

  const handleBulkSuspend = async () => {
    if (selectedUsers.length === 0) return;
    setLoadingAction("suspend");
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Suspended users:", selectedUsers);
    setSelectedUsers([]);
    setLoadingAction(null);
  };

  const handleUserAction = async (userId: number, action: string) => {
    setLoadingAction(`${action}-${userId}`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log(`${action} user ${userId}`);
    setLoadingAction(null);
  };

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAll = () => {
    setSelectedUsers(filtered.map(u => u.id));
  };

  const clearSelection = () => {
    setSelectedUsers([]);
  };

  return (
    <section className="surface jp-admin-section">
      <div className="space-between">
        <div>
          <h2 style={{ margin: 0 }}>User Management Center</h2>
          <p className="helper">Manage identity, risk, account status, and operational access at scale.</p>
        </div>
        <div className="row">
          <button className="btn btn-secondary" onClick={() => console.log("Export CSV")}>Export CSV</button>
          <button
            className="btn btn-secondary"
            disabled={selectedUsers.length === 0 || loadingAction === "suspend"}
            onClick={handleBulkSuspend}
          >
            {loadingAction === "suspend" ? "Suspending..." : `Suspend (${selectedUsers.length})`}
          </button>
          <button className="btn btn-primary" onClick={() => console.log("Add User")}>Add User</button>
        </div>
      </div>

      <div className="row jp-admin-filter-row" style={{ flexWrap: "wrap" }}>
        <input className="input" placeholder="Search users..." value={query} onChange={(event) => setQuery(event.target.value)} style={{ minWidth: "240px" }} />
        <select className="select" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
          <option value="all">All roles</option>
          <option value="candidate">Candidate</option>
          <option value="employer">Employer</option>
          <option value="admin">Admin</option>
        </select>
        <select className="select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
        <select className="select" value={countryFilter} onChange={(event) => setCountryFilter(event.target.value)}>
          <option value="all">All countries</option>
          {countries.map((country) => <option key={country} value={country}>{country}</option>)}
        </select>
        <select className="select" value={verificationFilter} onChange={(event) => setVerificationFilter(event.target.value)}>
          <option value="all">All verification</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="unverified">Unverified</option>
        </select>
        <select className="select" value={riskFilter} onChange={(event) => setRiskFilter(event.target.value)}>
          <option value="all">All risk levels</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="row" style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
        <span className="helper">{filtered.length} users found</span>
        {selectedUsers.length > 0 && (
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
                checked={selectedUsers.length === filtered.length && filtered.length > 0}
                onChange={(e) => e.target.checked ? selectAll() : clearSelection()}
              />
            </th>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Verification</th>
            <th>Country</th>
            <th>Risk</th>
            <th>Premium</th>
            <th>Last Active</th>
            <th>Last IP</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item) => (
            <tr key={item.id} className={selectedUsers.includes(item.id) ? "selected" : ""}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(item.id)}
                  onChange={() => toggleUserSelection(item.id)}
                />
              </td>
              <td>
                <div className="row" style={{ alignItems: "center" }}>
                  <img src={item.avatar} alt={item.fullName} style={{ width: 34, height: 34, borderRadius: "50%" }} />
                  <div className="stack" style={{ gap: "0.12rem" }}>
                    <strong>{item.fullName}</strong>
                    <span className="helper">@{item.username}</span>
                  </div>
                </div>
              </td>
              <td>{item.email}</td>
              <td>
                <span className={`status status-${item.role === "admin" ? "danger" : item.role === "employer" ? "warning" : "info"}`}>
                  {item.role}
                </span>
              </td>
              <td>
                <span className={`status status-${item.status === "active" ? "success" : item.status === "inactive" ? "warning" : "danger"}`}>
                  {item.status}
                </span>
              </td>
              <td>
                <span className={`status status-${item.verification === "verified" ? "success" : item.verification === "pending" ? "warning" : "danger"}`}>
                  {item.verification}
                </span>
              </td>
              <td>{item.country}</td>
              <td>
                <span className={`status status-${item.riskLevel === "low" ? "success" : item.riskLevel === "medium" ? "warning" : "danger"}`}>
                  {item.riskLevel}
                </span>
              </td>
              <td>{item.premium ? "✓" : "—"}</td>
              <td>{item.lastActivity}</td>
              <td>{item.lastIp}</td>
              <td>
                <div className="row" style={{ gap: "0.5rem" }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleUserAction(item.id, "view")}
                    disabled={loadingAction === `view-${item.id}`}
                  >
                    {loadingAction === `view-${item.id}` ? "..." : "View"}
                  </button>
                  {item.status === "active" ? (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleUserAction(item.id, "suspend")}
                      disabled={loadingAction === `suspend-${item.id}`}
                    >
                      {loadingAction === `suspend-${item.id}` ? "..." : "Suspend"}
                    </button>
                  ) : (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleUserAction(item.id, "activate")}
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
          <div className="empty-state-icon">🔍</div>
          <h3>No users found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </section>
  );
}
