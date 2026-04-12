import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthCard } from "../components/auth/auth-card";
import { AuthShell } from "../components/auth/auth-shell";
import { InlineMessage } from "../components/auth/inline-message";
import { OrDivider } from "../components/auth/or-divider";
import { PasswordField } from "../components/auth/password-field";
import { SocialButton } from "../components/auth/social-button";
import { TextField } from "../components/auth/text-field";
import { authStore } from "../store/auth-store";
import { login } from "../services/auth-service";
import type { UserRole } from "../types/auth";

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login: saveSession, setDemoRole } = authStore();
  const [form, setForm] = useState({ username: "", password: "", remember: true });
  const [error, setError] = useState<{ username?: string; password?: string; server?: string }>({});
  const [loading, setLoading] = useState(false);

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
            label={t("auth.continueGoogle")}
            onClick={() => undefined}
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
            label={t("auth.continueLinkedin")}
            onClick={() => undefined}
            icon={
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="4" fill="#0A66C2" />
                <path
                  fill="#fff"
                  d="M7.06 9.2h2.5V17h-2.5V9.2Zm1.26-3.4a1.45 1.45 0 1 1 0 2.9 1.45 1.45 0 0 1 0-2.9Zm2.8 3.4h2.4v1.06h.03c.33-.63 1.16-1.3 2.38-1.3 2.54 0 3.01 1.67 3.01 3.84V17h-2.5v-3.72c0-.89-.02-2.03-1.24-2.03-1.24 0-1.43.97-1.43 1.96V17h-2.5V9.2Z"
                />
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
