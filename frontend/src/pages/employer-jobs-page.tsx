import { useQuery } from "@tanstack/react-query";
import { listEmployerJobs } from "../services/jobs-service";

export function EmployerJobsPage() {
  const { data: jobs = [] } = useQuery({ queryKey: ["jobs", "employer"], queryFn: listEmployerJobs });

  return (
    <div className="surface" style={{ padding: "1.4rem" }}>
      <div className="space-between">
        <div>
          <div className="eyebrow">Job management</div>
          <h2 className="headline" style={{ fontSize: "2rem", margin: "0.35rem 0 0" }}>
            Manage the quality and performance of every opening.
          </h2>
        </div>
        <a className="btn btn-primary" href="/employer/jobs/new">
          Post job
        </a>
      </div>
      <table className="table" style={{ marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>Role</th>
            <th>Location</th>
            <th>Applicants</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, index) => (
            <tr key={job.id}>
              <td>{job.title}</td>
              <td>{job.location}</td>
              <td>{0}</td>
              <td>{job.status}</td>
              <td>
                <a className="btn btn-secondary" href={`/employer/jobs/${job.id}/edit`}>
                  Edit
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
