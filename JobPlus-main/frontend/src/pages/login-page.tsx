import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { AuthCard } from "../components/auth/auth-card";
import { AuthShell } from "../components/auth/auth-shell";
import { InlineMessage } from "../components/auth/inline-message";
import { OrDivider } from "../components/auth/or-divider";
import { PasswordField } from "../components/auth/password-field";
import { SocialButton } from "../components/auth/social-button";
import { TextField } from "../components/auth/text-field";
import { authStore } from "../store/auth-store";
import { login, startSocialAuth, getSocialProviders, type SocialProvider } from "../services/auth-service";
import type { UserRole } from "../types/auth";

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login: saveSession, setDemoRole } = authStore();
  const [form, setForm] = useState({ username: "", password: "", remember: true });
  const [error, setError] = useState<{ username?: string; password?: string; server?: string }>({});
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null);
  const socialProvidersQuery = useQuery({
    queryKey: ["auth", "social-providers"],
    queryFn: getSocialProviders,
    retry: 0
  });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextError: { username?: string; password?: string; server?: string } = {};
    if (!form.username.trim()) {
      nextError.username = t("auth.validations.requiredUsername");
    }
    if (form.username.includes("@") && !isEmail(form.username.trim())) {
      nextError.username = t("auth.validations.invalidEmail");
    }
    if (!form.password) {
      nextError.password = t("auth.validations.requiredPassword");
    }
    if (nextError.username || nextError.password) {
      setError(nextError);
      return;
    }
    setError({});
    setLoading(true);
    try {
      const session = await login({ username: form.username, password: form.password });
      saveSession(session);
      navigate(searchParams.get("redirect") ?? resolveAuthenticatedRoute(session.user.role));
    } catch (cause) {
      const raw = String(cause ?? "").toLowerCase();
      const serverMessage = raw.includes("404")
        ? t("auth.accountNotFound")
        : raw.includes("401")
          ? t("auth.invalidCredentials")
          : t("auth.loginError");
      setError({ server: serverMessage });
    } finally {
      setLoading(false);
    }
  }

  function handleSocialLogin(provider: SocialProvider) {
    const enabled = socialProvidersQuery.data?.[provider];
    if (!enabled) {
      setError({ server: `${provider[0].toUpperCase() + provider.slice(1)} sign-in is not configured yet.` });
      return;
    }
    setSocialLoading(provider);
    startSocialAuth(provider, "signin");
  }

  return (
    <AuthShell
      title={t("auth.loginTitle")}
      subtitle={t("auth.loginSubtitle")}
    >
      <AuthCard title={t("auth.welcomeBack")} subtitle={t("auth.loginCardSubtitle")}>
        <form className="stack" onSubmit={handleSubmit}>
          <TextField
            label={t("auth.emailOrUsername")}
            value={form.username}
            onChange={(value) => setForm((current) => ({ ...current, username: value }))}
            placeholder={t("auth.emailOrUsername")}
            autoComplete="username"
            error={error.username}
            required
          />

          <PasswordField
            label={t("auth.password")}
            value={form.password}
            onChange={(value) => setForm((current) => ({ ...current, password: value }))}
            placeholder={t("auth.password")}
            autoComplete="current-password"
            error={error.password}
            required
          />

          <div className="space-between">
            <label className="helper" style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}>
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(event) => setForm((current) => ({ ...current, remember: event.target.checked }))}
              />
              {t("auth.rememberMe")}
            </label>
            <Link className="helper" to="/forgot-password">
              {t("auth.forgotPassword")}
            </Link>
          </div>

          {error.server ? <InlineMessage type="error" message={error.server} /> : null}
          <button className="btn btn-primary" disabled={loading} type="submit">
            {loading ? t("auth.loggingIn") : t("auth.loginAction")}
          </button>
        </form>

        <OrDivider />

        <div className="stack" style={{ gap: "0.6rem" }}>
          <SocialButton
            label={socialLoading === "google" ? "Connecting Google..." : t("auth.continueGoogle")}
            disabled={loading || socialLoading !== null || !socialProvidersQuery.data?.google}
            onClick={() => handleSocialLogin("google")}
            icon={
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  fill="#EA4335"
                  d="M12 10.2v3.9h5.48c-.24 1.25-.95 2.32-2.02 3.03l3.27 2.54c1.9-1.75 2.99-4.34 2.99-7.42 0-.7-.06-1.37-.18-2.02H12Z"
                />
                <path
                  fill="#34A853"
                  d="M12 22c2.7 0 4.97-.9 6.63-2.34l-3.27-2.54c-.9.6-2.06.96-3.36.96-2.58 0-4.77-1.74-5.55-4.08H3.07v2.62A9.99 9.99 0 0 0 12 22Z"
                />
                <path
                  fill="#FBBC05"
                  d="M6.45 14c-.2-.6-.32-1.24-.32-2s.12-1.4.32-2V7.38H3.07A9.99 9.99 0 0 0 2 12c0 1.62.39 3.16 1.07 4.62L6.45 14Z"
                />
                <path
                  fill="#4285F4"
                  d="M12 5.92c1.47 0 2.79.5 3.83 1.47l2.88-2.88C16.97 2.9 14.7 2 12 2A9.99 9.99 0 0 0 3.07 7.38L6.45 10c.78-2.34 2.97-4.08 5.55-4.08Z"
                />
              </svg>
            }
          />
          <SocialButton
            label={socialLoading === "github" ? "Connecting GitHub..." : "Continue with GitHub"}
            disabled={loading || socialLoading !== null || !socialProvidersQuery.data?.github}
            onClick={() => handleSocialLogin("github")}
            icon={
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path fill="#181717" d="M12 .5C5.65.5.5 5.64.5 12c0 5.08 3.29 9.38 7.86 10.9.58.1.79-.25.79-.56 0-.27-.01-1.17-.02-2.13-3.2.69-3.88-1.35-3.88-1.35-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.18 1.77 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.72-1.53-2.55-.29-5.22-1.28-5.22-5.68 0-1.25.45-2.27 1.18-3.06-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17.92-.26 1.9-.39 2.88-.4.98 0 1.96.14 2.88.4 2.19-1.48 3.15-1.17 3.15-1.17.63 1.58.24 2.75.12 3.04.73.79 1.18 1.81 1.18 3.06 0 4.41-2.68 5.39-5.24 5.67.41.35.77 1.03.77 2.08 0 1.5-.01 2.72-.01 3.09 0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12c0-6.36-5.15-11.5-11.5-11.5Z" />
              </svg>
            }
          />
        </div>

        <div className="stack" style={{ gap: "0.6rem", marginTop: "0.25rem" }}>
          <div className="helper">{t("auth.quickDemoAccess")}</div>
          <div className="row" style={{ flexWrap: "wrap" }}>
            <button type="button" className="btn btn-secondary" onClick={() => useDemoRole("candidate", setDemoRole, navigate)}>
              {t("auth.candidateDemo")}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => useDemoRole("employer", setDemoRole, navigate)}>
              {t("auth.employerDemo")}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => useDemoRole("admin", setDemoRole, navigate)}>
              {t("auth.adminDemo")}
            </button>
          </div>
          <div className="helper">
            {t("auth.newToJobplus")} <Link to="/register">{t("auth.createAccount")}</Link>
          </div>
        </div>
      </AuthCard>
    </AuthShell>
  );
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function useDemoRole(
  role: Exclude<UserRole, "guest">,
  setDemoRole: (role: Exclude<UserRole, "guest">) => void,
  navigate: ReturnType<typeof useNavigate>
) {
  setDemoRole(role);
  navigate(defaultRoute(role));
}

function defaultRoute(role: Exclude<UserRole, "guest">) {
  if (role === "candidate") {
    return "/app/dashboard";
  }
  if (role === "employer") {
    return "/employer/dashboard";
  }
  return "/admin";
}

function resolveAuthenticatedRoute(role: UserRole) {
  if (role === "guest") {
    return "/login";
  }
  return defaultRoute(role);
}
