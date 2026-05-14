import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdminKpis, getAdminTrends, listAdminCompaniesData, listAdminJobsData } from "../../services/admin-service";

export function AdminAnalyticsPage() {
  const { data: kpis = [] } = useQuery({ queryKey: ["admin", "kpis"], queryFn: getAdminKpis });
  const { data: trends = [] } = useQuery({ queryKey: ["admin", "trends"], queryFn: getAdminTrends });
  const { data: companies = [] } = useQuery({ queryKey: ["admin", "companies-data"], queryFn: listAdminCompaniesData });
  const { data: jobs = [] } = useQuery({ queryKey: ["admin", "jobs-data"], queryFn: listAdminJobsData });

  const max = Math.max(...trends.map((item) => item.applications), 1);
  const categoryDistribution = useMemo(() => {
    const map = new Map<string, number>();
    jobs.forEach((job) => map.set(job.category, (map.get(job.category) ?? 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [jobs]);

  const topCompanies = useMemo(() => {
    return [...companies].sort((a, b) => b.jobsCount - a.jobsCount).slice(0, 5);
  }, [companies]);

  return (
    <section className="stack">
      <div className="grid grid-4">
        {kpis.slice(0, 8).map((item) => (
          <article key={item.key} className="metric">
            <span className="helper">{item.title}</span>
            <strong>{item.value.toLocaleString("en-US")}</strong>
            <span className={`status ${item.status === "up" ? "status-success" : item.status === "down" ? "status-danger" : "status-info"}`}>{item.deltaText && !item.deltaText.includes("NaN") ? item.deltaText : "—"}</span>
          </article>
        ))}
      </div>

      <div className="grid grid-2">
        <section className="surface jp-admin-section">
          <h2 style={{ marginTop: 0 }}>Applications Trend</h2>
          <div className="jp-admin-trend-chart" style={{ marginTop: "0.8rem" }}>
            {trends.map((item) => (
              <div key={item.label} className="jp-admin-trend-col">
                <div className="jp-admin-bar-stack">
                  <span className="jp-admin-bar applications" style={{ height: `${(item.applications / max) * 100}%` }} />
                </div>
                <span className="helper">{item.label}</span>
                <strong style={{ fontSize: "0.9rem" }}>{item.applications.toLocaleString("en-US")}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="surface jp-admin-section">
          <h2 style={{ marginTop: 0 }}>Top Categories</h2>
          <div className="stack" style={{ marginTop: "0.8rem" }}>
            {categoryDistribution.map(([name, count]) => (
              <div key={name} className="jp-admin-activity-item">
                <div className="space-between">
                  <span>{name}</span>
                  <strong>{count} jobs</strong>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="surface jp-admin-section">
        <div className="space-between">
          <h2 style={{ margin: 0 }}>Top Performing Companies</h2>
          <span className="helper">Based on active openings and trust score</span>
        </div>
        <table className="table" style={{ marginTop: "0.9rem" }}>
          <thead>
            <tr>
              <th>Company</th>
              <th>Industry</th>
              <th>Jobs</th>
              <th>Trust Score</th>
              <th>Complaints</th>
            </tr>
          </thead>
          <tbody>
            {topCompanies.map((company) => (
              <tr key={company.id}>
                <td>{company.companyName}</td>
                <td>{company.industry}</td>
                <td>{company.jobsCount}</td>
                <td>{company.trustScore}</td>
                <td>{company.complaintCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </section>
  );
}
