import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { authStore } from "../store/auth-store";
import { motion } from "framer-motion";

// Types for our network data
interface Recruiter {
  id: number;
  name: string;
  role: string;
  company: string;
  connectionLevel: "1st" | "2nd" | "3rd";
  lastActive: string;
  avatar?: string;
  mutualConnections?: number;
  hiringStatus: "active" | "inactive";
}

interface Connection {
  id: number;
  name: string;
  role: string;
  company: string;
  connectionStrength: "strong" | "medium" | "weak";
  avatar?: string;
  mutualConnections: number;
}

// Realistic demo data for recruiters
const recruitersData: Recruiter[] = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Senior Technical Recruiter",
    company: "TechFlow Inc.",
    connectionLevel: "2nd",
    lastActive: "2 hours ago",
    mutualConnections: 3,
    hiringStatus: "active"
  },
  {
    id: 2,
    name: "James Chen",
    role: "Engineering Manager",
    company: "DataSphere",
    connectionLevel: "1st",
    lastActive: "5 hours ago",
    mutualConnections: 1,
    hiringStatus: "active"
  },
  {
    id: 3,
    name: "Maria Rodriguez",
    role: "Talent Acquisition Lead",
    company: "CloudScale Solutions",
    connectionLevel: "2nd",
    lastActive: "1 day ago",
    mutualConnections: 5,
    hiringStatus: "active"
  },
  {
    id: 4,
    name: "David Kim",
    role: "Senior Recruiter",
    company: "InnovateTech",
    connectionLevel: "3rd",
    lastActive: "3 days ago",
    mutualConnections: 2,
    hiringStatus: "inactive"
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
    mutualConnections: 8
  },
  {
    id: 2,
    name: "Marcello Ruiz",
    role: "Growth Recruiter",
    company: "NovaScale",
    connectionStrength: "medium",
    mutualConnections: 4
  },
  {
    id: 3,
    name: "Jia Chen",
    role: "Hiring Partner",
    company: "AstraOps",
    connectionStrength: "strong",
    mutualConnections: 6
  },
  {
    id: 4,
    name: "Alex Thompson",
    role: "Engineering Lead",
    company: "TechFlow Inc.",
    connectionStrength: "weak",
    mutualConnections: 2
  }
];

// Filter options for recruiters
const recruiterFilterOptions = [
  { value: "all", label: "All Recruiters" },
  { value: "active", label: "Recently Active" },
  { value: "hiring", label: "Currently Hiring" },
  { value: "1st", label: "1st Degree" },
  { value: "2nd", label: "2nd Degree" }
];

