import { useQuery } from "@tanstack/react-query";
import { ApplicationCard } from "../components/shared/application-card";
import { EmptyState } from "../components/shared/empty-state";
import { JobCard } from "../components/shared/job-card";
import { StatCard } from "../components/shared/stat-card";
import { listMyApplications } from "../services/applications-service";
import { listJobs } from "../services/jobs-service";
import { listSavedJobs } from "../services/profile-service";

export function CandidateDashboardPage() {
  const { data: applications = [] } = useQuery({ queryKey: ["applications", "me"], queryFn: listMyApplications });
  const { data: jobs = [] } = useQuery({ queryKey: ["jobs", "recommended"], queryFn: () => listJobs() });
  const { data: savedJobs = [] } = useQuery({ queryKey: ["saved-jobs"], queryFn: listSavedJobs });

  return (
    <div className="stack">
      <div className="grid grid-4">
        <StatCard label="Applications" value={String(applications.length)} meta="Tracked directly from your application records" />
        <StatCard label="In review" value={String(applications.filter((item) => item.status === "Reviewed").length)} meta="Applications that moved beyond pending" />
        <StatCard label="Saved jobs" value={String(savedJobs.length)} meta="Roles ready for your next review session" />
        <StatCard label="Open roles" value={String(jobs.length)} meta="Current opportunities visible in the marketplace" />
      </div>
      <div className="grid grid-2">
        <div className="surface" style={{ padding: "1.3rem" }}>
          <div className="space-between">
            <strong>Recent applications</strong>
            <a className="btn btn-ghost" href="/app/applications">
              View all
            </a>
          </div>
          <div className="stack" style={{ marginTop: "1rem" }}>
            {applications.length ? applications.map((application) => <ApplicationCard key={application.id} application={application} />) : (
              <EmptyState title="No applications yet" description="Apply to a job to start tracking your pipeline here." />
            )}
          </div>
        </div>
        <div className="surface" style={{ padding: "1.3rem" }}>
          <div className="space-between">
            <strong>Recommended jobs</strong>
            <a className="btn btn-ghost" href="/jobs">
              Browse more
            </a>
          </div>
          <div className="stack" style={{ marginTop: "1rem" }}>
            {jobs.slice(0, 2).map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
