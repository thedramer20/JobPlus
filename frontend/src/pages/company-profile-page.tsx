import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { EmptyState } from "../components/shared/empty-state";
import { JobCard } from "../components/shared/job-card";
import { SkeletonList } from "../components/shared/skeleton-list";
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
          <SkeletonList count={2} />
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
      <div className="container stack">
        <div className="surface jp-company-hero">
          <div className="eyebrow">{company.industry}</div>
          <h1 className="headline" style={{ fontSize: "3rem", margin: "0.3rem 0" }}>
            {company.name}
          </h1>
          <div className="helper">{company.location} | {company.size} | {company.website}</div>
          <p className="helper" style={{ marginTop: "1rem", maxWidth: "75ch" }}>
            {company.description}
          </p>
        </div>

        <div>
          <div className="eyebrow">Open jobs</div>
          <h2 className="headline" style={{ fontSize: "2rem", margin: "0.35rem 0 1rem" }}>
            Hiring opportunities at {company.name}
          </h2>
          <div className="stack">
            {jobs.filter((job) => job.companyId === company.id).slice(0, 3).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
