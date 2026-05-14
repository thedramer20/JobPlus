interface SkeletonListProps {
  count?: number;
  cardClassName?: string;
}

export function SkeletonList({ count = 3, cardClassName = "" }: SkeletonListProps) {
  return (
    <div className="stack">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={`jp-skeleton-card ${cardClassName}`.trim()}>
          <div className="jp-skeleton-line jp-skeleton-line-lg" />
          <div className="jp-skeleton-line jp-skeleton-line-md" />
          <div className="jp-skeleton-line jp-skeleton-line-sm" />
        </div>
      ))}
    </div>
  );
}
