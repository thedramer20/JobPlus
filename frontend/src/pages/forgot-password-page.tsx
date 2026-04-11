import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthCard } from "../components/auth/auth-card";
import { AuthShell } from "../components/auth/auth-shell";
import { InlineMessage } from "../components/auth/inline-message";
import { TextField } from "../components/auth/text-field";
import { requestPasswordReset } from "../services/auth-service";

export function ForgotPasswordPage() {
  const [value, setValue] = useState("");
  const [state, setState] = useState<{ error?: string; success?: string; loading?: boolean }>({});

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!value.trim()) {
      setState({ error: "Email or username is required." });
      return;
    }
    setState({ loading: true });
    await requestPasswordReset(value.trim());
    setState({
      success: "Reset link sent. Please check your inbox (or spam) and continue to reset your password.",
      loading: false
    });
  }

  return (
    <AuthShell
      title="Recover your account with confidence."
      subtitle="We’ll guide you through a quick and secure password reset process."
    >
      <AuthCard title="Forgot password?" subtitle="Enter your email or username to receive a reset link.">
        <form className="stack" onSubmit={handleSubmit}>
          <TextField
            label="Email or username"
            value={value}
            onChange={(next) => setValue(next)}
            placeholder="you@jobplus.app or username"
            required
          />
          {state.error ? <InlineMessage type="error" message={state.error} /> : null}
          {state.success ? <InlineMessage type="success" message={state.success} /> : null}
          <button className="btn btn-primary" type="submit" disabled={!!state.loading}>
            {state.loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
        <div className="helper" style={{ marginTop: "0.6rem" }}>
          Back to <Link to="/login">Sign in</Link>
        </div>
      </AuthCard>
    </AuthShell>
  );
}
