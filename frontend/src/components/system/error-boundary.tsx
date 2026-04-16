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
              padding: "2rem",
              textAlign: "center"
            }}
          >
            <div style={{
              width: "80px",
              height: "80px",
              margin: "0 auto 1.5rem",
              borderRadius: "50%",
              background: "#f8fafc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.5rem"
            }}>
              ⚠️
            </div>
            <h1 style={{
              margin: "0.6rem 0 0.9rem",
              fontSize: "2rem",
              fontWeight: 700,
              color: "#0f172a"
            }}>
              Oops! Something went wrong
            </h1>
            <p style={{
              margin: 0,
              color: "#526072",
              fontSize: "1.1rem",
              lineHeight: "1.6",
              marginBottom: "2rem"
            }}>
              {this.state.error.message || "An unexpected error occurred while loading this page."}
            </p>
            <div style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap"
            }}>
              <button
                onClick={() => window.location.href = "/"}
                style={{
                  padding: "0.85rem 1.5rem",
                  borderRadius: "16px",
                  background: "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                Go Home
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: "0.85rem 1.5rem",
                  borderRadius: "16px",
                  background: "#ffffff",
                  color: "#0f172a",
                  border: "1px solid #dbe4ef",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                Try Again
              </button>
            </div>
            {import.meta.env.DEV && (
              <details style={{
                marginTop: "2rem",
                padding: "1rem",
                borderRadius: "16px",
                background: "#f8fafc",
                textAlign: "left",
                fontSize: "0.9rem",
                color: "#526072"
              }}>
                <summary style={{
                  cursor: "pointer",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                  color: "#0f172a"
                }}>
                  Developer Details
                </summary>
                <pre style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontFamily: "monospace"
                }}>
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
