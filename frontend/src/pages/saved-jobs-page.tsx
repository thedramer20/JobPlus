import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/shared/empty-state";
import { JobCard } from "../components/shared/job-card";
import { SkeletonList } from "../components/shared/skeleton-list";
import { listJobs } from "../services/jobs-service";
import { listSavedJobs, removeSavedJob } from "../services/profile-service";

export function SavedJobsPage() {
  const queryClient = useQueryClient();
  const { data: jobs = [], isLoading: isJobsLoading } = useQuery({ queryKey: ["jobs", "all"], queryFn: () => listJobs() });
  const { data: savedJobs = [], isLoading: isSavedLoading } = useQuery({ queryKey: ["saved-jobs"], queryFn: listSavedJobs });
  const removeMutation = useMutation({
    mutationFn: removeSavedJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
    }
  });

  const savedIds = new Set(savedJobs.map((item) => item.jobId));
  const savedJobCards = jobs.filter((job) => savedIds.has(job.id));
  const isLoading = isJobsLoading || isSavedLoading;

  return (
    <div className="stack">
      <div className="jp-reveal-up">
        <div className="eyebrow">Saved jobs</div>
        <h2 className="headline" style={{ fontSize: "2rem", margin: "0.35rem 0 0" }}>
          Keep a shortlist of the jobs worth revisiting.
        </h2>
        <p className="helper" style={{ marginTop: "0.5rem" }}>
          Saved roles stay here so you can compare offers, revisit details, and apply when you are ready.
        </p>
      </div>
      <div className="stack jp-reveal-stagger">
        {isLoading ? <SkeletonList count={3} /> : null}
        {!isLoading && savedJobs.length === 0 ? (
          <EmptyState title="No saved jobs yet" description="Use Save on any job card and it will appear here instantly." />
        ) : null}
        {!isLoading && savedJobs.length > 0 ? (
          <div className="row jp-reveal" style={{ justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
            <span className="helper">{savedJobs.length} saved jobs</span>
            <Link className="btn btn-secondary" to="/jobs">
              Discover more jobs
            </Link>
          </div>
        ) : null}
        {savedJobCards.map((job) => (
          <div key={job.id} className="stack jp-reveal">
            <JobCard job={job} />
            <div>
              <button className="btn btn-secondary" disabled={removeMutation.isPending} onClick={() => removeMutation.mutate(job.id)}>
                Remove from saved
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
