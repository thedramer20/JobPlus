  import React, { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          background: "var(--surface)",
          color: "var(--text)"
        }}>
          <div style={{
            maxWidth: "500px",
            textAlign: "center",
            padding: "2.5rem",
            borderRadius: "var(--radius-lg)",
            background: "var(--surface-muted)",
            boxShadow: "var(--elevation-2)"
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              margin: "0 auto 1.5rem",
              borderRadius: "50%",
              background: "var(--surface)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.5rem"
            }}>
              ⚠️
            </div>
            <h1 style={{
              fontSize: "2rem",
              fontWeight: 700,
              margin: "0 0 1rem",
              color: "var(--text)"
            }}>
              Oops! Something went wrong
            </h1>
            <p style={{
              fontSize: "1.1rem",
              color: "var(--text-soft)",
              marginBottom: "2rem",
              lineHeight: "1.6"
            }}>
              {this.state.error?.message || "An unexpected error occurred while loading this page."}
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
                  borderRadius: "var(--radius-md)",
                  background: "var(--primary)",
                  color: "var(--text-inverse)",
                  border: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all var(--transition-normal)"
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
                  borderRadius: "var(--radius-md)",
                  background: "var(--surface)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all var(--transition-normal)"
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                Try Again
              </button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <details style={{
                marginTop: "2rem",
                padding: "1rem",
                borderRadius: "var(--radius-md)",
                background: "var(--surface)",
                textAlign: "left",
                fontSize: "0.9rem",
                color: "var(--text-soft)"
              }}>
                <summary style={{
                  cursor: "pointer",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                  color: "var(--text)"
                }}>
                  Developer Details
                </summary>
                <pre style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word"
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
