
import { useMemo, useState } from "react";
import { authStore } from "../store/auth-store";
import "../styles/network-page-premium.css";

// Types for our network data
interface Recruiter {
  id: number;
  name: string;
  role: string;
  company: string;
  priority: "high" | "medium" | "low";
  lastActive: string;
  avatar?: string;
  mutualConnections: number;
  hiringStatus: "active" | "inactive";
  pipeline: "priority" | "warm" | "cold" | "follow-up";
  whyMatters: string;
  activityLevel: "very-active" | "active" | "moderate" | "low";
}

interface Connection {
  id: number;
  name: string;
  role: string;
  company: string;
  connectionStrength: "strong" | "medium" | "weak";
  avatar?: string;
  mutualConnections: number;
  reason: string;
  skillOverlap?: string[];
  sharedCompanies?: string[];
  hiringRelevance?: "high" | "medium" | "low";
}

// Realistic demo data for recruiters with pipeline status
const recruitersData: Recruiter[] = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Senior Technical Recruiter",
    company: "TechFlow Inc.",
    priority: "high",
    lastActive: "2 hours ago",
    mutualConnections: 3,
    hiringStatus: "active",
    pipeline: "priority",
    whyMatters: "Hiring for senior roles matching your experience",
    activityLevel: "very-active"
  },
  {
    id: 2,
    name: "James Chen",
    role: "Engineering Manager",
    company: "DataSphere",
    priority: "high",
    lastActive: "5 hours ago",
    mutualConnections: 1,
    hiringStatus: "active",
    pipeline: "warm",
    whyMatters: "Recent conversation about engineering leadership roles",
    activityLevel: "active"
  },
  {
    id: 3,
    name: "Maria Rodriguez",
    role: "Talent Acquisition Lead",
    company: "CloudScale Solutions",
    priority: "medium",
    lastActive: "1 day ago",
    mutualConnections: 5,
    hiringStatus: "active",
    pipeline: "warm",
    whyMatters: "Strong network through mutual connections",
    activityLevel: "active"
  },
  {
    id: 4,
    name: "David Kim",
    role: "Senior Recruiter",
    company: "InnovateTech",
    priority: "low",
    lastActive: "3 days ago",
    mutualConnections: 2,
    hiringStatus: "inactive",
    pipeline: "cold",
    whyMatters: "Potential future opportunities in AI/ML",
    activityLevel: "moderate"
  },
  {
    id: 5,
    name: "Emma Thompson",
    role: "Talent Partner",
    company: "QuantumLeap",
    priority: "medium",
    lastActive: "4 hours ago",
    mutualConnections: 4,
    hiringStatus: "active",
    pipeline: "follow-up",
    whyMatters: "Follow up on last week's conversation",
    activityLevel: "active"
  }
];

// Realistic demo data for suggested connections
const suggestedConnectionsData: Connection[] = [
  {
    id: 1,
    name: "Lena Akhtar",
    role: "Director of Talent",
    company: "SageQuantum",
    connectionStrength: "strong",
    mutualConnections: 8,
    reason: "Shared network + similar industry",
    skillOverlap: ["Talent Acquisition", "Leadership"],
    sharedCompanies: ["TechCorp"],
    hiringRelevance: "high"
  },
  {
    id: 2,
    name: "Marcello Ruiz",
    role: "Growth Recruiter",
    company: "NovaScale",
    connectionStrength: "medium",
    mutualConnections: 4,
    reason: "Similar career path background",
    skillOverlap: ["Growth Strategy", "Recruiting"],
    hiringRelevance: "medium"
  },
  {
    id: 3,
    name: "Jia Chen",
    role: "Hiring Partner",
    company: "AstraOps",
    connectionStrength: "strong",
    mutualConnections: 6,
    reason: "Former colleague connections",
    sharedCompanies: ["CloudScale"],
    hiringRelevance: "high"
  },
  {
    id: 4,
    name: "Alex Thompson",
    role: "Engineering Lead",
    company: "TechFlow Inc.",
    connectionStrength: "weak",
    mutualConnections: 2,
    reason: "Same company network",
    hiringRelevance: "medium"
  }
];

