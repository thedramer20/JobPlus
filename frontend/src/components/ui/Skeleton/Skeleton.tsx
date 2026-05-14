// Generic skeleton block
export const Skeleton = ({
  width = '100%',
  height = '16px',
  borderRadius = '8px',
  className = '',
  style,
}: {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div
    className={`skeleton ${className}`}
    style={{ width, height, borderRadius, ...style }}
    aria-hidden="true"
  />
);

// Job Card skeleton — matches exactly the JobCard layout
export const JobCardSkeleton = () => (
  <div className="job-card" style={{ pointerEvents: 'none' }}>
    <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
      <Skeleton width="42px" height="42px" borderRadius="11px" />
      <div style={{ flex: 1 }}>
        <Skeleton width="60%" height="13px" />
        <Skeleton width="40%" height="11px" style={{ marginTop: '5px' }} />
      </div>
    </div>
    <Skeleton width="80%" height="15px" />
    <Skeleton width="40%" height="13px" style={{ marginTop: '8px' }} />
    <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
      <Skeleton width="55px" height="22px" borderRadius="99px" />
      <Skeleton width="55px" height="22px" borderRadius="99px" />
      <Skeleton width="55px" height="22px" borderRadius="99px" />
    </div>
    <div style={{ display:'flex', justifyContent:'space-between', marginTop:'14px' }}>
      <Skeleton width="80px" height="11px" />
      <Skeleton width="70px" height="22px" borderRadius="99px" />
    </div>
  </div>
);

// Company card skeleton
export const CompanyCardSkeleton = () => (
  <div className="company-card" style={{ pointerEvents: 'none' }}>
    <Skeleton width="56px" height="56px" borderRadius="16px" />
    <div style={{ marginTop: '12px' }}>
      <Skeleton width="70%" height="16px" />
      <Skeleton width="50%" height="13px" style={{ marginTop: '5px' }} />
    </div>
    <Skeleton width="100%" height="34px" borderRadius="10px" style={{ marginTop: '12px' }} />
  </div>
);

// Stats bar skeleton
export const StatsBarSkeleton = () => (
  <div style={{ display: 'flex', justifyContent: 'space-around', padding: '40px 24px' }}>
    {[1,2,3,4].map(i => (
      <div key={i} style={{ textAlign: 'center' }}>
        <Skeleton width="120px" height="40px" borderRadius="8px" />
        <Skeleton width="80px" height="14px" borderRadius="6px" style={{ marginTop: '8px' }} />
      </div>
    ))}
  </div>
);
