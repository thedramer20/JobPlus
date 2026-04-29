interface StatCardProps {
  label: string;
  value: string;
  meta: string;
}

export function StatCard({ label, value, meta }: StatCardProps) {
  return (
    <div className="metric jp-reveal">
      <span className="helper">{label}</span>
      <strong>{value}</strong>
      <div className="helper">{meta}</div>
    </div>
  );
}
