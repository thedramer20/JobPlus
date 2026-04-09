import { Link } from "react-router-dom";

export function ForbiddenPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="surface" style={{ padding: "2rem", textAlign: "center" }}>
          <div className="eyebrow">403</div>
          <h1 className="headline" style={{ fontSize: "2.8rem", margin: "0.3rem 0" }}>
            You do not have permission to access this area.
          </h1>
          <p className="helper">The frontend hides protected actions by role, and the backend still remains the final authority.</p>
          <div className="row" style={{ justifyContent: "center", marginTop: "1rem" }}>
            <Link className="btn btn-primary" to="/">
              Go home
            </Link>
            <Link className="btn btn-secondary" to="/login">
              Switch account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
