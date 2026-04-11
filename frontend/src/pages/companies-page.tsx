import { useQuery } from "@tanstack/react-query";
import { CompanyCard } from "../components/shared/company-card";
import { EmptyState } from "../components/shared/empty-state";
import { SkeletonList } from "../components/shared/skeleton-list";
import { listCompanies } from "../services/companies-service";

export function CompaniesPage() {
  const { data: companies = [], isLoading, isError } = useQuery({
    queryKey: ["companies"],
    queryFn: listCompanies
  });

  return (
    <section className="section">
      <div className="container stack">
        <div className="jp-page-header">
          <div className="eyebrow">Companies</div>
          <h1 className="headline" style={{ fontSize: "2.7rem", margin: "0.4rem 0" }}>
            Explore employer brands before you apply.
          </h1>
          <p className="helper">Browse company profiles, hiring focus, and open positions in one place.</p>
        </div>
        {isLoading ? <SkeletonList count={3} /> : null}
        {isError ? <EmptyState title="Could not load companies" description="Check that the backend is running and CORS is enabled." /> : null}
        {!isLoading && !isError ? (
          <div className="grid grid-2">
            {companies.length ? companies.map((company) => <CompanyCard key={company.id} company={company} />) : (
              <EmptyState title="No companies yet" description="Employer profiles will appear here as companies join JobPlus." />
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
