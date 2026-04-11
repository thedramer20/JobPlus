import { useQuery } from "@tanstack/react-query";
import { getAdminKpis, getAdminTrends } from "../../services/admin-service";

export function AdminAnalyticsPage() {
  const { data: kpis = [] } = useQuery({ queryKey: ["admin", "kpis"], queryFn: getAdminKpis });
  const { data: trends = [] } = useQuery({ queryKey: ["admin", "trends"], queryFn: getAdminTrends });

  const max = Math.max(...trends.map((item) => item.applications), 1);

  return (
    <section className="stack">
      <div className="grid grid-4">
        {kpis.slice(0, 4).map((item) => (
          <article key={item.key} className="metric">
            <span className="helper">{item.title}</span>
            <strong>{item.value}</strong>
            <span className="helper">{item.deltaText}</span>
          </article>
        ))}
      </div>
      <div className="surface" style={{ padding: "1.2rem" }}>
        <h2 style={{ marginTop: 0 }}>Applications Trend</h2>
        <div className="jp-admin-trend-chart" style={{ marginTop: "0.8rem" }}>
          {trends.map((item) => (
            <div key={item.label} className="jp-admin-trend-col">
              <div className="jp-admin-bar-stack">
                <span className="jp-admin-bar applications" style={{ height: `${(item.applications / max) * 100}%` }} />
              </div>
              <span className="helper">{item.label}</span>
              <strong style={{ fontSize: "0.9rem" }}>{item.applications}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

