import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { SelectPeriod } from "../components/shared/select-period";
import { listJobCategories } from "../services/meta-service";
import { getJob, updateJob } from "../services/jobs-service";

export function EditJobPage() {
  const navigate = useNavigate();
  const params = useParams();
  const jobId = Number(params.jobId);
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: listJobCategories });
  const { data: job } = useQuery({ queryKey: ["jobs", "edit", jobId], queryFn: () => getJob(jobId), enabled: Number.isFinite(jobId) });
  const mutation = useMutation({
    mutationFn: (payload: Parameters<typeof updateJob>[1]) => updateJob(jobId, payload),
    onSuccess: () => navigate("/employer/jobs")
  });
  const [period, setPeriod] = useState({
    start: job?.deadline ? `${job.deadline}T09:00` : "",
    end: job?.deadline ? `${job.deadline}T17:00` : ""
  });

  useEffect(() => {
    if (job?.deadline) {
      setPeriod({
        start: `${job.deadline}T09:00`,
        end: `${job.deadline}T17:00`
      });
    }
  }, [job?.deadline]);

  return (
    <div className="surface" style={{ padding: "1.5rem" }}>
      <div className="eyebrow">Employer editing workflow</div>
      <h2 className="headline" style={{ fontSize: "2rem", margin: "0.35rem 0 1rem" }}>Edit job posting</h2>
      <div className="form-grid">
        <div className="field">
          <label>Job title</label>
          <input className="input" defaultValue={job?.title ?? ""} id="edit-title" />
        </div>
        <div className="field">
          <label>Category</label>
          <select className="select" id="edit-category" defaultValue={String(job?.categoryId ?? "")}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-grid" style={{ marginTop: "1rem" }}>
        <div className="field">
          <label>Location</label>
          <input className="input" defaultValue={job?.location ?? ""} id="edit-location" />
        </div>
        <div className="field">
          <label>Work mode</label>
          <select className="select" id="edit-work-mode" defaultValue={job?.workMode?.toUpperCase().replace("-", "_") ?? "HYBRID"}>
            <option value="HYBRID">Hybrid</option>
            <option value="REMOTE">Remote</option>
            <option value="ONSITE">On-site</option>
          </select>
        </div>
      </div>
      <div className="field" style={{ marginTop: "1rem" }}>
        <label>Description</label>
        <textarea className="textarea" defaultValue={job?.description ?? ""} id="edit-description" />
      </div>
      <div style={{ marginTop: "1rem" }}>
        <SelectPeriod
          label="Application window"
          startValue={period.start}
          endValue={period.end}
          onStartChange={(value) => setPeriod((current) => ({ ...current, start: value }))}
          onEndChange={(value) => setPeriod((current) => ({ ...current, end: value }))}
        />
      </div>
      <div className="space-between" style={{ marginTop: "1rem" }}>
        <button className="btn btn-secondary">Close job</button>
        <button
          className="btn btn-primary"
          onClick={() =>
            mutation.mutate({
              categoryId: Number((document.getElementById("edit-category") as HTMLSelectElement | null)?.value ?? job?.categoryId ?? 1),
              title: (document.getElementById("edit-title") as HTMLInputElement).value,
              description: (document.getElementById("edit-description") as HTMLTextAreaElement).value,
              requirements: job?.requirements.join(", ") ?? "",
              location: (document.getElementById("edit-location") as HTMLInputElement).value,
              jobType: job?.type.toUpperCase().replace("-", "_") ?? "FULL_TIME",
              workMode: (document.getElementById("edit-work-mode") as HTMLSelectElement).value,
              experienceLevel: job?.level?.toUpperCase() ?? "MID",
              salaryMin: job?.salaryMin ?? null,
              salaryMax: job?.salaryMax ?? null,
              currency: job?.currency ?? "USD",
              vacancyCount: job?.vacancyCount ?? 1,
              applicationDeadline: period.end ? period.end.slice(0, 10) : job?.deadline ?? null
            })
          }
        >
          {mutation.isPending ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}
