import { useQuery } from "@tanstack/react-query";
import { StatCard } from "../components/shared/stat-card";
import { getMyCompany } from "../services/companies-service";
import { listEmployerJobs } from "../services/jobs-service";

export function EmployerDashboardPage() {
  const { data: company } = useQuery({ queryKey: ["companies", "me"], queryFn: getMyCompany });
  const { data: jobs = [] } = useQuery({ queryKey: ["jobs", "employer"], queryFn: listEmployerJobs });

  return (
    <div className="stack jp-reveal-stagger">
      <div className="grid grid-4">
        <StatCard label="Active jobs" value={String(jobs.length)} meta="Live openings tied to your company account" />
        <StatCard label="Company profile" value={company ? "Ready" : "Missing"} meta="Create a company profile before posting jobs" />
        <StatCard label="Open roles" value={String(jobs.filter((job) => job.status === "Open").length)} meta="Public listings visible to candidates" />
        <StatCard label="Draft / closed" value={String(jobs.filter((job) => job.status !== "Open").length)} meta="Roles not currently taking applications" />
      </div>
      <div className="grid grid-2">
        <div className="surface" style={{ padding: "1.4rem" }}>
          <strong>Hiring pipeline</strong>
          <table className="table" style={{ marginTop: "1rem" }}>
            <thead>
              <tr>
                <th>Role</th>
                <th>Applicants</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{jobs[0]?.title ?? "No job yet"}</td>
                <td>{jobs.length ? 0 : "-"}</td>
                <td>{jobs[0]?.status ?? "Create company first"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="surface" style={{ padding: "1.4rem" }}>
          <strong>Quick actions</strong>
          <div className="stack" style={{ marginTop: "1rem" }}>
            <a className="btn btn-primary" href="/employer/jobs/new">
              Post a new job
            </a>
            <a className="btn btn-secondary" href="/employer/company">
              Update company profile
            </a>
            <a className="btn btn-secondary" href="/employer/jobs">
              Review active jobs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
