import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { InlineMessage } from "../components/auth/inline-message";
import { AuthCard } from "../components/auth/auth-card";
import { AuthShell } from "../components/auth/auth-shell";
import { authStore } from "../store/auth-store";
import { buildSessionFromToken } from "../services/auth-service";
import type { UserRole } from "../types/auth";

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = authStore();
  const [message, setMessage] = useState("Finalizing authentication...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const provider = searchParams.get("provider") ?? "social";
    const mode = searchParams.get("mode") ?? "signin";
    const role = searchParams.get("role");
    const username = searchParams.get("username");
    const callbackError = searchParams.get("error");

    if (callbackError) {
      setError(decodeURIComponent(callbackError));
      return;
    }

    if (!token) {
      setError("Missing authentication token. Please try again.");
      return;
    }

    setMessage(mode === "link" ? `Connecting ${provider} account...` : `Signing in with ${provider}...`);

    buildSessionFromToken(token, { role: role ?? undefined, username: username ?? undefined })
      .then((session) => {
        login(session);
        if (mode === "link") {
          navigate(resolveSettingsRoute(session.user.role), { replace: true });
          return;
        }
        navigate(resolveRoute(session.user.role), { replace: true });
      })
      .catch(() => setError("Unable to finalize social login. Please try again."));
  }, [login, navigate, searchParams]);

  return (
    <AuthShell title="Social authentication" subtitle="Securely connecting your account">
      <AuthCard title="Please wait" subtitle={message}>
        {error ? <InlineMessage type="error" message={error} /> : <InlineMessage type="success" message={message} />}
      </AuthCard>
    </AuthShell>
  );
}

function resolveRoute(role: UserRole) {
  if (role === "admin") {
    return "/admin";
  }
  if (role === "employer") {
    return "/employer/dashboard";
  }
  return "/app/dashboard";
}

function resolveSettingsRoute(role: UserRole) {
  if (role === "admin") {
    return "/admin/settings?linked=success";
  }
  if (role === "employer") {
    return "/employer/settings?linked=success";
  }
  return "/app/settings?linked=success";
}
