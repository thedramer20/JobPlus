import { useQuery } from "@tanstack/react-query";
import { listAdminRolesData } from "../../services/admin-service";

export function AdminPermissionsPage() {
  const { data: roles = [] } = useQuery({ queryKey: ["admin", "roles"], queryFn: listAdminRolesData });

  return (
    <section className="stack">
      <section className="surface jp-admin-section">
        <div className="space-between">
          <div>
            <h2 style={{ margin: 0 }}>Role-Based Access Control</h2>
            <p className="helper">Manage admin scopes, security boundaries, and approval controls.</p>
          </div>
          <div className="row">
            <button className="btn btn-secondary">Audit Restrictions</button>
            <button className="btn btn-primary">Create Role</button>
          </div>
        </div>
      </section>

      <div className="grid grid-2">
        {roles.map((role) => (
          <article key={role.id} className="surface jp-admin-role-card">
            <div className="space-between">
              <div>
                <h3 style={{ margin: 0 }}>{role.roleName}</h3>
                <p className="helper" style={{ marginTop: "0.25rem" }}>{role.description}</p>
              </div>
              <span className="pill">{role.members} admins</span>
            </div>
            <div className="row" style={{ flexWrap: "wrap", marginTop: "0.8rem" }}>
              {role.permissions.map((permission) => (
                <span key={permission} className="tag">{permission}</span>
              ))}
            </div>
            <div className="row" style={{ marginTop: "1rem" }}>
              <button className="btn btn-secondary">Edit Permissions</button>
              <button className="btn btn-secondary">Assign Members</button>
              <button className="btn btn-secondary">Review Access Log</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
