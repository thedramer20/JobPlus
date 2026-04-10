import React from "react";

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    error: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("JobPlus render failure:", error);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: "2rem",
            background: "#f8fafc",
            color: "#0f172a"
          }}
        >
          <div
            style={{
              width: "min(100%, 760px)",
              background: "#ffffff",
              border: "1px solid #dbe4ef",
              borderRadius: "24px",
              boxShadow: "0 18px 60px rgba(15, 23, 42, 0.08)",
              padding: "2rem"
            }}
          >
            <div style={{ fontSize: "0.82rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#2563eb" }}>
              JobPlus startup error
            </div>
            <h1 style={{ margin: "0.6rem 0 0.9rem", fontSize: "2rem" }}>The frontend crashed during render.</h1>
            <p style={{ margin: 0, color: "#526072" }}>
              The app caught the failure instead of showing a blank screen. Refresh after the fix or check the browser console for the full stack.
            </p>
            <pre
              style={{
                marginTop: "1.25rem",
                padding: "1rem",
                overflowX: "auto",
                borderRadius: "16px",
                background: "#0f172a",
                color: "#f8fafc"
              }}
            >
              {this.state.error.message}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
