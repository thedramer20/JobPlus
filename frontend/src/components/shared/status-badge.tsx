import { classNames } from "../../lib/utils";

interface StatusBadgeProps {
  tone: "success" | "warning" | "danger" | "info";
  label: string;
}

export function StatusBadge({ tone, label }: StatusBadgeProps) {
  return <span className={classNames("status", `status-${tone}`)}>{label}</span>;
}
