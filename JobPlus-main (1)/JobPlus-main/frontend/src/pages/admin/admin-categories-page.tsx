import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listAdminCategoriesData } from "../../services/admin-service";

export function AdminCategoriesPage() {
  const { data: categories = [] } = useQuery({ queryKey: ["admin", "categories-data"], queryFn: listAdminCategoriesData });
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      categories.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
      ),
    [categories, query]
  );

  return (
    <section className="surface" style={{ padding: "1.2rem" }}>
      <div className="space-between">
        <div>
          <h2 style={{ margin: 0 }}>Categories Management</h2>
          <p className="helper">Create, reorder and manage job categories for the platform.</p>
        </div>
        <button className="btn btn-primary">Add Category</button>
      </div>
      <input className="input" style={{ marginTop: "0.9rem" }} placeholder="Search categories..." value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="grid grid-3" style={{ marginTop: "1rem" }}>
        {filtered.map((item) => (
          <article key={item.id} className="card stack">
            <div className="space-between">
              <strong>{item.icon} {item.name}</strong>
              <span className={`status ${item.status === "active" ? "status-success" : "status-warning"}`}>{item.status}</span>
            </div>
            <p className="helper" style={{ margin: 0 }}>{item.description}</p>
            <div className="space-between">
              <span className="tag">{item.totalJobs} jobs</span>
              <div className="row">
                <button className="btn btn-secondary">Edit</button>
                <button className="btn btn-secondary">Disable</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

