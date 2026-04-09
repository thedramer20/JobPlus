import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { applyToJob } from "../services/applications-service";
import { getJob } from "../services/jobs-service";
import { listResumes } from "../services/profile-service";

export function ApplyPage() {
  const navigate = useNavigate();
  const params = useParams();
  const jobId = Number(params.jobId);
  const { data: job } = useQuery({ queryKey: ["jobs", jobId], queryFn: () => getJob(jobId), enabled: Number.isFinite(jobId) });
  const { data: resumes = [] } = useQuery({ queryKey: ["resumes"], queryFn: listResumes });
  const [resumeId, setResumeId] = useState<string>("");
  const [coverLetter, setCoverLetter] = useState("");
  const mutation = useMutation({
    mutationFn: applyToJob,
    onSuccess: () => navigate("/app/applications")
  });

  return (
    <section className="section">
      <div className="container surface" style={{ padding: "2rem" }}>
        <div className="eyebrow">Application flow</div>
        <h1 className="headline" style={{ fontSize: "2.4rem", margin: "0.4rem 0 1rem" }}>
          Submit a polished application for {job?.title ?? "this role"}.
        </h1>
        <div className="form-grid">
          <div className="field">
            <label>Selected resume</label>
            <select className="select" value={resumeId} onChange={(event) => setResumeId(event.target.value)}>
              <option>Use profile only</option>
              {resumes.map((resume) => (
                <option key={resume.id} value={resume.id}>
                  {resume.fileName}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Application note</label>
            <input className="input" placeholder="Optional headline to personalize your application" />
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
        </div>
        <div className="space-between" style={{ marginTop: "1.2rem" }}>
          <div className="helper">Resume upload is optional in your backend flow, so profile-first applications are supported.</div>
          <button
            className="btn btn-primary"
            onClick={() =>
              mutation.mutate({
                jobId,
                resumeId: resumeId ? Number(resumeId) : null,
                coverLetter
              })
            }
          >
            {mutation.isPending ? "Submitting..." : "Submit application"}
          </button>
        </div>
      </div>
    </section>
  );
}
