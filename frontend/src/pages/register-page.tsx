import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthCard } from "../components/auth/auth-card";
import { AuthShell } from "../components/auth/auth-shell";
import { InlineMessage } from "../components/auth/inline-message";
import { OrDivider } from "../components/auth/or-divider";
import { PasswordField } from "../components/auth/password-field";
import { SocialButton } from "../components/auth/social-button";
import { TextField } from "../components/auth/text-field";
import { authStore } from "../store/auth-store";
import { register } from "../services/auth-service";
import type { UserRole } from "../types/auth";

export function RegisterPage() {
  const navigate = useNavigate();
  const { login } = authStore();
  const [role, setRole] = useState<UserRole>("candidate");
  const [form, setForm] = useState({ fullName: "", username: "", email: "", password: "", confirmPassword: "", acceptTerms: false });
  const [message, setMessage] = useState<{ error?: string; success?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const validationError = validateRegisterForm(form);
    if (validationError) {
      setMessage({ error: validationError });
      return;
    }
    setSubmitting(true);
    try {
      const session = await register({
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        password: form.password,
        role
      });
      login(session);
      navigate(resolveRoute(session.user.role));
    } catch {
      setMessage({ error: "We could not create your account right now. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Create your JobPlus account."
      subtitle="Join as a candidate or employer and manage your career or hiring workflows from one professional workspace."
    >
      <AuthCard title="Sign up" subtitle="Build your account in under a minute.">
        <form className="stack" onSubmit={handleSubmit}>
          <TextField
            label="Full name"
            value={form.fullName}
            onChange={(value) => setForm((current) => ({ ...current, fullName: value }))}
            placeholder="Enter your full name"
            autoComplete="name"
            required
          />
          <TextField
            label="Username"
            value={form.username}
            onChange={(value) => setForm((current) => ({ ...current, username: value }))}
            placeholder="Choose a username"
            autoComplete="username"
            required
          />
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={(value) => setForm((current) => ({ ...current, email: value }))}
            placeholder="Enter your email"
            autoComplete="email"
            required
          />
          <div className="field">
            <span>Role *</span>
            <div className="row" style={{ flexWrap: "wrap" }}>
              <button type="button" className={role === "candidate" ? "btn btn-primary" : "btn btn-secondary"} onClick={() => setRole("candidate")}>
                Job seeker
              </button>
              <button type="button" className={role === "employer" ? "btn btn-primary" : "btn btn-secondary"} onClick={() => setRole("employer")}>
                Employer / company
              </button>
            </div>
          </div>
          <PasswordField
            label="Password"
            value={form.password}
            onChange={(value) => setForm((current) => ({ ...current, password: value }))}
            placeholder="Create password"
            autoComplete="new-password"
            required
            showStrength
          />
          <PasswordField
            label="Confirm password"
            value={form.confirmPassword}
            onChange={(value) => setForm((current) => ({ ...current, confirmPassword: value }))}
            placeholder="Confirm password"
            autoComplete="new-password"
            required
          />
          <label className="helper" style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}>
            <input
              type="checkbox"
              checked={form.acceptTerms}
              onChange={(event) => setForm((current) => ({ ...current, acceptTerms: event.target.checked }))}
            />
            I agree to the Terms and Privacy Policy.
          </label>
          {message.error ? <InlineMessage type="error" message={message.error} /> : null}
          {message.success ? <InlineMessage type="success" message={message.success} /> : null}
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <OrDivider />
        <div className="stack" style={{ gap: "0.6rem" }}>
          <SocialButton
            label="Continue with Google"
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
            label="Continue with LinkedIn"
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

        <div className="stack" style={{ gap: "0.4rem", marginTop: "0.25rem" }}>
          <div className="helper">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
          <div className="helper">
            Demo admin access: username <strong>admin</strong>, password <strong>000000</strong>
          </div>
        </div>
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

function validateRegisterForm(form: {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}): string | null {
  if (!form.fullName.trim()) return "Full name is required.";
  if (!form.username.trim() || form.username.trim().length < 3) return "Username must be at least 3 characters.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return "Please enter a valid email address.";
  if (form.password.length < 8) return "Password must be at least 8 characters.";
  if (form.password !== form.confirmPassword) return "Passwords do not match.";
  if (!form.acceptTerms) return "Please accept Terms and Privacy Policy.";
  return null;
}
