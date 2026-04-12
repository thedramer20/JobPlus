import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { ProfilePageSkeleton } from "../components/shared/content-skeletons";
import { EmptyState } from "../components/shared/empty-state";
import { JobCard } from "../components/shared/job-card";
import { getCompany } from "../services/companies-service";
import { listJobs } from "../services/jobs-service";

export function CompanyProfilePage() {
  const params = useParams();
  const companyId = Number(params.companyId);
  const { data: company, isLoading, isError } = useQuery({
    queryKey: ["companies", companyId],
    queryFn: () => getCompany(companyId),
    enabled: Number.isFinite(companyId)
  });
  const { data: jobs = [] } = useQuery({ queryKey: ["jobs", "company-profile"], queryFn: () => listJobs() });

  if (isLoading) {
    return (
      <section className="section">
        <div className="container">
          <ProfilePageSkeleton />
        </div>
      </section>
    );
  }

  if (isError || !company) {
    return (
      <section className="section">
        <div className="container">
          <EmptyState title="Company not found" description="The requested company could not be loaded." />
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container detail-layout">
        <div className="stack">
          <div className="surface jp-company-hero">
            <div className="jp-company-banner" />
            <div className="jp-company-hero-content">
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={company.name} className="jp-company-logo" />
              ) : (
                <span className="jp-company-logo-fallback">{company.name.slice(0, 2).toUpperCase()}</span>
              )}
              <div className="stack" style={{ gap: "0.35rem" }}>
                <div className="eyebrow">{company.industry}</div>
                <h1 className="headline" style={{ fontSize: "2.6rem", margin: 0 }}>
                  {company.name}
                </h1>
                <div className="helper">{company.location} • {company.size} • {company.website || "No website provided"}</div>
              </div>
            </div>
            <p className="helper" style={{ marginTop: "1rem", maxWidth: "75ch" }}>
              {company.description}
            </p>
          </div>

          <div className="grid grid-3">
            <div className="surface jp-company-metric-card">
              <span className="helper">Open jobs</span>
              <strong>{jobs.filter((job) => job.companyId === company.id && job.status === "Open").length}</strong>
            </div>
            <div className="surface jp-company-metric-card">
              <span className="helper">Total jobs</span>
              <strong>{jobs.filter((job) => job.companyId === company.id).length}</strong>
            </div>
            <div className="surface jp-company-metric-card">
              <span className="helper">Status</span>
              <strong>{company.status ?? "Active"}</strong>
            </div>
          </div>

          <div>
            <div className="eyebrow">Open jobs</div>
            <h2 className="headline" style={{ fontSize: "2rem", margin: "0.35rem 0 1rem" }}>
              Hiring opportunities at {company.name}
            </h2>
            <div className="stack">
              {jobs.filter((job) => job.companyId === company.id).slice(0, 5).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
              {!jobs.filter((job) => job.companyId === company.id).length ? (
                <EmptyState title="No open jobs yet" description="This company has not published active jobs yet." compact />
              ) : null}
            </div>
          </div>
        </div>

        <aside className="surface jp-detail-sidebar">
          <div className="stack">
            <strong>Company Summary</strong>
            <div className="space-between"><span className="helper">Industry</span><strong>{company.industry}</strong></div>
            <div className="space-between"><span className="helper">Location</span><strong>{company.location}</strong></div>
            <div className="space-between"><span className="helper">Size</span><strong>{company.size}</strong></div>
            <div className="space-between"><span className="helper">Website</span><strong>{company.website || "-"}</strong></div>
            <div className="jp-detail-divider" />
            <a className="btn btn-primary" href={company.website || "#"} target="_blank" rel="noreferrer">
              Visit Website
            </a>
            <a className="btn btn-secondary" href="/jobs">
              Browse More Jobs
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