export function NetworkPage() {
  const { user } = authStore();

  const [selectedRecruiter, setSelectedRecruiter] = useState<Recruiter | null>(recruitersData[0]);
  const [activePipeline, setActivePipeline] = useState<"priority" | "warm" | "cold" | "follow-up">("priority");
  const [reminders, setReminders] = useState<Set<number>>(new Set());

  // Group recruiters by pipeline status
  const pipelineGroups = useMemo(() => {
    return {
      priority: recruitersData.filter(r => r.pipeline === "priority"),
      warm: recruitersData.filter(r => r.pipeline === "warm"),
      cold: recruitersData.filter(r => r.pipeline === "cold"),
      followUp: recruitersData.filter(r => r.pipeline === "follow-up")
    };
  }, []);

  // Calculate network insights
  const insights = useMemo(() => {
    const highOpportunity = recruitersData.filter(r => r.priority === "high" && r.hiringStatus === "active").length;
    const warmConnections = recruitersData.filter(r => r.pipeline === "warm").length;
    const activeRecruiters = recruitersData.filter(r => r.hiringStatus === "active").length;
    const totalConnections = recruitersData.length + suggestedConnectionsData.length;
    return {
      highOpportunity,
      warmConnections,
      activeRecruiters,
      totalConnections,
      bestNextAction: `Message ${recruitersData.find(r => r.priority === "high")?.name || "Sarah Mitchell"} today`,
      warmIntroAvailable: recruitersData.filter(r => r.pipeline === "warm" && r.mutualConnections > 0).length > 0
    };
  }, []);

  const toggleReminder = (recruiterId: number) => {
    setReminders(prev => {
      const newReminders = new Set(prev);
      if (newReminders.has(recruiterId)) {
        newReminders.delete(recruiterId);
      } else {
        newReminders.add(recruiterId);
      }
      return newReminders;
    });
  };

  const getActivityLevelColor = (level: string) => {
    switch (level) {
      case "very-active": return "#10b981";
      case "active": return "#4F46E5";
      case "moderate": return "#f59e0b";
      case "low": return "#6b7280";
      default: return "#6b7280";
    }
  };

  return (
    <div className="jp-network-root">
      {/* Header */}
      <header className="jp-network-header">
        <div className="jp-network-container">
          <div className="jp-network-title">
            <h1>Network Intelligence</h1>
            <p>Build strategic relationships with recruiters and grow your professional network</p>
          </div>

          {/* Network Insight Bar */}
          <div className="jp-network-insights">
            <div className="jp-insight-item">
              <span className="jp-insight-value">{insights.highOpportunity}</span>
              <span className="jp-insight-label">Strong Opportunities</span>
            </div>
            <div className="jp-insight-divider"></div>
            <div className="jp-insight-item">
              <span className="jp-insight-value">{insights.warmConnections}</span>
              <span className="jp-insight-label">Warm Connections</span>
            </div>
            <div className="jp-insight-divider"></div>
            <div className="jp-insight-item">
              <span className="jp-insight-value">{insights.activeRecruiters}</span>
              <span className="jp-insight-label">Active Recruiters</span>
            </div>
            <div className="jp-insight-divider"></div>
            <div className="jp-insight-item">
              <span className="jp-insight-value">{insights.totalConnections}</span>
              <span className="jp-insight-label">Total Network</span>
            </div>
          </div>
        </div>
      </header>

      {/* Decision Guidance */}
      <div className="jp-network-container">
        <div className="jp-decision-guidance">
          <div className="jp-guidance-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
          </div>
          <div className="jp-guidance-content">
            <span className="jp-guidance-label">Best next action</span>
            <span className="jp-guidance-text">{insights.bestNextAction}</span>
          </div>
          {insights.warmIntroAvailable && (
            <div className="jp-warm-intro-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span>Strong warm intro available</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="jp-network-container jp-network-main">
        {/* Left - Recruiter Pipeline */}
        <main className="jp-recruiter-pipeline">
          <div className="jp-pipeline-tabs">
            {[
              { key: "priority", label: "Priority", count: pipelineGroups.priority.length },
              { key: "warm", label: "Warm", count: pipelineGroups.warm.length },
              { key: "cold", label: "Cold", count: pipelineGroups.cold.length },
              { key: "follow-up", label: "Follow-up", count: pipelineGroups.followUp.length }
            ].map(tab => (
              <button
                key={tab.key}
                className={`jp-pipeline-tab ${activePipeline === tab.key ? "is-active" : ""}`}
                onClick={() => setActivePipeline(tab.key as any)}
              >
                {tab.label}
                <span className="jp-tab-count">{tab.count}</span>
              </button>
            ))}
          </div>

          <div className="jp-recruiter-list">
            {pipelineGroups[activePipeline].map((recruiter) => (
              <div
                key={recruiter.id}
                className={`jp-recruiter-card ${selectedRecruiter?.id === recruiter.id ? "is-selected" : ""} ${recruiter.priority === "high" ? "is-high-priority" : ""}`}
                onClick={() => setSelectedRecruiter(recruiter)}
              >
                {/* Card Header */}
                <div className="jp-recruiter-card-header">
                  <div className="jp-recruiter-info">
                    <div className="jp-avatar jp-avatar-small">
                      {recruiter.avatar ? (
                        <img src={recruiter.avatar} alt={recruiter.name} />
                      ) : (
                        <span>{recruiter.name.split(" ").map(n => n[0]).join("")}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="jp-recruiter-name">{recruiter.name}</h3>
                      <p className="jp-recruiter-role">{recruiter.role} • {recruiter.company}</p>
                    </div>
                  </div>
                  <div className="jp-recruiter-badges">
                    <div className={`jp-priority-badge jp-priority-${recruiter.priority}`}>
                      {recruiter.priority}
                    </div>
                    <div 
                      className="jp-activity-indicator"
                      style={{ backgroundColor: getActivityLevelColor(recruiter.activityLevel) }}
                    />
                  </div>
                </div>

                {/* Why This Matters */}
                <div className="jp-why-matters">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span>{recruiter.whyMatters}</span>
                </div>

                {/* Meta Info */}
                <div className="jp-recruiter-meta">
                  <div className="jp-meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <span>{recruiter.mutualConnections} mutual</span>
                  </div>
                  <div className="jp-meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>{recruiter.lastActive}</span>
                  </div>
                  {recruiter.hiringStatus === "active" && (
                    <div className="jp-meta-item jp-meta-active">
                      <span>Active</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="jp-recruiter-actions">
                  <button className="jp-btn jp-btn-primary">
                    Create warm intro
                  </button>
                  <button className="jp-btn jp-btn-secondary">
                    Message
                  </button>
                  <button
                    className={`jp-btn jp-btn-remind ${reminders.has(recruiter.id) ? "is-active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleReminder(recruiter.id);
                    }}
                  >
                    {reminders.has(recruiter.id) ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Right - Suggested Connections */}
        <aside className="jp-suggested-connections">
          <div className="jp-suggested-header">
            <h2>Suggested Connections</h2>
            <span className="jp-suggested-count">{suggestedConnectionsData.length} New</span>
          </div>

          <div className="jp-suggested-list">
            {suggestedConnectionsData.map((connection) => (
              <div key={connection.id} className="jp-connection-card">
                <div className="jp-connection-header">
                  <div className="jp-avatar jp-avatar-small">
                    {connection.avatar ? (
                      <img src={connection.avatar} alt={connection.name} />
                    ) : (
                      <span>{connection.name.split(" ").map(n => n[0]).join("")}</span>
                    )}
                  </div>
                  <div className="jp-connection-info">
                    <h3 className="jp-connection-name">{connection.name}</h3>
                    <p className="jp-connection-role">{connection.role} • {connection.company}</p>
                  </div>
                  <div className={`jp-strength-badge jp-strength-${connection.connectionStrength}`}>
                    {connection.connectionStrength}
                  </div>
                </div>

                <div className="jp-connection-reason">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <span>{connection.reason}</span>
                </div>

                {connection.skillOverlap && connection.skillOverlap.length > 0 && (
                  <div className="jp-connection-skills">
                    {connection.skillOverlap.slice(0, 2).map((skill, index) => (
                      <span key={index} className="jp-skill-tag">{skill}</span>
                    ))}
                  </div>
                )}

                {connection.sharedCompanies && connection.sharedCompanies.length > 0 && (
                  <div className="jp-connection-companies">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 21h18"/>
                      <path d="M5 21V7l8-4 8 4V21"/>
                      <path d="M19 21V11l-6-4"/>
                    </svg>
                    <span>{connection.sharedCompanies.join(", ")}</span>
                  </div>
                )}

                <div className="jp-connection-meta">
                  <span>{connection.mutualConnections} mutual connections</span>
                  {connection.hiringRelevance && (
                    <span className={`jp-relevance-badge jp-relevance-${connection.hiringRelevance}`}>
                      {connection.hiringRelevance} relevance
                    </span>
                  )}
                </div>

                <div className="jp-connection-actions">
                  <button className="jp-btn jp-btn-primary">
                    Connect
                  </button>
                  <button className="jp-btn jp-btn-secondary">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
}
