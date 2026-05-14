import { useQuery } from "@tanstack/react-query";
import { StatCard } from "../components/shared/stat-card";
import { getAdminCompanies, getAdminJobs, getAdminOverview, getAdminUsers } from "../services/meta-service";

export function AdminPage() {
  const { data: overview } = useQuery({ queryKey: ["admin", "overview"], queryFn: getAdminOverview });
  const { data: users = [] } = useQuery({ queryKey: ["admin", "users"], queryFn: getAdminUsers });
  const { data: companies = [] } = useQuery({ queryKey: ["admin", "companies"], queryFn: getAdminCompanies });
  const { data: jobs = [] } = useQuery({ queryKey: ["admin", "jobs"], queryFn: getAdminJobs });

  return (
    <div className="stack">
      <div className="grid grid-4">
        <StatCard label="Users" value={String(overview?.usersCount ?? 0)} meta="Candidates, employers, and admins" />
        <StatCard label="Companies" value={String(overview?.companiesCount ?? 0)} meta="Profiles created in the marketplace" />
        <StatCard label="Jobs" value={String(overview?.jobsCount ?? 0)} meta="All jobs in the system" />
        <StatCard label="Open jobs" value={String(overview?.openJobsCount ?? 0)} meta="Roles currently visible to candidates" />
      </div>
      <div className="surface" style={{ padding: "1.4rem" }}>
        <div className="space-between">
          <strong>Admin management panel</strong>
          <button className="btn btn-secondary">Export report</button>
        </div>
        <table className="table" style={{ marginTop: "1rem" }}>
          <thead>
            <tr>
              <th>Collection</th>
              <th>Total</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Users</td>
              <td>{users.length}</td>
              <td>Accounts visible to the admin API</td>
            </tr>
            <tr>
              <td>Companies</td>
              <td>{companies.length}</td>
              <td>Employer organizations on the platform</td>
            </tr>
            <tr>
              <td>Jobs</td>
              <td>{jobs.length}</td>
              <td>Public and employer-managed listings</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
