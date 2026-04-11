import type { Application } from "../../types/application";
import { StatusBadge } from "./status-badge";

interface ApplicationCardProps {
  application: Application;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const tone =
    application.status === "Accepted"
      ? "success"
      : application.status === "Rejected"
        ? "danger"
        : application.status === "Reviewed"
          ? "info"
          : "warning";

  return (
    <article className="card stack jp-application-card">
      <div className="space-between">
        <div>
          <strong>{application.jobTitle}</strong>
          <div className="helper">{application.company}</div>
        </div>
        <StatusBadge tone={tone} label={application.status} />
      </div>
      <div className="helper">Applied on {application.appliedAt}</div>
    </article>
  );
}
