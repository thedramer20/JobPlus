import { useQuery } from "@tanstack/react-query";
import { CompanyCard } from "../components/shared/company-card";
import { JobCard } from "../components/shared/job-card";
import { SearchBar } from "../components/shared/search-bar";
import { StatCard } from "../components/shared/stat-card";
import { listCompanies } from "../services/companies-service";
import { listJobs } from "../services/jobs-service";

const topicItems = [
  "Tips for Managing Stressors with Mental Toughness",
  "How to Navigate Difficult Conversations for Personal Growth",
  "Top Emerging AI Use Cases and Their Capabilities",
  "How Leaders Foster Psychological Safety",
  "Tips for Curating a Professional Network",
  "Tips for Strategic Career Planning",
  "How to Find the Right Mentor for Your Career",
  "Tips for Optimizing Your Profile",
  "How to Set Priorities as a Leader"
];

const editorPicks = [
  { category: "Career", title: "Career Advancement Tips", likes: "818K likes" },
  { category: "Leadership", title: "Team Performance and Morale", likes: "489K likes" },
  { category: "Innovation", title: "AI Trends and Innovations", likes: "450K likes" },
  { category: "Training & Development", title: "Mindset Development Tips", likes: "435K likes" }
];

export function HomePage() {
  const { data: jobs = [] } = useQuery({ queryKey: ["jobs", "featured"], queryFn: () => listJobs() });
  const { data: companies = [] } = useQuery({ queryKey: ["companies", "featured"], queryFn: listCompanies });

  return (
    <>
      <section className="section">
        <div className="container hero">
          <div className="hero-panel stack">
            <span className="pill">For ambitious candidates and growth-stage employers</span>
            <div className="stack" style={{ gap: "0.8rem" }}>
              <div className="eyebrow" style={{ color: "rgba(255,255,255,0.75)" }}>
                Startup-grade hiring product
              </div>
              <h1 className="headline" style={{ fontSize: "clamp(2.8rem, 7vw, 4.8rem)", margin: 0 }}>
                Build better careers and better teams in one marketplace.
              </h1>
              <p style={{ color: "rgba(248,250,252,0.84)", fontSize: "1.08rem", maxWidth: "60ch" }}>
                JobPlus combines job discovery, company branding, candidate workflows, and employer hiring operations
                into a polished platform designed to scale beyond the classroom.
              </p>
            </div>
            <SearchBar />
            <div className="row" style={{ flexWrap: "wrap" }}>
              <a className="btn btn-primary" href="/register">
                Create candidate account
              </a>
              <a className="btn btn-secondary" href="/register">
                Start hiring
              </a>
            </div>
          </div>

          <div className="hero-aside stack">
            <div className="subtle-card stack">
              <div className="eyebrow">Marketplace snapshot</div>
              <div className="grid grid-2">
                <StatCard label="Open roles" value={String(jobs.length || 0)} meta="Visible opportunities on the platform" />
                <StatCard label="Employers" value={String(companies.length || 0)} meta="Companies building teams with JobPlus" />
              </div>
            </div>

            <div className="surface" style={{ padding: "1.3rem" }}>
              <strong>What users get</strong>
              <div className="stack" style={{ marginTop: "1rem" }}>
                <div className="card">Real-time application tracking</div>
                <div className="card">Company-first employer branding</div>
                <div className="card">Role-based dashboards for candidate, employer, and admin</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="grid grid-4">
            <StatCard label="Candidate-first" value="Faster" meta="Apply, track, and manage your search in one place" />
            <StatCard label="Employer tools" value="Cleaner" meta="Structured posting, applicants, and pipeline views" />
            <StatCard label="Admin ready" value="Safer" meta="Moderation, management, and data oversight support" />
            <StatCard label="Production path" value="Scalable" meta="React frontend with Spring Boot backend integration" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container stack" style={{ alignItems: "center", textAlign: "center", gap: "1.5rem" }}>
          <div className="stack" style={{ alignItems: "center", gap: "0.7rem", maxWidth: "48rem" }}>
            <div className="eyebrow">Top content</div>
            <h2 className="headline" style={{ fontSize: "2.6rem", margin: 0 }}>
              What topics do you want to explore?
            </h2>
          </div>

          <div
            className="row"
            style={{
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "0.85rem",
              maxWidth: "70rem"
            }}
          >
            {topicItems.map((topic) => (
              <button
                key={topic}
                type="button"
                className="surface"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  borderRadius: "999px",
                  padding: "0.85rem 1.15rem",
                  background: "rgba(255,255,255,0.92)",
                  cursor: "pointer"
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "999px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(37, 99, 235, 0.1)",
                    color: "var(--primary-dark)",
                    flexShrink: 0
                  }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                  </svg>
                </span>
                <span style={{ textAlign: "left", fontWeight: 600 }}>{topic}</span>
              </button>
            ))}
          </div>

          <div className="stack" style={{ width: "100%", gap: "0.9rem", alignItems: "center" }}>
            <div className="stack" style={{ gap: "0.3rem", alignItems: "center" }}>
              <div className="eyebrow">Editor&apos;s Picks</div>
              <h3 style={{ margin: 0, fontSize: "1.8rem" }}>Editor&apos;s Picks</h3>
              <p className="helper" style={{ margin: 0 }}>
                Handpicked ideas and insights from professionals
              </p>
            </div>

            <div className="grid grid-4" style={{ width: "100%" }}>
              {editorPicks.map((item) => (
                <article key={item.title} className="card stack" style={{ textAlign: "left", minHeight: "100%" }}>
                  <div className="space-between" style={{ alignItems: "flex-start" }}>
                    <span className="tag">{item.category}</span>
                    <span
                      aria-hidden="true"
                      style={{
                        width: "2.4rem",
                        height: "2.4rem",
                        borderRadius: "14px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(37, 99, 235, 0.08)",
                        color: "var(--primary-dark)",
                        flexShrink: 0
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 3l2.7 5.47 6.04.88-4.37 4.26 1.03 6.02L12 16.8l-5.4 2.83 1.03-6.02L3.26 9.35l6.04-.88L12 3z"
                        />
                      </svg>
                    </span>
                  </div>
                  <h4 style={{ margin: 0, fontSize: "1.15rem", lineHeight: 1.35 }}>{item.title}</h4>
                  <div className="helper" style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                      <path d="M12 21s-6.72-4.35-9.2-8.23C.64 9.4 2.1 5.25 6.08 4.32c2.07-.48 4.14.3 5.42 2.02 1.28-1.72 3.35-2.5 5.42-2.02 3.98.93 5.44 5.08 3.28 8.45C18.72 16.65 12 21 12 21z" />
                    </svg>
                    {item.likes}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container stack">
          <div className="space-between">
            <div>
              <div className="eyebrow">Featured jobs</div>
              <h2 className="headline" style={{ fontSize: "2.3rem", margin: "0.35rem 0 0" }}>
                The marketplace should feel alive from day one.
              </h2>
            </div>
            <a className="btn btn-secondary" href="/jobs">
              Browse all jobs
            </a>
          </div>
          <div className="grid grid-3">
            {jobs.slice(0, 3).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-3">
          <div className="surface" style={{ padding: "1.4rem" }}>
            <div className="eyebrow">How it works</div>
            <h3>For candidates</h3>
            <p className="helper">Build profile, save jobs, apply faster, and track your status with less confusion.</p>
          </div>
          <div className="surface" style={{ padding: "1.4rem" }}>
            <div className="eyebrow">How it works</div>
            <h3>For employers</h3>
            <p className="helper">Create company presence, publish roles, and move applicants through a cleaner workflow.</p>
          </div>
          <div className="surface" style={{ padding: "1.4rem" }}>
            <div className="eyebrow">How it works</div>
            <h3>For admins</h3>
            <p className="helper">Monitor marketplace health, manage entities, and support moderation with structured data views.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container stack">
          <div>
            <div className="eyebrow">Employer branding</div>
            <h2 className="headline" style={{ fontSize: "2.3rem", margin: "0.35rem 0 0.7rem" }}>
              Modern companies need more than a plain list of vacancies.
            </h2>
            <p className="helper" style={{ maxWidth: "70ch" }}>
              JobPlus gives employers a company presence, hiring dashboard, job performance overview, and applicant flow
              management that feels closer to real SaaS software than a class assignment.
            </p>
          </div>
          <div className="grid grid-2">
            {companies.slice(0, 2).map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container surface" style={{ padding: "2rem" }}>
          <div className="space-between">
            <div>
              <div className="eyebrow">Ready to get started?</div>
              <h2 className="headline" style={{ fontSize: "2.2rem", margin: "0.35rem 0 0" }}>
                Join JobPlus as a candidate or as a hiring team.
              </h2>
            </div>
            <div className="row">
              <a className="btn btn-primary" href="/register">
                Sign up
              </a>
              <a className="btn btn-secondary" href="/about">
                Learn more
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
