import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { Job } from "../../types/job";
import { listSavedJobs, removeSavedJob, saveJob } from "../../services/profile-service";
import { authStore } from "../../store/auth-store";
import type { SavedJob } from "../../types/profile";
import { StatusBadge } from "./status-badge";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const { t } = useTranslation();
  const { user } = authStore();
  const queryClient = useQueryClient();
  const canSave = user?.role === "candidate";

  const { data: savedJobs = [] } = useQuery({
    queryKey: ["saved-jobs"],
    queryFn: listSavedJobs,
    enabled: canSave
  });

  const isSaved = canSave && savedJobs.some((item) => item.jobId === job.id);

  const saveMutation = useMutation({
    mutationFn: () => saveJob(job.id),
    onSuccess: (saved) => {
      queryClient.setQueryData<SavedJob[]>(["saved-jobs"], (current = []) => {
        if (current.some((entry) => entry.jobId === saved.jobId)) {
          return current;
        }
        return [saved, ...current];
      });
    }
  });

  const removeMutation = useMutation({
    mutationFn: () => removeSavedJob(job.id),
    onSuccess: () => {
      queryClient.setQueryData<SavedJob[]>(["saved-jobs"], (current = []) => current.filter((entry) => entry.jobId !== job.id));
    }
  });

  const isMutating = saveMutation.isPending || removeMutation.isPending;
  const saveLabel = isMutating ? (isSaved ? t("jobCard.removing") : t("jobCard.saving")) : isSaved ? t("jobCard.saved") : t("jobCard.save");

  return (
    <article className="card stack jp-job-card jp-reveal">
      <div className="space-between" style={{ alignItems: "flex-start" }}>
        <div className="jp-job-card-copy">
          <div className="jp-job-card-brand">
            <div className="jp-job-card-mark">{job.company.slice(0, 2).toUpperCase()}</div>
            <div>
              <h3 style={{ margin: "0 0 0.35rem" }}>{job.title}</h3>
              <div className="helper">
                {job.company} | {job.location} | {job.workMode}
              </div>
            </div>
          </div>
        </div>
        <div className="stack" style={{ gap: "0.45rem", alignItems: "flex-end" }}>
          <StatusBadge tone={job.status === "Open" ? "success" : "warning"} label={job.status} />
          <button
            type="button"
            className={`btn btn-ghost jp-save-button ${isSaved ? "is-saved" : ""}`}
            aria-pressed={isSaved}
            disabled={isMutating || !canSave}
            onClick={() => {
              if (!canSave) {
                return;
              }
              if (isSaved) {
                removeMutation.mutate();
                return;
              }
              saveMutation.mutate();
            }}
          >
            <svg className="jp-save-button-icon" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} aria-hidden="true">
              <path d="M6 4.8h12a1 1 0 0 1 1 1V21l-7-4.1L5 21V5.8a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            </svg>
            <span className="jp-save-button-label">{saveLabel}</span>
          </button>
        </div>
      </div>

      <p className="jp-job-card-description" style={{ margin: 0, color: "var(--text-soft)" }}>
        {job.description}
      </p>

      <div className="row" style={{ flexWrap: "wrap" }}>
        <span className="tag">{job.type}</span>
        <span className="tag">{job.category}</span>
        <span className="tag">{job.level}</span>
        <span className="tag">{job.salary}</span>
      </div>

      <div className="space-between jp-job-card-footer">
        <span className="helper">{t("jobCard.postedAt", { date: job.postedAt, location: job.location })}</span>
        <div className="row">
          <Link className="btn btn-secondary" to={`/jobs/${job.id}`}>
            {t("jobCard.viewDetails")}
          </Link>
          <Link className="btn btn-primary" to={`/jobs/${job.id}/apply`}>
            {t("jobCard.applyNow")}
          </Link>
        </div>
      </div>
    </article>
  );
}
