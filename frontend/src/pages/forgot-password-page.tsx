export function ForgotPasswordPage() {
  return (
    <section className="section">
      <div className="container grid grid-2">
        <div className="surface" style={{ padding: "1.6rem" }}>
          <div className="eyebrow">Account recovery</div>
          <h1 className="headline" style={{ fontSize: "2.4rem", margin: "0.4rem 0" }}>Forgot your password?</h1>
          <p className="helper">Enter your email or username and we will guide you through resetting access.</p>
        </div>
        <div className="surface" style={{ padding: "1.6rem" }}>
          <div className="stack">
            <div className="field">
              <label>Email or username</label>
              <input className="input" placeholder="Enter your account email or username" />
            </div>
            <button className="btn btn-primary">Send reset link</button>
          </div>
        </div>
      </div>
    </section>
  );
}
