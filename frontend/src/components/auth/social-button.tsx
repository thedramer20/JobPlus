import type { ReactNode } from "react";

interface SocialButtonProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function SocialButton({ icon, label, onClick, disabled = false }: SocialButtonProps) {
  return (
    <button type="button" className="btn btn-secondary jp-social-button" onClick={onClick} disabled={disabled}>
      <span aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
