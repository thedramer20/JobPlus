import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { SelectPeriod } from "../components/shared/select-period";
import { listJobCategories } from "../services/meta-service";
import { createJob } from "../services/jobs-service";

export function PostJobPage() {
  return <JobFormPage title="Create a job posting" actionLabel="Publish job" mode="create" />;
}

function JobFormPage({ title, actionLabel, mode }: { title: string; actionLabel: string; mode: "create" }) {
  const navigate = useNavigate();
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: listJobCategories });
  const [form, setForm] = useState({
    categoryId: "",
    title: "",
    location: "",
    workMode: "HYBRID",
    jobType: "FULL_TIME",
    experienceLevel: "MID",
    description: "",
    requirements: "",
    salaryMin: "",
    salaryMax: "",
    currency: "USD",
    vacancyCount: "1",
    applicationDeadline: "",
    applicationEnd: ""
  });
  const mutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => navigate("/employer/jobs")
  });

  return (
    <div className="surface" style={{ padding: "1.5rem" }}>
      <div className="eyebrow">Structured form workflow</div>
      <h2 className="headline" style={{ fontSize: "2rem", margin: "0.35rem 0 1rem" }}>
        {title}
      </h2>
      <div className="form-grid">
        <div className="field">
          <label>Job title</label>
          <input className="input" value={form.title} onChange={(event) => setForm((state) => ({ ...state, title: event.target.value }))} />
        </div>
        <div className="field">
          <label>Category</label>
          <select className="select" value={form.categoryId} onChange={(event) => setForm((state) => ({ ...state, categoryId: event.target.value }))}>
            <option value="">Select category</option>
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
          <input className="input" value={form.location} onChange={(event) => setForm((state) => ({ ...state, location: event.target.value }))} />
        </div>
        <div className="field">
          <label>Work mode</label>
          <select className="select" value={form.workMode} onChange={(event) => setForm((state) => ({ ...state, workMode: event.target.value }))}>
            <option value="HYBRID">Hybrid</option>
            <option value="REMOTE">Remote</option>
            <option value="ONSITE">On-site</option>
          </select>
        </div>
      </div>
      <div className="form-grid" style={{ marginTop: "1rem" }}>
        <div className="field">
          <label>Job type</label>
          <select className="select" value={form.jobType} onChange={(event) => setForm((state) => ({ ...state, jobType: event.target.value }))}>
            <option value="FULL_TIME">Full-time</option>
            <option value="PART_TIME">Part-time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
        </div>
        <div className="field">
          <label>Experience level</label>
          <select className="select" value={form.experienceLevel} onChange={(event) => setForm((state) => ({ ...state, experienceLevel: event.target.value }))}>
            <option value="ENTRY">Entry</option>
            <option value="MID">Mid</option>
            <option value="SENIOR">Senior</option>
            <option value="LEAD">Lead</option>
          </select>
        </div>
      </div>
      <div className="field" style={{ marginTop: "1rem" }}>
        <label>Description</label>
        <textarea className="textarea" value={form.description} onChange={(event) => setForm((state) => ({ ...state, description: event.target.value }))} />
      </div>
      <div className="field" style={{ marginTop: "1rem" }}>
        <label>Requirements</label>
        <textarea className="textarea" value={form.requirements} onChange={(event) => setForm((state) => ({ ...state, requirements: event.target.value }))} />
      </div>
      <div className="form-grid" style={{ marginTop: "1rem" }}>
        <div className="field">
          <label>Minimum salary</label>
          <input className="input" value={form.salaryMin} onChange={(event) => setForm((state) => ({ ...state, salaryMin: event.target.value }))} />
        </div>
        <div className="field">
          <label>Maximum salary</label>
          <input className="input" value={form.salaryMax} onChange={(event) => setForm((state) => ({ ...state, salaryMax: event.target.value }))} />
        </div>
      </div>
      <div style={{ marginTop: "1rem" }}>
        <SelectPeriod
          label="Application window"
          startValue={form.applicationDeadline}
          endValue={form.applicationEnd}
          onStartChange={(value) => setForm((state) => ({ ...state, applicationDeadline: value }))}
          onEndChange={(value) => setForm((state) => ({ ...state, applicationEnd: value }))}
        />
      </div>
      <div className="space-between" style={{ marginTop: "1rem" }}>
        <div className="helper">This form is structured for publish, save draft, and future job preview behavior.</div>
        <div className="row">
          <button className="btn btn-secondary">Save draft</button>
          <button
            className="btn btn-primary"
            onClick={() =>
              mutation.mutate({
                categoryId: Number(form.categoryId),
                title: form.title,
                description: form.description,
                requirements: form.requirements,
                location: form.location,
                jobType: form.jobType,
                workMode: form.workMode,
                experienceLevel: form.experienceLevel,
                salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
                salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
                currency: form.currency,
                vacancyCount: Number(form.vacancyCount),
                applicationDeadline: form.applicationEnd ? form.applicationEnd.slice(0, 10) : form.applicationDeadline ? form.applicationDeadline.slice(0, 10) : null
              })
            }
          >
            {mutation.isPending ? "Saving..." : actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
