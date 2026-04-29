import { Link } from "react-router-dom";
import type { Company } from "../../types/company";

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <article className="card stack jp-company-card jp-reveal">
      <div className="space-between" style={{ alignItems: "flex-start" }}>
        <div>
          <h3 style={{ margin: "0 0 0.4rem" }}>{company.name}</h3>
          <div className="helper">
            {company.industry} | {company.location}
          </div>
        </div>
        <span className="jp-company-mark">{company.name.slice(0, 2).toUpperCase()}</span>
      </div>

      <p className="jp-company-description" style={{ margin: 0, color: "var(--text-soft)" }}>
        {company.description}
      </p>

      <div className="space-between jp-company-footer">
        <span className="tag">{company.size}</span>
        <Link className="btn btn-secondary" to={"/companies/" + company.id}>
          View company
        </Link>
      </div>
    </article>
  );
}