export function NetworkPage() {
  const { t } = useTranslation();
  const { user } = authStore();

  // State for filtering recruiters
  const [recruiterFilter, setRecruiterFilter] = useState("all");
  const [selectedRecruiter, setSelectedRecruiter] = useState<Recruiter | null>(recruitersData[0]);

  // State for warm intro script
  const [introScript, setIntroScript] = useState("");
  const [isEditingScript, setIsEditingScript] = useState(false);

  // State for reminders
  const [reminders, setReminders] = useState<Set<number>>(new Set());

  // Filter recruiters based on selected filter
  const filteredRecruiters = useMemo(() => {
    if (recruiterFilter === "all") return recruitersData;
    if (recruiterFilter === "active") return recruitersData.filter(r => r.hiringStatus === "active");
    if (recruiterFilter === "hiring") return recruitersData.filter(r => r.hiringStatus === "active");
    return recruitersData.filter(r => r.connectionLevel === recruiterFilter);
  }, [recruiterFilter]);

  // Generate warm intro script when a recruiter is selected
  useMemo(() => {
    if (selectedRecruiter) {
      setIntroScript(buildWarmIntroScript(selectedRecruiter.name, selectedRecruiter.role, selectedRecruiter.company));
    }
  }, [selectedRecruiter]);

  // Handle reminder toggle
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

  // Handle script regeneration
  const regenerateScript = () => {
    if (selectedRecruiter) {
      const variations = [
        buildWarmIntroScript(selectedRecruiter.name, selectedRecruiter.role, selectedRecruiter.company),
        `Hi ${selectedRecruiter.name}, I noticed you're hiring for ${selectedRecruiter.role} roles at ${selectedRecruiter.company}. Would you be open to a brief conversation about potential opportunities?`,
        `Hello ${selectedRecruiter.name}, I've been following ${selectedRecruiter.company}'s work and would love to connect regarding ${selectedRecruiter.role} opportunities.`
      ];
      const randomVariation = variations[Math.floor(Math.random() * variations.length)];
      setIntroScript(randomVariation);
    }
  };

  // Handle script editing
  const handleScriptEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIntroScript(e.target.value);
  };

  return (
    <section className="section jp-network-root">
      <div className="container stack" style={{ gap: "1.5rem" }}>
        {/* Header Section */}
        <div className="jp-network-header surface">
          <div>
            <span className="pill">Network Intelligence</span>
            <h1>Your Network Hub</h1>
            <p className="helper">Connect with recruiters, build relationships, and grow your professional network.</p>
          </div>
          <NavLink className="btn btn-primary" to={user ? "/app/messages" : "/login"}>
            Continue outreach
          </NavLink>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-3 jp-network-grid">
          {/* Active Recruiter Bridges - Primary Section */}
          <article className="surface jp-network-card jp-recruiter-bridges-card" style={{ gridColumn: "span 2" }}>
            <div className="space-between">
              <strong>Active Recruiter Bridges</strong>
              <span className="pill">{filteredRecruiters.length} Active</span>
            </div>

            {/* Recruiter Filter */}
            <div className="row" style={{ gap: "0.5rem", flexWrap: "wrap", marginTop: "1rem" }}>
              {recruiterFilterOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`btn ${recruiterFilter === option.value ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => setRecruiterFilter(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Recruiter List */}
            <div className="stack" style={{ gap: "0.9rem", marginTop: "1rem" }}>
              {filteredRecruiters.map((recruiter) => (
                <div 
                  key={recruiter.id} 
                  className={`jp-recruiter-item ${selectedRecruiter?.id === recruiter.id ? "selected" : ""}`}
                  onClick={() => setSelectedRecruiter(recruiter)}
                >
                  <div className="space-between">
                    <div className="row" style={{ gap: "0.75rem", alignItems: "center" }}>
                      <div className="jp-avatar-placeholder">
                        {recruiter.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <strong>{recruiter.name}</strong>
                        <div className="helper">{recruiter.role} • {recruiter.company}</div>
                      </div>
                    </div>
                    <div className="row" style={{ gap: "0.5rem", alignItems: "center" }}>
                      <span className={`tag connection-${recruiter.connectionLevel}`}>{recruiter.connectionLevel}</span>
                      {recruiter.hiringStatus === "active" && (
                        <span className="tag" style={{ background: "rgba(16, 185, 168, 0.15)", color: "var(--success)" }}>
                          Hiring
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="row" style={{ gap: "0.45rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
                    <button 
                      className="btn btn-primary" 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRecruiter(recruiter);
                      }}
                    >
                      Create warm intro
                    </button>
                    <button 
                      className="btn btn-secondary" 
                      type="button"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Message
                    </button>
                    <button 
                      className="btn btn-ghost" 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleReminder(recruiter.id);
                      }}
                    >
                      {reminders.has(recruiter.id) ? "Reminder set" : "Remind in 3 days"}
                    </button>
                  </div>

                  <div className="helper" style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
                    {recruiter.mutualConnections && `${recruiter.mutualConnections} mutual connections • `}
                    Last active: {recruiter.lastActive}
                  </div>
                </div>
              ))}
            </div>
          </article>

          {/* Suggested Connections - Secondary Section */}
          <article className="surface jp-network-card jp-suggested-connections-card">
            <div className="space-between">
              <strong>Suggested Connections</strong>
              <span className="pill">{suggestedConnectionsData.length} New</span>
            </div>

            <div className="stack" style={{ gap: "0.9rem", marginTop: "1rem" }}>
              {suggestedConnectionsData.map((connection) => (
                <div key={connection.id} className="jp-connection-item">
                  <div className="row" style={{ gap: "0.75rem", alignItems: "center", marginBottom: "0.5rem" }}>
                    <div className="jp-avatar-placeholder">
                      {connection.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <strong>{connection.name}</strong>
                      <div className="helper">{connection.role} • {connection.company}</div>
                    </div>
                  </div>

                  <div className="row" style={{ gap: "0.45rem", flexWrap: "wrap" }}>
                    <button className="btn btn-secondary" type="button">
                      Connect
                    </button>
                    <button className="btn btn-ghost" type="button">
                      View profile
                    </button>
                  </div>

                  <div className="helper" style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
                    {connection.mutualConnections} mutual connections • {connection.connectionStrength} connection
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        {/* Warm Intro Script Section */}
        {selectedRecruiter && (
          <article className="surface jp-network-card jp-intro-script-card">
            <div className="space-between">
              <div>
                <strong>Warm Intro Script</strong>
                <div className="helper" style={{ marginTop: "0.25rem" }}>
                  Personalized message for {selectedRecruiter.name} at {selectedRecruiter.company}
                </div>
              </div>
              <div className="row" style={{ gap: "0.5rem" }}>
                <button 
                  className="btn btn-ghost" 
                  type="button"
                  onClick={() => setIsEditingScript(!isEditingScript)}
                >
                  {isEditingScript ? "Done" : "Edit"}
                </button>
                <button 
                  className="btn btn-ghost" 
                  type="button"
                  onClick={regenerateScript}
                >
                  Regenerate
                </button>
                <button 
                  className="btn btn-secondary" 
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(introScript);
                  }}
                >
                  Copy
                </button>
              </div>
            </div>

            {isEditingScript ? (
              <textarea
                value={introScript}
                onChange={handleScriptEdit}
                style={{
                  width: "100%",
                  minHeight: "120px",
                  marginTop: "1rem",
                  padding: "1rem",
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  background: "var(--surface-subtle)",
                  color: "var(--text)",
                  fontSize: "0.95rem",
                  lineHeight: "1.6"
                }}
              />
            ) : (
              <div 
                className="jp-intro-script-content"
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  background: "var(--surface-subtle)",
                  borderRadius: "12px",
                  lineHeight: "1.6"
                }}
              >
                {introScript}
              </div>
            )}
          </article>
        )}
      </div>
    </section>
  );
}

function buildWarmIntroScript(name: string, role: string, company: string) {
  return `Hi ${name}, I’m exploring opportunities aligned with ${role} teams at ${company}. If relevant, I’d value a brief introduction to the hiring manager and can share a concise impact summary first.`;
}
