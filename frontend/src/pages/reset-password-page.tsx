export function ResetPasswordPage() {
  return (
    <section className="section">
      <div className="container grid grid-2">
        <div className="surface" style={{ padding: "1.6rem" }}>
          <div className="eyebrow">Reset password</div>
          <h1 className="headline" style={{ fontSize: "2.4rem", margin: "0.4rem 0" }}>Create a new secure password.</h1>
          <p className="helper">This page is ready for a backend reset-token flow when you add it server-side.</p>
        </div>
        <div className="surface" style={{ padding: "1.6rem" }}>
          <div className="stack">
            <div className="field">
              <label>New password</label>
              <input className="input" type="password" />
            </div>
            <div className="field">
              <label>Confirm password</label>
              <input className="input" type="password" />
            </div>
            <button className="btn btn-primary">Reset password</button>
          </div>
        </div>
      </div>
    </section>
  );
}
