import { Outlet } from "react-router-dom";
import { JobPlusTopbar } from "../components/shared/jobplus-topbar";

export function MarketingLayout() {
  return (
    <div className="page-shell">
      <JobPlusTopbar />
      <Outlet />
      <footer className="footer">
        <div className="container space-between">
          <div>
            <strong>JobPlus</strong>
            <div className="helper">Modern hiring for high-growth teams.</div>
          </div>
          <div className="helper">Candidate-first UX | Employer-grade workflows | Admin-ready structure</div>
        </div>
      </footer>
    </div>
  );
}
