import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <section className="surface jp-auth-card">
      <header className="stack" style={{ gap: "0.25rem" }}>
        <h2 style={{ margin: 0 }}>{title}</h2>
        <p className="helper" style={{ margin: 0 }}>
          {subtitle}
        </p>
      </header>
      {children}
    </section>
  );
}
