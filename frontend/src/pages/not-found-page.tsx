import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="surface" style={{ padding: "2rem", textAlign: "center" }}>
          <div className="eyebrow">404</div>
          <h1 className="headline" style={{ fontSize: "2.8rem", margin: "0.3rem 0" }}>
            That page could not be found.
          </h1>
          <p className="helper">Use search or return to the marketplace to continue your journey.</p>
          <div className="row" style={{ justifyContent: "center", marginTop: "1rem" }}>
            <Link className="btn btn-primary" to="/jobs">
              Browse jobs
            </Link>
            <Link className="btn btn-secondary" to="/">
              Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
