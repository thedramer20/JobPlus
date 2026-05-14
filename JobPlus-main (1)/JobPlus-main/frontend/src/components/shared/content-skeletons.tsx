export function ProfilePageSkeleton() {
  return (
    <div className="stack">
      <div className="jp-skeleton-card" style={{ minHeight: "210px" }}>
        <div className="jp-skeleton-line jp-skeleton-line-lg" />
        <div className="jp-skeleton-line jp-skeleton-line-md" />
        <div className="jp-skeleton-line jp-skeleton-line-sm" />
      </div>
      <div className="jp-skeleton-card">
        <div className="jp-skeleton-line jp-skeleton-line-lg" />
        <div className="jp-skeleton-line jp-skeleton-line-md" />
        <div className="jp-skeleton-line jp-skeleton-line-sm" />
      </div>
      <div className="jp-skeleton-card">
        <div className="jp-skeleton-line jp-skeleton-line-lg" />
        <div className="jp-skeleton-line jp-skeleton-line-md" />
        <div className="jp-skeleton-line jp-skeleton-line-sm" />
      </div>
    </div>
  );
}

export function JobDetailsSkeleton() {
  return (
    <div className="stack">
      <div className="jp-skeleton-card" style={{ minHeight: "180px" }}>
        <div className="jp-skeleton-line jp-skeleton-line-lg" />
        <div className="jp-skeleton-line jp-skeleton-line-md" />
      </div>
      <div className="jp-skeleton-card" style={{ minHeight: "280px" }}>
        <div className="jp-skeleton-line jp-skeleton-line-lg" />
        <div className="jp-skeleton-line jp-skeleton-line-md" />
        <div className="jp-skeleton-line jp-skeleton-line-md" />
        <div className="jp-skeleton-line jp-skeleton-line-sm" />
      </div>
    </div>
  );
}

export function NotificationsSkeleton() {
  return (
    <div className="stack">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="jp-skeleton-card">
          <div className="jp-skeleton-line jp-skeleton-line-md" />
          <div className="jp-skeleton-line jp-skeleton-line-sm" />
        </div>
      ))}
    </div>
  );
}
