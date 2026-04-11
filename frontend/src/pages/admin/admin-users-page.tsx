import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listAdminUsersData } from "../../services/admin-service";

export function AdminUsersPage() {
  const { data: users = [] } = useQuery({ queryKey: ["admin", "users-data"], queryFn: listAdminUsersData });
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(
    () =>
      users.filter((item) => {
        const matchesQuery =
          item.fullName.toLowerCase().includes(query.toLowerCase()) ||
          item.username.toLowerCase().includes(query.toLowerCase()) ||
          item.email.toLowerCase().includes(query.toLowerCase());
        const matchesRole = roleFilter === "all" || item.role === roleFilter;
        const matchesStatus = statusFilter === "all" || item.status === statusFilter;
        return matchesQuery && matchesRole && matchesStatus;
      }),
    [users, query, roleFilter, statusFilter]
  );

  return (
    <section className="surface" style={{ padding: "1.2rem" }}>
      <div className="space-between">
        <div>
          <h2 style={{ margin: 0 }}>Users Management</h2>
          <p className="helper">Search, filter, moderate and manage all user accounts.</p>
        </div>
        <div className="row">
          <button className="btn btn-secondary">Export CSV</button>
          <button className="btn btn-primary">Add User</button>
        </div>
      </div>
      <div className="row" style={{ marginTop: "0.9rem", flexWrap: "wrap" }}>
        <input className="input" placeholder="Search users..." value={query} onChange={(e) => setQuery(e.target.value)} style={{ minWidth: "240px" }} />
        <select className="select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="all">All roles</option>
          <option value="candidate">Candidate</option>
          <option value="employer">Employer</option>
          <option value="admin">Admin</option>
        </select>
        <select className="select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <table className="table" style={{ marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Last Activity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="row" style={{ alignItems: "center" }}>
                  <img src={item.avatar} alt={item.fullName} style={{ width: 32, height: 32, borderRadius: "50%" }} />
                  <div className="stack" style={{ gap: "0.1rem" }}>
                    <strong>{item.fullName}</strong>
                    <span className="helper">@{item.username}</span>
                  </div>
                </div>
              </td>
              <td>{item.email}</td>
              <td><span className="tag">{item.role}</span></td>
              <td><span className={`status ${item.status === "active" ? "status-success" : item.status === "suspended" ? "status-danger" : "status-warning"}`}>{item.status}</span></td>
              <td>{item.joinedDate}</td>
              <td>{item.lastActivity}</td>
              <td>
                <div className="row">
                  <button className="btn btn-secondary">View</button>
                  <button className="btn btn-secondary">Edit</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
