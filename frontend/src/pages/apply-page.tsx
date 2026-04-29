import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { JobDetailsSkeleton } from "../components/shared/content-skeletons";
import { EmptyState } from "../components/shared/empty-state";
import { applyToJob } from "../services/applications-service";
import { getJob } from "../services/jobs-service";
import { listResumes } from "../services/profile-service";

export function ApplyPage() {
  const navigate = useNavigate();
  const params = useParams();
  const jobId = Number(params.jobId);
  const { data: job, isLoading: jobLoading, isError: jobError } = useQuery({ queryKey: ["jobs", jobId], queryFn: () => getJob(jobId), enabled: Number.isFinite(jobId) });
  const { data: resumes = [], isLoading: resumesLoading } = useQuery({ queryKey: ["resumes"], queryFn: listResumes });
  const [resumeId, setResumeId] = useState<string>("");
  const [coverLetter, setCoverLetter] = useState("");
  const [note, setNote] = useState("");
  const [consent, setConsent] = useState(false);
  const mutation = useMutation({
    mutationFn: applyToJob,
    onSuccess: () => navigate("/app/applications")
  });
  const qualityGate = useMemo(() => evaluateApplicationQuality({ note, coverLetter, resumeId, jobTitle: job?.title ?? "" }), [note, coverLetter, resumeId, job?.title]);
  const readinessChecklist = useMemo(() => buildReadinessChecklist(coverLetter, job?.requirements ?? []), [coverLetter, job?.requirements]);

  if (jobLoading) {
    return (
      <section className="section">
        <div className="container">
          <JobDetailsSkeleton />
        </div>
      </section>
    );
  }

  if (jobError || !job) {
    return (
      <section className="section">
        <div className="container">
          <EmptyState title="Job not found" description="The selected job could not be loaded for application." />
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container detail-layout">
        <div className="surface jp-reveal-up" style={{ padding: "2rem" }}>
          <div className="eyebrow">Application flow</div>
          <h1 className="headline" style={{ fontSize: "2.4rem", margin: "0.4rem 0 0.8rem" }}>
            Submit a polished application for {job.title}
          </h1>
          <div className="jp-apply-steps">
            <span className="is-active">1. Review role</span>
            <span className="is-active">2. Add profile details</span>
            <span>3. Submit</span>
          </div>

          <section className="surface jp-application-lock jp-reveal">
            <div className="space-between" style={{ alignItems: "center" }}>
              <strong>Application Quality Lock</strong>
              <span className={`tag ${qualityGate.ready ? "" : "status-warning"}`}>
                {qualityGate.ready ? "Ready to submit" : "Improve before submit"}
              </span>
            </div>
            <p className="helper" style={{ margin: "0.45rem 0 0.65rem" }}>
              {qualityGate.message}
            </p>
            {!qualityGate.ready ? (
              <ul className="jp-quality-list">
                {qualityGate.fixes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            <div className="jp-interview-sandbox">
              <strong>Interview Readiness Sandbox</strong>
              <div className="helper">Likely recruiter focus: {readinessChecklist.focus}</div>
              <div className="helper">Confidence: {readinessChecklist.confidence}%</div>
            </div>
          </section>

          <div className="form-grid" style={{ marginTop: "1rem" }}>
            <div className="field">
              <label>Selected resume</label>
              <select className="select" value={resumeId} onChange={(event) => setResumeId(event.target.value)}>
                <option value="">Use profile only</option>
                {resumes.map((resume) => (
                  <option key={resume.id} value={resume.id}>
                    {resume.fileName}
                  </option>
                ))}
              </select>
              <span className="helper">{resumesLoading ? "Loading resumes..." : "Resume upload is optional."}</span>
            </div>
            <div className="field">
              <label>Application note</label>
              <input
                className="input"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Optional headline to personalize your application"
              />
            </div>
          </div>

          <div className="field" style={{ marginTop: "1rem" }}>
            <label>Cover letter</label>
            <textarea
              className="textarea"
              placeholder="Explain why you are a strong match for this role."
              value={coverLetter}
              onChange={(event) => setCoverLetter(event.target.value)}
            />
            <div className="helper">{coverLetter.length} / 1200 characters</div>
          </div>

          <label className="helper" style={{ display: "inline-flex", gap: "0.5rem", alignItems: "center", marginTop: "0.9rem" }}>
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
            I confirm this information is accurate and ready for recruiter review.
          </label>

          <div className="space-between" style={{ marginTop: "1.2rem" }}>
            <div className="helper">Your application will be tracked in dashboard with status updates.</div>
            <button
              className="btn btn-primary"
              disabled={!consent || mutation.isPending || !qualityGate.ready}
              onClick={() =>
                mutation.mutate({
                  jobId,
                  resumeId: resumeId ? Number(resumeId) : null,
                  coverLetter: [note.trim(), coverLetter.trim()].filter(Boolean).join("\n\n")
                })
              }
            >
              {mutation.isPending ? "Submitting..." : "Submit application"}
            </button>
          </div>
        </div>

        <aside className="surface jp-detail-sidebar jp-reveal-up">
          <div className="stack">
            <strong>Role Summary</strong>
            <div className="space-between"><span className="helper">Company</span><strong>{job.company}</strong></div>
            <div className="space-between"><span className="helper">Location</span><strong>{job.location}</strong></div>
            <div className="space-between"><span className="helper">Job Type</span><strong>{job.type}</strong></div>
            <div className="space-between"><span className="helper">Work Mode</span><strong>{job.workMode}</strong></div>
            <div className="space-between"><span className="helper">Salary</span><strong>{job.salary}</strong></div>
            <div className="space-between"><span className="helper">Deadline</span><strong>{job.deadline ?? "Open until filled"}</strong></div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function evaluateApplicationQuality(input: { note: string; coverLetter: string; resumeId: string; jobTitle: string }) {
  const fixes: string[] = [];
  const cover = input.coverLetter.trim();
  const note = input.note.trim();

  if (!note) fixes.push("Add a focused application note with your strongest role-specific value.");
  if (cover.length < 180) fixes.push("Expand your cover letter to show concrete impact, not only motivation.");
  if (!input.resumeId) fixes.push("Attach a resume for higher recruiter confidence.");
  if (input.jobTitle && !cover.toLowerCase().includes(input.jobTitle.split(" ")[0].toLowerCase())) {
    fixes.push("Reference the target role directly in your cover letter for stronger relevance.");
  }

  return {
    ready: fixes.length === 0,
    fixes,
    message:
      fixes.length === 0
        ? "Your application passes quality checks. This should present as recruiter-ready."
        : `This application has ${fixes.length} quality gaps.`
  };
}

function buildReadinessChecklist(coverLetter: string, requirements: string[]) {
  const cover = coverLetter.toLowerCase();
  const hits = requirements.filter((req) => cover.includes(req.toLowerCase().split(" ")[0])).length;
  const confidence = Math.min(96, Math.round((hits / Math.max(1, requirements.length)) * 100 + 22));
  return {
    focus: requirements.slice(0, 2).join(" + ") || "Role impact + communication clarity",
    confidence
  };
}
