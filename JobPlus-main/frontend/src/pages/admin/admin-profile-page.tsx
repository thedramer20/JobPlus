import { authStore } from "../../store/auth-store";

export function AdminProfilePage() {
  const { user } = authStore();

  return (
    <section className="surface" style={{ padding: "1.2rem" }}>
      <h2 style={{ marginTop: 0 }}>Admin Profile</h2>
      <p className="helper">Manage your admin account and security settings.</p>

      <div className="grid grid-2" style={{ marginTop: "1rem" }}>
        <article className="card stack">
          <div className="row" style={{ alignItems: "center" }}>
            <div className="jp-topbar-avatar">{(user?.name ?? "A").slice(0, 1)}</div>
            <div>
              <strong>{user?.name ?? "Admin User"}</strong>
              <div className="helper">{user?.email ?? "admin@jobplus.app"}</div>
            </div>
          </div>
          <div className="row">
            <span className="tag">Role: {user?.role ?? "admin"}</span>
            <span className="status status-success">Active</span>
          </div>
        </article>

        <article className="card stack">
          <div className="field">
            <label>Current password</label>
            <input className="input" type="password" placeholder="••••••••" />
          </div>
          <div className="field">
            <label>New password</label>
            <input className="input" type="password" placeholder="••••••••" />
          </div>
          <button className="btn btn-primary">Update Password</button>
        </article>
      </div>
    </section>
  );
}

