import clsx from "clsx";

type LogoVariant = "icon" | "wordmark" | "lockup";

interface JobPlusLogoProps {
  variant?: LogoVariant;
  className?: string;
  iconClassName?: string;
  wordmarkClassName?: string;
  title?: string;
}

export function JobPlusLogo({
  variant = "lockup",
  className,
  iconClassName,
  wordmarkClassName,
  title = "JobPlus"
}: JobPlusLogoProps) {
  if (variant === "icon") {
    return <JobPlusLogoIcon className={clsx("jp-logo-icon", iconClassName, className)} title={title} />;
  }

  if (variant === "wordmark") {
    return <JobPlusLogoWordmark className={clsx("jp-logo-wordmark", wordmarkClassName, className)} title={title} />;
  }

  return (
    <span className={clsx("jp-logo-lockup", className)} aria-label={title}>
      <JobPlusLogoIcon className={clsx("jp-logo-icon", iconClassName)} title={title} />
      <JobPlusLogoWordmark className={clsx("jp-logo-wordmark", wordmarkClassName)} title={title} />
    </span>
  );
}

function JobPlusLogoIcon({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label={title ?? "JobPlus logo"}
      focusable="false"
    >
      <defs>
        <linearGradient id="jp-logo-bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="58%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <linearGradient id="jp-logo-stroke" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#dbeafe" />
        </linearGradient>
      </defs>
      <rect x="2.5" y="2.5" width="59" height="59" rx="18" fill="url(#jp-logo-bg)" />
      <path
        d="M42.2 17.8v24.7a13 13 0 0 1-13 13H17.8"
        fill="none"
        stroke="url(#jp-logo-stroke)"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.8 23.6a10.7 10.7 0 0 1 18.6 0"
        fill="none"
        stroke="url(#jp-logo-stroke)"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <circle cx="17.8" cy="55.5" r="3.1" fill="#ffffff" />
      <circle cx="42.2" cy="17.8" r="2.4" fill="#ffffff" opacity="0.9" />
      <circle cx="23.5" cy="22.3" r="2" fill="#dbeafe" opacity="0.95" />
    </svg>
  );
}

function JobPlusLogoWordmark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 198 36"
      className={className}
      role="img"
      aria-label={title ?? "JobPlus wordmark"}
      focusable="false"
    >
      <defs>
        <linearGradient id="jp-wordmark-grad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="52%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      <text
        x="0"
        y="27"
        fontFamily="Inter, system-ui, -apple-system, Segoe UI, sans-serif"
        fontWeight="800"
        fontSize="28"
        letterSpacing="-0.9"
        fill="url(#jp-wordmark-grad)"
      >
        JobPlus
      </text>
    </svg>
  );
}
