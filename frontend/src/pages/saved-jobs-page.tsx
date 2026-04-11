import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EmptyState } from "../components/shared/empty-state";
import { JobCard } from "../components/shared/job-card";
import { SkeletonList } from "../components/shared/skeleton-list";
import { listJobs } from "../services/jobs-service";
import { listSavedJobs, removeSavedJob } from "../services/profile-service";

export function SavedJobsPage() {
  const queryClient = useQueryClient();
  const { data: jobs = [] } = useQuery({ queryKey: ["jobs"], queryFn: () => listJobs() });
  const { data: savedJobs = [], isLoading } = useQuery({ queryKey: ["saved-jobs"], queryFn: listSavedJobs });
  const removeMutation = useMutation({
    mutationFn: removeSavedJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
    }
  });

  const savedIds = new Set(savedJobs.map((item) => item.jobId));

  return (
    <div className="stack">
      <div>
        <div className="eyebrow">Saved jobs</div>
        <h2 className="headline" style={{ fontSize: "2rem", margin: "0.35rem 0 0" }}>
          Keep a shortlist of the jobs worth revisiting.
        </h2>
      </div>
      <div className="stack">
        {isLoading ? <SkeletonList count={2} /> : null}
        {!isLoading && savedJobs.length === 0 ? (
          <EmptyState title="No saved jobs" description="Save a job from the details page to keep it here." />
        ) : null}
        {jobs.filter((job) => savedIds.has(job.id)).map((job) => (
          <div key={job.id} className="stack">
            <JobCard job={job} />
            <div>
              <button className="btn btn-secondary" onClick={() => removeMutation.mutate(job.id)}>
                Remove from saved
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
