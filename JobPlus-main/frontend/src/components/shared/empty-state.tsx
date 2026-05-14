interface EmptyStateProps {
  title: string;
  description: string;
  compact?: boolean;
}

export function EmptyState({ title, description, compact = false }: EmptyStateProps) {
  return (
    <div className={`empty-state ${compact ? "is-compact" : ""}`}>
      <div className="jp-empty-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v9A1.5 1.5 0 0 1 18.5 18h-13A1.5 1.5 0 0 1 4 16.5v-9Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 10h16" />
        </svg>
      </div>
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p className="helper" style={{ marginBottom: 0 }}>
        {description}
      </p>
    </div>
  );
}
