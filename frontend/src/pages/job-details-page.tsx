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
    <div className="jp-job-details-page">
      {/* Hero Section */}
      <div className="jp-job-hero surface">
        <div className="container">
          <div className="jp-job-hero-content">
            <div className="jp-job-hero-main">
              <div className="jp-eyebrow">{job.category}</div>
              <h1 className="jp-h1">{job.title}</h1>
              <p className="jp-body">{job.company} • {job.location} • {job.type} • {job.workMode}</p>
            </div>
            <div className="jp-job-hero-actions">
              <StatusBadge tone={job.status === "Open" ? "success" : "warning"} label={job.status} />
              <span className="jp-salary-display">{job.salary}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container jp-job-content">
        <div className="jp-job-layout">
          {/* Main Content - Left Side */}
          <div className="jp-job-main">
            {/* Job Description */}
            <div className="surface jp-job-section">
              <h2 className="jp-h2">{t("jobDetails.aboutRole")}</h2>
              <p className="jp-body">{job.description}</p>
            </div>

            {/* Requirements */}
            <div className="surface jp-job-section">
              <h2 className="jp-h2">{t("jobDetails.coreRequirements")}</h2>
              <div className="jp-job-tags">
                {job.requirements.length ? (
                  job.requirements.map((requirement) => (
                    <span key={requirement} className="jp-tag">{requirement}</span>
                  ))
                ) : (
                  <span className="jp-ui-text">{t("jobDetails.requirementsFallback")}</span>
                )}
              </div>
            </div>

            {/* Responsibilities & Benefits */}
            <div className="jp-job-grid">
              <div className="surface jp-job-section">
                <h3 className="jp-h3">{t("jobDetails.responsibilities")}</h3>
                <ul className="jp-job-list">
                  {(job as any).responsibilities?.map((resp: string, idx: number) => (
                    <li key={idx}>{resp}</li>
                  ))}
                </ul>
              </div>
              <div className="surface jp-job-section">
                <h3 className="jp-h3">{t("jobDetails.benefits")}</h3>
                <ul className="jp-job-list">
                  {(job as any).benefits?.map((benefit: string, idx: number) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Preferred Qualifications */}
            {(job as any).preferredQualifications && (job as any).preferredQualifications.length > 0 && (
              <div className="surface jp-job-section">
                <h2 className="jp-h2">{t("jobDetails.preferredQualifications")}</h2>
                <div className="jp-job-tags">
                  {(job as any).preferredQualifications.map((qual: string, idx: number) => (
                    <span key={idx} className="jp-tag">{qual}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Hiring Process & Team Info */}
            <div className="jp-job-grid">
              <div className="surface jp-job-section">
                <h3 className="jp-h3">{t("jobDetails.hiringProcess")}</h3>
                <ul className="jp-job-list">
                  {(job as any).hiringProcess?.map((step: string, idx: number) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
              {(job as any).teamInfo && (
                <div className="surface jp-job-section">
                  <h3 className="jp-h3">{t("jobDetails.teamInfo")}</h3>
                  <p className="jp-body">{(job as any).teamInfo}</p>
                  {(job as any).department && (
                    <span className="jp-tag">{(job as any).department}</span>
                  )}
                </div>
              )}
            </div>

            {/* Company Snapshot */}
            <div className="surface-muted jp-job-section">
              <div className="jp-company-snapshot">
                <div>
                  <h3 className="jp-h3">{t("jobDetails.companySnapshot")}</h3>
                  <p className="jp-ui-text">{t("jobDetails.companySnapshotDesc", { company: job.company })}</p>
                </div>
                <Link className="btn btn-secondary" to={`/companies/${job.companyId ?? 1}`}>
                  {t("jobDetails.viewCompany")}
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="jp-job-sidebar">
            {/* Apply Section */}
            <div className="surface jp-apply-section">
              <h3 className="jp-h3">{t("jobDetails.readyToApply")}</h3>
              <p className="jp-ui-text">{t("jobDetails.readyToApplyDesc")}</p>
              <Link className="btn btn-primary jp-apply-btn" to={`/jobs/${job.id}/apply`}>
                {t("jobDetails.applyRole")}
              </Link>
              <button
                className="btn btn-secondary jp-save-btn"
                onClick={() => {
                  if (!canSave) return;
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
            </div>

            {/* Recruiter Section */}
            <div className="surface jp-recruiter-section">
              <h4 className="jp-h4">{t("jobDetails.recruiter")}</h4>
              <p className="jp-ui-text">{t("jobDetails.recruiterDesc", { company: job.company })}</p>
              <button className="btn btn-secondary" type="button">
                {t("jobDetails.messageRecruiter")}
              </button>
            </div>

            {/* Role Reality Snapshot */}
            <div className="surface jp-snapshot-section">
              <div className="jp-snapshot-header">
                <h4 className="jp-h4">Role Reality Snapshot</h4>
                <button className="btn btn-ghost" type="button" onClick={() => setSnapshotOpen((open) => !open)}>
                  {snapshotOpen ? "Hide" : "Show"}
                </button>
              </div>
              {snapshotOpen && (
                <div className="jp-snapshot-metrics">
                  <div className="jp-metric">
                    <span className="jp-metric-label">Acceptance momentum</span>
                    <strong className="jp-metric-value">72%</strong>
                  </div>
                  <div className="jp-metric">
                    <span className="jp-metric-label">Culture fit signal</span>
                    <strong className="jp-metric-value">High</strong>
                  </div>
                  <div className="jp-metric">
                    <span className="jp-metric-label">Role risk index</span>
                    <strong className="jp-metric-value">Moderate</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Offer Leverage Analyzer */}
            <div className="surface jp-leverage-section">
              <div className="jp-leverage-header">
                <h4 className="jp-h4">Offer Leverage Analyzer</h4>
                <span className="jp-leverage-score">{leverageScore}%</span>
              </div>
              <p className="jp-ui-text">Assess the balance between compensation, demand, and your negotiation strength.</p>
              <div className="jp-progress-bar">
                <div className="jp-progress-fill" style={{ width: `${leverageScore}%` }} />
              </div>
            </div>

            {/* Job Details Summary */}
            <div className="surface jp-details-summary">
              <div className="jp-summary-item">
                <span className="jp-summary-label">{t("common.companies")}</span>
                <strong className="jp-summary-value">{job.company}</strong>
              </div>
              <div className="jp-summary-item">
                <span className="jp-summary-label">{t("jobDetails.category")}</span>
                <strong className="jp-summary-value">{job.category}</strong>
              </div>
              <div className="jp-summary-item">
                <span className="jp-summary-label">{t("jobDetails.compensation")}</span>
                <strong className="jp-summary-value">{job.salary}</strong>
              </div>
              <div className="jp-summary-item">
                <span className="jp-summary-label">{t("jobDetails.workStyle")}</span>
                <strong className="jp-summary-value">{job.workMode}</strong>
              </div>
            </div>

            {/* Back to Jobs */}
            <Link className="btn btn-ghost jp-back-btn" to="/jobs">
              {t("jobDetails.backJobs")}
            </Link>
          </div>
        </div>

        {/* Related Jobs */}
        <div className="jp-related-jobs">
          <div className="jp-related-header">
            <h2 className="jp-h2">{t("jobDetails.relatedJobs")}</h2>
            <Link className="btn btn-secondary" to="/jobs">
              {t("jobDetails.seeAllRoles")}
            </Link>
          </div>
          {relatedJobs.length ? (
            <div className="jp-related-grid">
              {relatedJobs.map((item) => (
                <JobCard key={item.id} job={item} />
              ))}
            </div>
          ) : (
            <SkeletonList count={1} />
          )}
        </div>
      </div>
    </div>
  );
}
