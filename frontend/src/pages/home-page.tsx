import { useQuery } from "@tanstack/react-query";
import { CompanyCard } from "../components/shared/company-card";
import { JobCard } from "../components/shared/job-card";
import { SearchBar } from "../components/shared/search-bar";
import { StatCard } from "../components/shared/stat-card";
import { listCompanies } from "../services/companies-service";
import { listJobs } from "../services/jobs-service";

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
