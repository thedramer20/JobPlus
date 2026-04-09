export function SettingsPage() {
  return (
    <div className="grid grid-2">
      <div className="surface" style={{ padding: "1.5rem" }}>
        <div className="eyebrow">Settings</div>
        <h2 className="headline" style={{ fontSize: "2rem", margin: "0.35rem 0 1rem" }}>Account and product preferences</h2>
        <div className="stack">
          <div className="card">Profile visibility</div>
          <div className="card">Notification preferences</div>
          <div className="card">Language and theme</div>
        </div>
      </div>
      <div className="surface" style={{ padding: "1.5rem" }}>
        <strong>Security</strong>
        <div className="stack" style={{ marginTop: "1rem" }}>
          <div className="field">
            <label>Current password</label>
            <input className="input" type="password" />
          </div>
          <div className="field">
            <label>New password</label>
            <input className="input" type="password" />
          </div>
          <button className="btn btn-primary">Update password</button>
        </div>
      </div>
    </div>
  );
}
