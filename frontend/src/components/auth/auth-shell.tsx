import type { ReactNode } from "react";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <section className="section jp-auth-shell">
      <div className="container jp-auth-grid">
        <aside className="jp-auth-brand surface">
          <div className="eyebrow">JobPlus Authentication</div>
          <h1 className="headline jp-auth-brand-title">JobPlus</h1>
          <p className="jp-auth-brand-copy">{title}</p>
          <p className="helper" style={{ maxWidth: "56ch" }}>
            {subtitle}
          </p>
          <div className="jp-auth-floating">
            <article className="jp-auth-float-card">
              <strong>10,000+</strong>
              <span>Active users</span>
            </article>
            <article className="jp-auth-float-card">
              <strong>1,200+</strong>
              <span>Hiring companies</span>
            </article>
            <article className="jp-auth-float-card">
              <strong>24,000+</strong>
              <span>Open opportunities</span>
            </article>
          </div>
        </aside>
        <div className="jp-auth-form-zone">{children}</div>
      </div>
    </section>
  );
}
