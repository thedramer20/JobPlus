import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { JobDetailsSkeleton } from "../components/shared/content-skeletons";
import { EmptyState } from "../components/shared/empty-state";
import { JobCard } from "../components/shared/job-card";
import { SkeletonList } from "../components/shared/skeleton-list";
import { StatusBadge } from "../components/shared/status-badge";
import { getJob, listJobs } from "../services/jobs-service";
import { listSavedJobs, removeSavedJob, saveJob } from "../services/profile-service";
import { authStore } from "../store/auth-store";

export function JobDetailsPage() {
  const { t } = useTranslation();
  const params = useParams();
  const jobId = Number(params.jobId);
  const { user } = authStore();
  const queryClient = useQueryClient();
  const { data: job, isLoading, isError } = useQuery({
    queryKey: ["jobs", jobId],
    queryFn: () => getJob(jobId),
    enabled: Number.isFinite(jobId)
  });
  const { data: allJobs = [] } = useQuery({
    queryKey: ["jobs", "related", jobId],
    queryFn: () => listJobs(),
    enabled: Number.isFinite(jobId)
  });
  const canSave = user?.role === "candidate";
  const { data: savedJobs = [] } = useQuery({
    queryKey: ["saved-jobs"],
    queryFn: listSavedJobs,
    enabled: canSave
  });
  const saveMutation = useMutation({
    mutationFn: saveJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
    }
  });
  const removeMutation = useMutation({
    mutationFn: removeSavedJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
    }
  });

  const detailPoints = useMemo(() => {
    if (!job) {
      return [];
    }
    return [
      { label: t("jobDetails.employmentType"), value: job.type },
      { label: t("jobDetails.experienceLevel"), value: job.level },
      { label: t("jobDetails.workType"), value: job.workMode },
      { label: t("jobDetails.location"), value: job.location },
      { label: t("jobDetails.openSeats"), value: `${job.vacancyCount ?? 1}` },
      { label: t("jobDetails.deadline"), value: job.deadline ?? t("jobDetails.openUntilFilled") }
    ];
  }, [job, t]);

  if (isLoading) {
    return (
      <section className="section">
        <div className="container">
          <JobDetailsSkeleton />
        </div>
      </section>
    );
  }

  if (isError || !job) {
    return (
      <section className="section">
        <div className="container">
          <EmptyState title={t("jobDetails.notFoundTitle")} description={t("jobDetails.notFoundDesc")} />
        </div>
      </section>
    );
  }

  const relatedJobs = allJobs
    .filter((item) => item.id !== job.id)
    .filter((item) => item.category === job.category || item.location === job.location || item.companyId === job.companyId)
    .slice(0, 3);
  const [snapshotOpen, setSnapshotOpen] = useState(true);
  const [leverageScore, setLeverageScore] = useState(86);
  const isSaved = canSave && savedJobs.some((item) => item.jobId === job.id);
  const isMutating = saveMutation.isPending || removeMutation.isPending;

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
                  <h3 style={{ marginTop: 0 }}>{t("jobDetails.aboutRole")}</h3>
                  <p className="helper" style={{ fontSize: "0.98rem", lineHeight: 1.75 }}>
                    {job.description}
                  </p>
                </div>

                <div>
                  <h3>{t("jobDetails.coreRequirements")}</h3>
                  <div className="row" style={{ flexWrap: "wrap" }}>
                    {job.requirements.length ? (
                      job.requirements.map((requirement) => (
                        <span className="tag" key={requirement}>
                          {requirement}
                        </span>
                      ))
                    ) : (
                      <span className="helper">{t("jobDetails.requirementsFallback")}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-2">
                  <div className="subtle-card">
                    <strong>{t("jobDetails.responsibilities")}</strong>
                    <ul className="jp-detail-list">
                      {(job as any).responsibilities?.map((resp: string, idx: number) => (
                        <li key={idx}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="subtle-card">
                    <strong>{t("jobDetails.benefits")}</strong>
                    <ul className="jp-detail-list">
                      {(job as any).benefits?.map((benefit: string, idx: number) => (
                        <li key={idx}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {(job as any).preferredQualifications && (job as any).preferredQualifications.length > 0 && (
                  <div className="surface" style={{ padding: "1.5rem" }}>
                    <h3>{t("jobDetails.preferredQualifications")}</h3>
                    <div className="row" style={{ flexWrap: "wrap" }}>
                      {(job as any).preferredQualifications.map((qual: string, idx: number) => (
                        <span className="tag" key={idx}>{qual}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-2">
                  <div className="subtle-card">
                    <strong>{t("jobDetails.hiringProcess")}</strong>
                    <ul className="jp-detail-list">
                      {(job as any).hiringProcess?.map((step: string, idx: number) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                  {(job as any).teamInfo && (
                    <div className="subtle-card">
                      <strong>{t("jobDetails.teamInfo")}</strong>
                      <p className="helper">{(job as any).teamInfo}</p>
                      {(job as any).department && (
                        <div style={{ marginTop: "0.5rem" }}>
                          <span className="tag">{(job as any).department}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="surface-muted" style={{ padding: "1.2rem" }}>
                  <div className="space-between">
                    <div>
                      <strong>{t("jobDetails.companySnapshot")}</strong>
                      <div className="helper" style={{ marginTop: "0.35rem" }}>
                        {t("jobDetails.companySnapshotDesc", { company: job.company })}
                      </div>
                    </div>
                    <Link className="btn btn-secondary" to={`/companies/${job.companyId ?? 1}`}>
                      {t("jobDetails.viewCompany")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="surface jp-detail-sidebar">
            <div className="stack">
              <strong>{t("jobDetails.readyToApply")}</strong>
              <div className="helper">{t("jobDetails.readyToApplyDesc")}</div>
              <Link className="btn btn-primary" to={`/jobs/${job.id}/apply`}>
                {t("jobDetails.applyRole")}
              </Link>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  if (!canSave) {
                    return;
                  }
                  if (isSaved) {
                    removeMutation.mutate(job.id);
                    return;
                  }
                  if (user?.role === "candidate") {
                    saveMutation.mutate(job.id);
                  }
                }}
                disabled={isMutating || !canSave}
              >
                {isMutating ? (isSaved ? t("jobCard.removing") : t("jobCard.saving")) : isSaved ? t("jobCard.saved") : t("jobDetails.saveJob")}
              </button>
              <div className="jp-detail-divider" />
              <div className="surface-muted" style={{ padding: "0.85rem" }}>
                <strong>{t("jobDetails.recruiter")}</strong>
                <div className="helper" style={{ marginTop: "0.3rem" }}>
                  {t("jobDetails.recruiterDesc", { company: job.company })}
                </div>
                <button className="btn btn-secondary" style={{ marginTop: "0.65rem" }} type="button">
                  {t("jobDetails.messageRecruiter")}
                </button>
              </div>
              <div className="jp-detail-divider" />
              <div className="surface jp-role-snapshot" style={{ padding: "1rem" }}>
                <div className="space-between">
                  <strong>Role Reality Snapshot</strong>
                  <button className="btn btn-ghost" type="button" onClick={() => setSnapshotOpen((open) => !open)}>
                    {snapshotOpen ? "Hide" : "Show"}
                  </button>
                </div>
                {snapshotOpen ? (
                  <div className="stack" style={{ gap: "0.6rem", marginTop: "0.85rem" }}>
                    <div className="space-between">
                      <span className="helper">Acceptance momentum</span>
                      <strong>72%</strong>
                    </div>
                    <div className="space-between">
                      <span className="helper">Culture fit signal</span>
                      <strong>High</strong>
                    </div>
                    <div className="space-between">
                      <span className="helper">Role risk index</span>
                      <strong>Moderate</strong>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="surface jp-offer-leverage" style={{ padding: "1rem", marginTop: "1rem" }}>
                <div className="space-between">
                  <strong>Offer Leverage Analyzer</strong>
                  <span className="tag">{leverageScore}%</span>
                </div>
                <div className="helper" style={{ marginTop: "0.75rem" }}>
                  Assess the balance between compensation, demand, and your negotiation strength.
                </div>
                <div className="jp-progress-bar" style={{ marginTop: "1rem" }}>
                  <div className="jp-progress-fill" style={{ width: `${leverageScore}%` }} />
                </div>
              </div>
              <div className="jp-detail-divider" />
              <div className="stack" style={{ gap: "0.7rem" }}>
                <div className="space-between">
                  <span className="helper">{t("common.companies")}</span>
                  <strong>{job.company}</strong>
                </div>
                <div className="space-between">
                  <span className="helper">{t("jobDetails.category")}</span>
                  <strong>{job.category}</strong>
                </div>
                <div className="space-between">
                  <span className="helper">{t("jobDetails.compensation")}</span>
                  <strong>{job.salary}</strong>
                </div>
                <div className="space-between">
                  <span className="helper">{t("jobDetails.workStyle")}</span>
                  <strong>{job.workMode}</strong>
                </div>
              </div>
              <div className="jp-detail-divider" />
              <Link className="btn btn-ghost" to="/jobs">
                {t("jobDetails.backJobs")}
              </Link>
            </div>
          </aside>
        </div>

        <div className="stack">
          <div className="space-between">
            <h2 className="headline" style={{ fontSize: "1.7rem", margin: 0 }}>
              {t("jobDetails.relatedJobs")}
            </h2>
            <Link className="btn btn-secondary" to="/jobs">
              {t("jobDetails.seeAllRoles")}
            </Link>
          </div>
          {relatedJobs.length ? (
            <div className="grid grid-3">
              {relatedJobs.map((item) => (
                <JobCard key={item.id} job={item} />
              ))}
            </div>
          ) : (
            <SkeletonList count={1} />
          )}
        </div>
      </div>
    </section>
  );
}
