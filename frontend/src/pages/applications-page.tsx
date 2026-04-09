import { useQuery } from "@tanstack/react-query";
import { ApplicationCard } from "../components/shared/application-card";
import { EmptyState } from "../components/shared/empty-state";
import { listMyApplications } from "../services/applications-service";

export function ApplicationsPage() {
  const { data: applications = [], isLoading, isError } = useQuery({ queryKey: ["applications", "me"], queryFn: listMyApplications });

  return (
    <div className="stack">
      <div className="space-between">
        <div>
          <div className="eyebrow">Application tracking</div>
          <h2 className="headline" style={{ fontSize: "2rem", margin: "0.35rem 0 0" }}>
            Track every stage of your hiring journey.
          </h2>
        </div>
        <div className="row" style={{ flexWrap: "wrap" }}>
          <span className="tag">All</span>
          <span className="tag">Pending</span>
          <span className="tag">Reviewed</span>
          <span className="tag">Accepted</span>
        </div>
      </div>
      {isLoading ? <div className="surface" style={{ padding: "1.3rem" }}>Loading applications...</div> : null}
      {isError ? <EmptyState title="Could not load applications" description="Check authentication and backend status." /> : null}
      {!isLoading && !isError ? (
        <div className="grid grid-2">
          {applications.length ? applications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          )) : <EmptyState title="No applications yet" description="Your submitted applications will appear here." />}
        </div>
      ) : null}
    </div>
  );
}
