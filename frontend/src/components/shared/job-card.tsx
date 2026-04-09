import { Link } from "react-router-dom";
import type { Job } from "../../types/job";
import { StatusBadge } from "./status-badge";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <article className="card stack jp-job-card">
      <div className="space-between" style={{ alignItems: "flex-start" }}>
        <div className="jp-job-card-copy">
          <div className="jp-job-card-brand">
            <div className="jp-job-card-mark">{job.company.slice(0, 2).toUpperCase()}</div>
            <div>
              <h3 style={{ margin: "0 0 0.4rem" }}>{job.title}</h3>
              <div className="helper">
                {job.company} · {job.location} · {job.workMode}
              </div>
            </div>
          </div>
        </div>
        <StatusBadge tone={job.status === "Open" ? "success" : "warning"} label={job.status} />
      </div>
      <p style={{ margin: 0, color: "var(--text-soft)" }}>{job.description}</p>
      <div className="row" style={{ flexWrap: "wrap" }}>
        <span className="tag">{job.type}</span>
        <span className="tag">{job.category}</span>
        <span className="tag">{job.level}</span>
        <span className="tag">{job.salary}</span>
      </div>
      <div className="space-between">
        <span className="helper">Posted {job.postedAt}</span>
        <div className="row">
          <Link className="btn btn-secondary" to={`/jobs/${job.id}`}>
            View details
          </Link>
          <Link className="btn btn-primary" to={`/jobs/${job.id}/apply`}>
            Apply now
          </Link>
        </div>
      </div>
    </article>
  );
}
