export function FilterPanel() {
  return (
    <aside className="surface" style={{ padding: "1.2rem" }}>
      <div className="stack">
        <div>
          <h3 style={{ marginTop: 0 }}>Filters</h3>
          <p className="helper">Refine jobs by type, work model, category, and experience level.</p>
        </div>
        <div className="field">
          <label>Job Type</label>
          <select className="select">
            <option>All types</option>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Internship</option>
          </select>
        </div>
        <div className="field">
          <label>Work Mode</label>
          <select className="select">
            <option>Any</option>
            <option>Remote</option>
            <option>Hybrid</option>
            <option>On-site</option>
          </select>
        </div>
        <div className="field">
          <label>Experience</label>
          <select className="select">
            <option>Any</option>
            <option>Entry</option>
            <option>Mid</option>
            <option>Senior</option>
          </select>
        </div>
        <button className="btn btn-secondary">Reset filters</button>
      </div>
    </aside>
  );
}
