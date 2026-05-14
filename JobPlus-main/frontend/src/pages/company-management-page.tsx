import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getMyCompany, saveMyCompany } from "../services/companies-service";

export function CompanyManagementPage() {
  const queryClient = useQueryClient();
  const { data: company } = useQuery({ queryKey: ["companies", "me"], queryFn: getMyCompany, retry: false });
  const [form, setForm] = useState({
    companyName: "",
    industry: "",
    description: "",
    location: "",
    website: "",
    logoUrl: "",
    companySize: ""
  });
  const mutation = useMutation({
    mutationFn: saveMyCompany,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["companies", "me"] })
  });

  useEffect(() => {
    if (company) {
      setForm({
        companyName: company.name ?? "",
        industry: company.industry ?? "",
        description: company.description ?? "",
        location: company.location ?? "",
        website: company.website ?? "",
        logoUrl: company.logoUrl ?? "",
        companySize: company.size ?? ""
      });
    }
  }, [company]);

  return (
    <div className="grid grid-2">
      <div className="surface" style={{ padding: "1.4rem" }}>
        <div className="eyebrow">Company profile</div>
        <h2 className="headline" style={{ fontSize: "2rem", margin: "0.35rem 0 1rem" }}>
          Present your brand with confidence.
        </h2>
        <div className="form-grid">
          <div className="field">
            <label>Company name</label>
            <input className="input" value={form.companyName} onChange={(event) => setForm((state) => ({ ...state, companyName: event.target.value }))} />
          </div>
          <div className="field">
            <label>Industry</label>
            <input className="input" value={form.industry} onChange={(event) => setForm((state) => ({ ...state, industry: event.target.value }))} />
          </div>
        </div>
        <div className="field" style={{ marginTop: "1rem" }}>
          <label>Description</label>
          <textarea className="textarea" value={form.description} onChange={(event) => setForm((state) => ({ ...state, description: event.target.value }))} />
        </div>
        <div className="form-grid" style={{ marginTop: "1rem" }}>
          <div className="field">
            <label>Location</label>
            <input className="input" value={form.location} onChange={(event) => setForm((state) => ({ ...state, location: event.target.value }))} />
          </div>
          <div className="field">
            <label>Website</label>
            <input className="input" value={form.website} onChange={(event) => setForm((state) => ({ ...state, website: event.target.value }))} />
          </div>
        </div>
        <button
          className="btn btn-primary"
          style={{ marginTop: "1rem" }}
          onClick={() =>
            mutation.mutate({
              id: company?.id,
              companyName: form.companyName,
              description: form.description,
              industry: form.industry,
              location: form.location,
              website: form.website,
              logoUrl: form.logoUrl,
              companySize: form.companySize
            })
          }
        >
          Save company profile
        </button>
      </div>
      <div className="surface" style={{ padding: "1.4rem" }}>
        <strong>Profile completion checklist</strong>
        <div className="stack" style={{ marginTop: "1rem" }}>
          <div className="card">Upload logo</div>
          <div className="card">Add hiring locations</div>
          <div className="card">Publish public company profile</div>
        </div>
      </div>
    </div>
  );
}
