import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { EmptyState } from "../components/shared/empty-state";
import {
  createResume,
  deleteResume,
  getCandidateProfile,
  getUserProfile,
  listResumes,
  updateCandidateProfile,
  updateUserProfile
} from "../services/profile-service";

export function ProfilePage() {
  const queryClient = useQueryClient();
  const { data: userProfile } = useQuery({ queryKey: ["profile", "user"], queryFn: getUserProfile });
  const { data: candidateProfile } = useQuery({ queryKey: ["profile", "candidate"], queryFn: getCandidateProfile });
  const { data: resumes = [] } = useQuery({ queryKey: ["resumes"], queryFn: listResumes });
  const [resumeForm, setResumeForm] = useState({ fileName: "", filePath: "" });

  const userMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile", "user"] })
  });

  const candidateMutation = useMutation({
    mutationFn: updateCandidateProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile", "candidate"] })
  });

  const resumeMutation = useMutation({
    mutationFn: createResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      setResumeForm({ fileName: "", filePath: "" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteResume,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["resumes"] })
  });

  return (
    <div className="grid grid-2">
      <div className="surface" style={{ padding: "1.4rem" }}>
        <div className="eyebrow">Candidate profile</div>
        <h2 className="headline" style={{ fontSize: "2rem", margin: "0.4rem 0 1rem" }}>
          Professional profile and career identity
        </h2>
        <div className="form-grid">
          <div className="field">
            <label>Full name</label>
            <input className="input" defaultValue={userProfile?.fullName ?? ""} id="fullName" />
          </div>
          <div className="field">
            <label>Email</label>
            <input className="input" defaultValue={userProfile?.email ?? ""} id="email" />
          </div>
        </div>
        <div className="field" style={{ marginTop: "1rem" }}>
          <label>Phone</label>
          <input className="input" defaultValue={userProfile?.phone ?? ""} id="phone" />
        </div>
        <div className="field" style={{ marginTop: "1rem" }}>
          <label>Experience summary</label>
          <textarea className="textarea" defaultValue={candidateProfile?.experienceSummary ?? ""} id="experienceSummary" />
        </div>
        <div className="field" style={{ marginTop: "1rem" }}>
          <label>Education</label>
          <input className="input" defaultValue={candidateProfile?.education ?? ""} id="education" />
        </div>
        <div className="field" style={{ marginTop: "1rem" }}>
          <label>Address</label>
          <input className="input" defaultValue={candidateProfile?.address ?? ""} id="address" />
        </div>
        <div className="row" style={{ marginTop: "1rem" }}>
          <button
            className="btn btn-primary"
            onClick={() => {
              const fullName = (document.getElementById("fullName") as HTMLInputElement).value;
              const email = (document.getElementById("email") as HTMLInputElement).value;
              const phone = (document.getElementById("phone") as HTMLInputElement).value;
              const experienceSummary = (document.getElementById("experienceSummary") as HTMLTextAreaElement).value;
              const education = (document.getElementById("education") as HTMLInputElement).value;
              const address = (document.getElementById("address") as HTMLInputElement).value;
              userMutation.mutate({ fullName, email, phone });
              candidateMutation.mutate({
                address,
                education,
                experienceSummary,
                linkedinUrl: candidateProfile?.linkedinUrl ?? "",
                githubUrl: candidateProfile?.githubUrl ?? ""
              });
            }}
          >
            Save profile
          </button>
          <button className="btn btn-secondary">Preview profile</button>
        </div>
      </div>
      <div className="surface" style={{ padding: "1.4rem" }}>
        <div className="space-between">
          <strong>Resume management</strong>
          <button
            className="btn btn-secondary"
            onClick={() => resumeMutation.mutate({ fileName: resumeForm.fileName, filePath: resumeForm.filePath })}
          >
            Upload resume metadata
          </button>
        </div>
        <div className="form-grid" style={{ marginTop: "1rem" }}>
          <div className="field">
            <label>File name</label>
            <input
              className="input"
              value={resumeForm.fileName}
              onChange={(event) => setResumeForm((current) => ({ ...current, fileName: event.target.value }))}
            />
          </div>
          <div className="field">
            <label>File path</label>
            <input
              className="input"
              value={resumeForm.filePath}
              onChange={(event) => setResumeForm((current) => ({ ...current, filePath: event.target.value }))}
            />
          </div>
        </div>
        {resumes.length ? (
          <table className="table" style={{ marginTop: "1rem" }}>
            <thead>
              <tr>
                <th>File</th>
                <th>Updated</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {resumes.map((resume) => (
                <tr key={resume.id}>
                  <td>{resume.fileName}</td>
                  <td>{resume.uploadedAt.slice(0, 10)}</td>
                  <td>
                    <button className="btn btn-secondary" onClick={() => deleteMutation.mutate(resume.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ marginTop: "1rem" }}>
            <EmptyState title="No resumes uploaded" description="Add resume metadata here so candidate applications can reference it." />
          </div>
        )}
      </div>
    </div>
  );
}
