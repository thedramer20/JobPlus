import { useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { EmptyState } from "../components/shared/empty-state";
import { SkeletonList } from "../components/shared/skeleton-list";
import { StatusBadge } from "../components/shared/status-badge";
import { getJob } from "../services/jobs-service";
import { saveJob } from "../services/profile-service";
import { authStore } from "../store/auth-store";

export function JobDetailsPage() {
  const params = useParams();
  const jobId = Number(params.jobId);
  const { user } = authStore();
  const { data: job, isLoading, isError } = useQuery({
    queryKey: ["jobs", jobId],
    queryFn: () => getJob(jobId),
    enabled: Number.isFinite(jobId)
  });
  const saveMutation = useMutation({
    mutationFn: saveJob
  });

  const detailPoints = useMemo(() => {
    if (!job) {
      return [];
    }
    return [
      { label: "Employment type", value: job.type },
      { label: "Experience level", value: job.level },
      { label: "Work type", value: job.workMode },
      { label: "Location", value: job.location },
      { label: "Open seats", value: `${job.vacancyCount ?? 1}` },
      { label: "Deadline", value: job.deadline ?? "Open until filled" }
    ];
  }, [job]);

  if (isLoading) {
    return (
      <section className="section">
        <div className="container">
          <SkeletonList count={2} />
        </div>
      </section>
    );
  }

  if (isError || !job) {
    return (
      <section className="section">
        <div className="container">
          <EmptyState title="Job not found" description="This job may have been removed or the backend is not available." />
        </div>
      </section>
    );
  }

  return (
    <section className="section-tight">
      <div className="container stack" style={{ gap: "1.25rem" }}>
        <div className="jp-detail-hero surface">
          <div className="jp-detail-brand">
            <div className="jp-company-mark">{job.company.slice(0, 2).toUpperCase()}</div>
            <div>
              <div className="eyebrow">{job.category}</div>
              <h1 className="headline" style={{ fontSize: "3rem", margin: "0.35rem 0" }}>
                {job.title}
              </h1>
              <div className="jp-detail-meta">
                <span>{job.company}</span>
                <span>{job.location}</span>
                <span>{job.type}</span>
                <span>{job.workMode}</span>
              </div>
            </div>
          </div>
          <div className="jp-detail-actions">
            <StatusBadge tone={job.status === "Open" ? "success" : "warning"} label={job.status} />
            <span className="jp-salary-pill">{job.salary}</span>
          </div>
        </div>

        <div className="detail-layout">
          <div className="stack">
            <div className="surface" style={{ padding: "1.5rem" }}>
              <div className="jp-detail-grid">
                {detailPoints.map((item) => (
                  <div key={item.label} className="jp-detail-stat">
                    <span className="helper">{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface" style={{ padding: "1.6rem" }}>
              <div className="stack" style={{ gap: "1.4rem" }}>
                <div>
                  <h3 style={{ marginTop: 0 }}>About the role</h3>
                  <p className="helper" style={{ fontSize: "0.98rem", lineHeight: 1.75 }}>
                    {job.description}
                  </p>
                </div>

                <div>
                  <h3>What you will work with</h3>
                  <div className="row" style={{ flexWrap: "wrap" }}>
                    {job.requirements.length ? (
                      job.requirements.map((requirement) => (
                        <span className="tag" key={requirement}>
                          {requirement}
                        </span>
                      ))
                    ) : (
                      <span className="helper">Detailed requirements will be shared during the application review.</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-2">
                  <div className="subtle-card">
                    <strong>Why candidates apply</strong>
                    <ul className="jp-detail-list">
                      <li>Clean application flow with resume, cover letter, and saved job support.</li>
                      <li>Visible hiring signals including company, work mode, level, and salary.</li>
                      <li>Role details are structured for mobile and desktop review before conversion.</li>
                    </ul>
                  </div>
                  <div className="subtle-card">
                    <strong>Hiring process snapshot</strong>
                    <ul className="jp-detail-list">
                      <li>Application submitted and tracked in your candidate dashboard.</li>
                      <li>Employer review with shortlist and status updates in real time.</li>
                      <li>Ready for notifications and interview scheduling in later phases.</li>
                    </ul>
                  </div>
                </div>

                <div className="surface-muted" style={{ padding: "1.2rem" }}>
                  <div className="space-between">
                    <div>
                      <strong>Company snapshot</strong>
                      <div className="helper" style={{ marginTop: "0.35rem" }}>
                        {job.company} is presented with a production-style profile, open roles, and clearer candidate conversion paths.
                      </div>
                    </div>
                    <Link className="btn btn-secondary" to={`/companies/${job.companyId ?? 1}`}>
                      View company
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="surface jp-detail-sidebar">
            <div className="stack">
              <strong>Ready to apply?</strong>
              <div className="helper">Use your profile information or uploaded resume and keep tracking status from the candidate dashboard.</div>
              <Link className="btn btn-primary" to={`/jobs/${job.id}/apply`}>
                Apply for this role
              </Link>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  if (user?.role === "candidate") {
                    saveMutation.mutate(job.id);
                  }
                }}
              >
                {saveMutation.isPending ? "Saving..." : "Save job"}
              </button>
              <div className="jp-detail-divider" />
              <div className="stack" style={{ gap: "0.7rem" }}>
                <div className="space-between">
                  <span className="helper">Company</span>
                  <strong>{job.company}</strong>
                </div>
                <div className="space-between">
                  <span className="helper">Category</span>
                  <strong>{job.category}</strong>
                </div>
                <div className="space-between">
                  <span className="helper">Compensation</span>
                  <strong>{job.salary}</strong>
                </div>
                <div className="space-between">
                  <span className="helper">Work style</span>
                  <strong>{job.workMode}</strong>
                </div>
              </div>
              <div className="jp-detail-divider" />
              <Link className="btn btn-ghost" to="/jobs">
                Back to all jobs
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
