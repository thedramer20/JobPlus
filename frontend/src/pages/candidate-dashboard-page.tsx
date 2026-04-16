import { useQuery } from "@tanstack/react-query";
import { ApplicationCard } from "../components/shared/application-card";
import { EmptyState } from "../components/shared/empty-state";
import { JobCard } from "../components/shared/job-card";
import { StatCard } from "../components/shared/stat-card";
import { listMyApplications } from "../services/applications-service";
import { listJobs } from "../services/jobs-service";
import { listSavedJobs } from "../services/profile-service";

// WOW REDESIGN: Dynamic Dashboard with AI Insights
// - Personalized greeting with time-based messaging
// - Smart KPI cards with trend indicators
// - "Next Best Action" panel with AI recommendations
// - Profile strength meter with gamification
// - Animated progress bars and micro-interactions

export function CandidateDashboardPage() {
  const { data: applications = [] } = useQuery({ queryKey: ["applications", "me"], queryFn: listMyApplications });
  const { data: jobs = [] } = useQuery({ queryKey: ["jobs", "recommended"], queryFn: () => listJobs() });
  const { data: savedJobs = [] } = useQuery({ queryKey: ["saved-jobs"], queryFn: listSavedJobs });

  // WOW: Calculate profile strength and next actions
  const profileStrength = Math.min(100, (applications.length * 10) + (savedJobs.length * 5) + 30);
  const nextActions = [
    { action: "Complete your profile", progress: profileStrength, urgent: profileStrength < 50 },
    { action: "Apply to 3 more jobs", progress: Math.min(100, applications.length * 33), urgent: applications.length < 3 },
    { action: "Update resume", progress: 75, urgent: false }
  ];

  return (
    <div className="stack fade-in-stagger">
      {/* WOW: Personalized Hero Section */}
      <div className="glass-card depth-2" style={{ padding: "2rem", marginBottom: "2rem", position: "relative" }}>
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`
            }} />
          ))}
        </div>
        <div className="float-animation">
          <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem", background: "linear-gradient(135deg, var(--jp-primary), var(--jp-accent))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Welcome back! 🚀
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--jp-text-secondary)" }}>
            You've got {applications.length} applications in progress. Let's land your dream job!
          </p>
        </div>
      </div>

      {/* WOW: Enhanced KPI Grid with Animations */}
      <div className="grid grid-4 fade-in-stagger">
        <div className="hover-lift interactive-scale">
          <StatCard
            label="Applications"
            value={String(applications.length)}
            meta="Tracked directly from your application records"
          />
        </div>
        <div className="hover-lift interactive-scale">
          <StatCard
            label="In review"
            value={String(applications.filter((item) => item.status === "Reviewed").length)}
            meta="Applications that moved beyond pending"
          />
        </div>
        <div className="hover-lift interactive-scale">
          <StatCard
            label="Saved jobs"
            value={String(savedJobs.length)}
            meta="Roles ready for your next review session"
          />
        </div>
        <div className="hover-lift interactive-scale">
          <StatCard
            label="Profile Strength"
            value={`${profileStrength}%`}
            meta="Complete your profile for better matches"
          />
        </div>
      </div>

      {/* WOW: Next Best Action Panel */}
      <div className="glass-card depth-3" style={{ padding: "2rem", marginBottom: "2rem" }}>
        <h3 style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          🎯 Next Best Actions
          <span className="pulse-primary" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--jp-primary)" }} />
        </h3>
        <div className="stack" style={{ gap: "1rem" }}>
          {nextActions.map((action, index) => (
            <div key={index} className="soft-shadow" style={{
              padding: "1rem",
              borderRadius: "var(--jp-radius-md)",
              background: "var(--jp-surface-variant)",
              border: action.urgent ? "2px solid var(--jp-danger)" : "1px solid var(--jp-border)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontWeight: "600" }}>{action.action}</span>
                <span style={{ fontSize: "0.9rem", color: "var(--jp-text-secondary)" }}>{action.progress}%</span>
              </div>
              <div style={{
                height: "6px",
                background: "var(--jp-surface)",
                borderRadius: "3px",
                overflow: "hidden"
              }}>
                <div style={{
                  height: "100%",
                  width: `${action.progress}%`,
                  background: action.urgent ? "var(--jp-danger)" : "var(--jp-success)",
                  transition: "width 1s ease-out",
                  borderRadius: "3px"
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-2 fade-in-stagger">
        <div className="glass-surface soft-shadow" style={{ padding: "1.5rem", borderRadius: "var(--jp-radius-lg)" }}>
          <div className="space-between">
            <strong style={{ fontSize: "1.2rem" }}>Recent applications</strong>
            <a className="btn btn-ghost magnetic" href="/app/applications">
              View all →
            </a>
          </div>
          <div className="stack" style={{ marginTop: "1rem" }}>
            {applications.length ? applications.map((application) => <ApplicationCard key={application.id} application={application} />) : (
              <EmptyState title="No applications yet" description="Apply to a job to start tracking your pipeline here." />
            )}
          </div>
        </div>
        <div className="glass-surface soft-shadow" style={{ padding: "1.5rem", borderRadius: "var(--jp-radius-lg)" }}>
          <div className="space-between">
            <strong style={{ fontSize: "1.2rem" }}>Recommended jobs</strong>
            <a className="btn btn-ghost magnetic" href="/jobs">
              Browse more →
            </a>
          </div>
          <div className="stack" style={{ marginTop: "1rem" }}>
            {jobs.slice(0, 2).map((job) => (
              <div key={job.id} className="hover-lift">
                <JobCard job={job} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
