import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authStore } from "../store/auth-store";
import { login } from "../services/auth-service";
import type { UserRole } from "../types/auth";

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login: saveSession, setDemoRole } = authStore();
  const [form, setForm] = useState({ username: "", password: "", remember: true });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const session = await login({ username: form.username, password: form.password });
      saveSession(session);
      navigate(searchParams.get("redirect") ?? resolveAuthenticatedRoute(session.user.role));
    } catch {
      setError("Login failed. Check your credentials or use a demo account while backend auth is still evolving.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <div className="container grid grid-2">
        <div className="surface" style={{ padding: "2rem" }}>
          <div className="eyebrow">Secure sign in</div>
          <h1 className="headline" style={{ fontSize: "2.5rem", margin: "0.35rem 0" }}>
            Access your hiring workspace with confidence.
          </h1>
          <p className="helper" style={{ maxWidth: "60ch" }}>
            JobPlus gives candidates a clearer job search and gives employers structured hiring workflows that feel closer
            to a real product than a simple class project.
          </p>
          <div className="grid grid-2" style={{ marginTop: "1.2rem" }}>
            <div className="metric">
              <span className="helper">Jobs posted</span>
              <strong>10,000+</strong>
              <div className="helper">Growing marketplace experience</div>
            </div>
            <div className="metric">
              <span className="helper">Hiring teams</span>
              <strong>500+</strong>
              <div className="helper">Employers building pipeline visibility</div>
            </div>
          </div>
          <div className="stack" style={{ marginTop: "1.2rem" }}>
            <div className="subtle-card">
              <strong>Why candidates like it</strong>
              <div className="helper">Track applications in real time, save jobs, manage resumes, and build a stronger profile.</div>
            </div>
            <div className="subtle-card">
              <strong>Why employers like it</strong>
              <div className="helper">Post jobs, manage applicants, and organize the hiring flow in one clean workspace.</div>
            </div>
          </div>
        </div>

        <div className="surface" style={{ padding: "2rem" }}>
          <form className="stack" onSubmit={handleSubmit}>
            <div>
              <h2 style={{ margin: "0 0 0.3rem" }}>Welcome back</h2>
              <div className="helper">Use your JobPlus account to continue.</div>
            </div>

            <div className="auth-note">
              New to JobPlus? <Link to="/register">Create your sign up account</Link>
            </div>

            <div className="field">
              <label>Username</label>
              <input
                className="input"
                value={form.username}
                onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
                placeholder="Enter your username"
              />
            </div>

            <div className="field">
              <label>Password</label>
              <div className="row" style={{ gap: "0.5rem" }}>
                <input
                  className="input"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  placeholder="Enter your password"
                />
                <button type="button" className="btn btn-secondary" onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="space-between">
              <label className="helper" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(event) => setForm((current) => ({ ...current, remember: event.target.checked }))}
                />
                Remember me
              </label>
              <Link className="helper" to="/forgot-password">
                Forgot password?
              </Link>
            </div>

            {error ? <div className="status status-danger">{error}</div> : null}

            <button className="btn btn-primary" disabled={loading} type="submit">
              {loading ? "Signing in..." : "Log in"}
            </button>

            <div className="stack">
              <div className="helper">Continue faster</div>
              <div className="grid grid-3">
                <button type="button" className="btn btn-secondary">Google</button>
                <button type="button" className="btn btn-secondary">GitHub</button>
                <button type="button" className="btn btn-secondary">LinkedIn</button>
              </div>
            </div>
          </form>

          <div className="stack" style={{ marginTop: "1.3rem" }}>
            <div className="helper">Quick demo access</div>
            <div className="row" style={{ flexWrap: "wrap" }}>
              <button className="btn btn-secondary" onClick={() => useDemoRole("candidate", setDemoRole, navigate)}>
                Candidate demo
              </button>
              <button className="btn btn-secondary" onClick={() => useDemoRole("employer", setDemoRole, navigate)}>
                Employer demo
              </button>
              <button className="btn btn-secondary" onClick={() => useDemoRole("admin", setDemoRole, navigate)}>
                Admin demo
              </button>
            </div>
            <div className="helper">Candidate demo: explore jobs and applications. Employer demo: manage company and job postings.</div>
          </div>

          <div className="stack" style={{ marginTop: "1.3rem", gap: "0.4rem" }}>
            <div className="helper">
              Don&apos;t have an account? <Link to="/register">Sign up now</Link>
            </div>
            <div className="helper">
              Are you hiring? <Link to="/register">Register as an employer</Link>
            </div>
            <div className="helper">
              By continuing, you agree to the Terms and Privacy policy.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
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
