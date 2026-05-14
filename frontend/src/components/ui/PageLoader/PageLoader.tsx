export const PageLoader = () => (
  <div style={{
    position: 'fixed',
    inset: 0,
    background: 'var(--bg-0)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    flexDirection: 'column',
    gap: '16px',
  }}>
    {/* Animated logo mark */}
    <div style={{
      width: '48px',
      height: '48px',
      borderRadius: '14px',
      background: 'linear-gradient(135deg, #5B4FE8, #06B6D4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      fontWeight: '800',
      color: 'white',
      fontFamily: 'Syne, sans-serif',
      animation: 'pulse 1.2s ease infinite',
    }}>
      J+
    </div>
    {/* Loading bar */}
    <div style={{
      width: '120px',
      height: '3px',
      background: 'rgba(255,255,255,0.08)',
      borderRadius: '2px',
      overflow: 'hidden',
    }}>
      <div style={{
        height: '100%',
        borderRadius: '2px',
        background: 'linear-gradient(90deg, #5B4FE8, #06B6D4)',
        animation: 'loadingBar 1.5s ease infinite',
      }} />
    </div>
    <style>{`
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      @keyframes loadingBar {
        0%   { width: 0%; margin-left: 0%; }
        50%  { width: 60%; margin-left: 20%; }
        100% { width: 0%; margin-left: 100%; }
      }
    `}</style>
  </div>
);
