import type { ReactNode } from "react";
import "../../styles/auth-shell-new.css";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <section className="section jp-auth-shell">
      <div className="container jp-auth-grid">
        <aside className="jp-auth-brand">
          {/* Logo */}
          <div className="jp-auth-logo">
            <div className="jp-logo-mark">J+</div>
            <span className="jp-logo-text">JobPlus</span>
          </div>

          {/* Headline */}
          <h1 className="jp-auth-headline">Start your journey with JobPlus</h1>
          <p className="jp-auth-subtitle">{subtitle}</p>

          {/* Floating Job Cards */}
          <div className="jp-auth-floating">
            <div className="jp-float-card jp-float-card-1">
              <div className="jp-float-card-header">
                <span className="jp-match-badge">92% match</span>
              </div>
              <h3 className="jp-float-card-title">Senior Product Designer</h3>
              <p className="jp-float-card-company">TechCorp Inc.</p>
              <div className="jp-float-card-footer">
                <span className="jp-salary">$120k - $160k</span>
                <span className="jp-location">San Francisco</span>
              </div>
            </div>

            <div className="jp-float-card jp-float-card-2">
              <div className="jp-float-card-header">
                <span className="jp-match-badge">87% match</span>
              </div>
              <h3 className="jp-float-card-title">Full Stack Engineer</h3>
              <p className="jp-float-card-company">InnovateLabs</p>
              <div className="jp-float-card-footer">
                <span className="jp-salary">$140k - $180k</span>
                <span className="jp-location">Remote</span>
              </div>
            </div>

            <div className="jp-float-card jp-float-card-3">
              <div className="jp-float-card-header">
                <span className="jp-match-badge">95% match</span>
              </div>
              <h3 className="jp-float-card-title">UX Researcher</h3>
              <p className="jp-float-card-company">DesignHub</p>
              <div className="jp-float-card-footer">
                <span className="jp-salary">$110k - $145k</span>
                <span className="jp-location">New York</span>
              </div>
            </div>
          </div>

          {/* Trust Line */}
          <div className="jp-auth-trust">
            <svg className="jp-trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3v10Z"/>
              <path d="M12 22s-8-4-8-10V5l8-3v10Z"/>
            </svg>
            <span className="jp-trust-text">Trusted by 10,000+ candidates and 1,200+ companies worldwide</span>
          </div>
        </aside>
        <div className="jp-auth-form-zone">{children}</div>
      </div>
    </section>
  );
}
