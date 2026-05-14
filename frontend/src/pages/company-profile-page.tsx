import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { ProfilePageSkeleton } from "../components/shared/content-skeletons";
import { EmptyState } from "../components/shared/empty-state";
import { JobCard } from "../components/shared/job-card";
import { getCompany } from "../services/companies-service";
import { listJobs } from "../services/jobs-service";

export function CompanyProfilePage() {
  const params = useParams<{ companyId?: string }>();
  const companyId = Number(params.companyId);

  const { data: company, isLoading, isError } = useQuery({
    queryKey: ["companies", companyId],
    queryFn: () => getCompany(companyId),
    enabled: Number.isFinite(companyId),
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ["jobs", "company-profile"],
    queryFn: () => listJobs(),
  });

  if (isLoading) {
    return (
      <section className="section">
        <div className="container">
          <ProfilePageSkeleton />
        </div>
      </section>
    );
  }

  if (isError || !company) {
    return (
      <section className="section">
        <div className="container">
          <EmptyState title="Company not found" description="The requested company could not be loaded." />
        </div>
      </section>
    );
  }

  const openJobs = jobs.filter((job: any) => job.companyId === company.id && job.status === "Open");

  return (
    <div className="jp-company-profile-page">
      <div className="container detail-layout">
        <div className="stack">
          <div className="surface jp-company-hero">
            <div className="jp-company-banner" />
            <div className="jp-company-hero-content">
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={company.name} className="jp-company-logo" />
              ) : (
                <span className="jp-company-logo-fallback">{company.name.slice(0, 2).toUpperCase()}</span>
              )}
              <div className="stack" style={{ gap: "0.35rem" }}>
                <div className="eyebrow">{company.industry}</div>
                <h1 className="headline" style={{ fontSize: "2.6rem", margin: 0 }}>{company.name}</h1>
                <div className="helper">{company.location} • {company.size} • {(company as any).founded ? `Founded ${(company as any).founded}` : ""}</div>
              </div>
            </div>
            <p className="helper" style={{ marginTop: "1rem", maxWidth: "75ch", lineHeight: "1.7" }}>
              {company.description}
            </p>
          </div>

          <div className="grid grid-3">
            <div className="surface jp-company-metric-card"><span className="helper">Open jobs</span><strong>{openJobs.length}</strong></div>
            <div className="surface jp-company-metric-card"><span className="helper">Total jobs</span><strong>{jobs.filter((job: any) => job.companyId === company.id).length}</strong></div>
            <div className="surface jp-company-metric-card"><span className="helper">Status</span><strong>{(company as any).status ?? "Active"}</strong></div>
          </div>

          <div>
            <div className="eyebrow">Open jobs</div>
            <h2 className="headline" style={{ fontSize: "2rem", margin: "0.35rem 0 1rem" }}>
              Hiring opportunities at {company.name}
            </h2>
            <div className="stack">
              {jobs.filter((job: any) => job.companyId === company.id).slice(0, 5).map((job: any) => (
                <JobCard key={job.id} job={job} />
              ))}
              {!jobs.filter((job: any) => job.companyId === company.id).length ? (
                <EmptyState title="No open jobs yet" description="This company has not published active jobs yet." compact />
              ) : null}
            </div>
          </div>
        </div>

        <aside className="surface jp-detail-sidebar">
          <div className="stack">
            <strong>Company Summary</strong>
            <div className="space-between"><span className="helper">Industry</span><strong>{company.industry}</strong></div>
            <div className="space-between"><span className="helper">Location</span><strong>{company.location}</strong></div>
            <div className="space-between"><span className="helper">Size</span><strong>{company.size}</strong></div>
            {(company as any).founded && <div className="space-between"><span className="helper">Founded</span><strong>{(company as any).founded}</strong></div>}
            {(company as any).employeeCount && <div className="space-between"><span className="helper">Employees</span><strong>{(company as any).employeeCount}</strong></div>}
            <div className="space-between"><span className="helper">Website</span><strong>{company.website || "-"}</strong></div>

            {(company as any).benefits && (company as any).benefits.length > 0 && (
              <div>
                <strong style={{ display: "block", marginBottom: "0.5rem" }}>Benefits</strong>
                <ul className="jp-detail-list">
                  {(company as any).benefits.map((benefit: any, idx: number) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}

            {(company as any).culture && (
              <div>
                <strong style={{ display: "block", marginBottom: "0.5rem" }}>Our Culture</strong>
                <p className="helper" style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>{(company as any).culture}</p>
              </div>
            )}

            <a className="btn btn-primary" href={company.website || "#"} target="_blank" rel="noreferrer">Visit Website</a>
            <a className="btn btn-secondary" href="/jobs">Browse More Jobs</a>
          </div>
        </aside>
      </div>
    </div>
  );
}

