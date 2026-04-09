import { NavLink, Outlet } from "react-router-dom";
import { publicNavigation } from "../constants/navigation";
import { SettingsMenu } from "../components/shared/settings-menu";

export function MarketingLayout() {
  return (
    <div className="page-shell">
      <header className="marketing-nav">
        <div className="container space-between">
          <NavLink to="/" className="headline" style={{ fontSize: "1.5rem" }}>
            JobPlus
          </NavLink>
          <nav className="nav-links">
            {publicNavigation.map((item) => (
              <NavLink key={item.path} to={item.path} className="nav-link">
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="row" style={{ alignItems: "center" }}>
            <SettingsMenu />
            <NavLink className="btn btn-secondary" to="/login">
              Log in
            </NavLink>
            <NavLink className="btn btn-primary" to="/register">
              Get started
            </NavLink>
          </div>
        </div>
      </header>
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
