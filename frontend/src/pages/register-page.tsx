import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authStore } from "../store/auth-store";
import { register } from "../services/auth-service";
import type { UserRole } from "../types/auth";

export function RegisterPage() {
  const navigate = useNavigate();
  const { login } = authStore();
  const [role, setRole] = useState<UserRole>("candidate");
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      const session = await register({ ...form, role });
      login(session);
      navigate(role === "employer" ? "/employer/dashboard" : "/app/dashboard");
    } catch {
      setMessage("This screen is wired for the backend contract. If the API is not ready yet, continue through demo login.");
    }
  }

  return (
    <section className="section">
      <div className="container grid grid-2">
        <div className="surface" style={{ padding: "2rem" }}>
          <div className="eyebrow">Create your account</div>
          <h1 className="headline" style={{ fontSize: "2.4rem", margin: "0.4rem 0" }}>
            Join as a candidate or start hiring as an employer.
          </h1>
          <p className="helper">
            Role-first onboarding keeps JobPlus clear and scalable. Candidates enter discovery and applications. Employers
            enter company setup and hiring operations.
          </p>
        </div>
        <div className="surface" style={{ padding: "2rem" }}>
          <form className="stack" onSubmit={handleSubmit}>
            <div className="field">
              <label>Choose role</label>
              <div className="row" style={{ flexWrap: "wrap" }}>
                {[
                  ["candidate", "Job seeker"],
                  ["employer", "Employer / company"]
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={role === value ? "btn btn-primary" : "btn btn-secondary"}
                    onClick={() => setRole(value as UserRole)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="field">
              <label>Username</label>
              <input
                className="input"
                value={form.username}
                onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
              />
            </div>
            <div className="field">
              <label>Password</label>
              <input
                className="input"
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              />
            </div>
            {message ? <div className="status status-info">{message}</div> : null}
            <button className="btn btn-primary" type="submit">
              Create account
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
