import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
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
        <div className="surface" style={{ padding: "2rem" }}>
          <div className="eyebrow">Application flow</div>
          <h1 className="headline" style={{ fontSize: "2.4rem", margin: "0.4rem 0 0.8rem" }}>
            Submit a polished application for {job.title}
          </h1>
          <div className="jp-apply-steps">
            <span className="is-active">1. Review role</span>
            <span className="is-active">2. Add profile details</span>
            <span>3. Submit</span>
          </div>

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
              disabled={!consent || mutation.isPending}
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

        <aside className="surface jp-detail-sidebar">
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
