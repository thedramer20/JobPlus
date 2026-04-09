import { Link } from "react-router-dom";
import type { Company } from "../../types/company";

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <div className="card stack">
      <div>
        <h3 style={{ margin: "0 0 0.4rem" }}>{company.name}</h3>
        <div className="helper">
          {company.industry} · {company.location}
        </div>
      </div>
      <p style={{ margin: 0, color: "var(--text-soft)" }}>{company.description}</p>
      <div className="space-between">
        <span className="tag">{company.size}</span>
        <Link className="btn btn-secondary" to={`/companies/${company.id}`}>
          View company
        </Link>
      </div>
    </div>
  );
}
