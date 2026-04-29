import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthCard } from "../components/auth/auth-card";
import { AuthShell } from "../components/auth/auth-shell";
import { InlineMessage } from "../components/auth/inline-message";
import { PasswordField } from "../components/auth/password-field";
import { resetPassword } from "../services/auth-service";
import { MIN_PASSWORD_LENGTH, validatePasswordPolicy } from "../lib/password-policy";

export function ResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [state, setState] = useState<{ error?: string; success?: string; loading?: boolean }>({});

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (password.length < MIN_PASSWORD_LENGTH) {
      setState({ error: t("auth.validations.passwordMin") });
      return;
    }
    if (!validatePasswordPolicy(password).valid) {
      setState({ error: t("auth.validations.passwordComplexity", { defaultValue: "Password must include uppercase, lowercase, and a number." }) });
      return;
    }
    if (password !== confirmPassword) {
      setState({ error: "Passwords do not match." });
      return;
    }
    setState({ loading: true });
    await resetPassword(searchParams.get("token"), password);
    setState({ loading: false, success: "Password reset successfully. Redirecting to login..." });
    window.setTimeout(() => navigate("/login"), 1200);
  }

  return (
    <AuthShell
      title="Set a new secure password."
      subtitle="Use a strong password to keep your JobPlus account secure and trusted."
    >
      <AuthCard title="Reset password" subtitle="Enter your new password and confirm it.">
        <form className="stack" onSubmit={handleSubmit}>
          <PasswordField
            label="New password"
            value={password}
            onChange={setPassword}
            placeholder="Enter new password"
            autoComplete="new-password"
            required
            showStrength
          />
          <PasswordField
            label="Confirm password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Re-enter password"
            autoComplete="new-password"
            required
          />
          {state.error ? <InlineMessage type="error" message={state.error} /> : null}
          {state.success ? <InlineMessage type="success" message={state.success} /> : null}
          <button className="btn btn-primary" type="submit" disabled={!!state.loading}>
            {state.loading ? "Updating..." : "Reset password"}
          </button>
        </form>
        <div className="helper" style={{ marginTop: "0.6rem" }}>
          Back to <Link to="/login">Sign in</Link>
        </div>
      </AuthCard>
    </AuthShell>
  );
}
