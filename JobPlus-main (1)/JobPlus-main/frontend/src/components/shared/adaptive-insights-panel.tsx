import { Link } from "react-router-dom";
import { buildNextActions, getOpportunityRadar, getUiInsights } from "../../lib/ui-intelligence";
import { authStore } from "../../store/auth-store";

export function AdaptiveInsightsPanel() {
  const { user } = authStore();
  const insights = getUiInsights();
  const actions = buildNextActions(user?.role);
  const radar = getOpportunityRadar();

  return (
    <aside className="surface jp-adaptive-panel">
      <div className="space-between" style={{ alignItems: "center" }}>
        <div>
          <div className="eyebrow">Next Action Intelligence</div>
          <h3 className="jp-adaptive-title">Opportunity Radar</h3>
        </div>
        <span className="jp-adaptive-relevance">AI</span>
      </div>

      <div className="jp-radar-grid">
        {radar.map((metric) => (
          <article key={metric.label} className="jp-radar-item">
            <div className="space-between" style={{ alignItems: "center" }}>
              <strong>{metric.label}</strong>
              <span>{metric.value}%</span>
            </div>
            <div className="jp-radar-track">
              <span style={{ width: `${metric.value}%` }} />
            </div>
          </article>
        ))}
      </div>

      <div className="stack" style={{ gap: "0.55rem", marginTop: "0.9rem" }}>
        {actions.map((action) => (
          <Link key={action.id} to={action.href} className="jp-next-action-link">
            <div>
              <strong>{action.title}</strong>
              <p>{action.description}</p>
            </div>
            <span className="jp-next-action-score">{action.relevance}</span>
          </Link>
        ))}
      </div>

      <p className="helper jp-adaptive-footnote">
        Mode: {insights.daySegment} optimization · Focus: {insights.dominantIntent}
      </p>
    </aside>
  );
}
