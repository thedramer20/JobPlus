export function AboutPage() {
  return (
    <section className="section">
      <div className="container stack">
        <div className="eyebrow">About JobPlus</div>
        <h1 className="headline" style={{ fontSize: "2.7rem", margin: "0.3rem 0" }}>
          A recruitment platform designed like a real product, not a toy demo.
        </h1>
        <div className="grid grid-2">
          <div className="surface" style={{ padding: "1.5rem" }}>
            <h3>For candidates</h3>
            <p className="helper">Discover opportunities, build a professional profile, save jobs, apply, and track progress in one structured workspace.</p>
          </div>
          <div className="surface" style={{ padding: "1.5rem" }}>
            <h3>For employers</h3>
            <p className="helper">Create company presence, post roles, review applicants, and manage hiring workflows through a clean dashboard.</p>
          </div>
        </div>
        <div className="surface" style={{ padding: "1.5rem" }}>
          <h3>Why it feels different</h3>
          <p className="helper">JobPlus is being built with a full-stack architecture, role-based design, API integration, and real product thinking so it can scale beyond an academic project.</p>
        </div>
      </div>
    </section>
  );
}
