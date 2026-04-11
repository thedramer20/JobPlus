import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAdminSettings, saveAdminSettings } from "../../services/admin-service";
import type { AdminSystemSettings } from "../../types/admin";

export function AdminSettingsPage() {
  const { data } = useQuery({ queryKey: ["admin", "settings"], queryFn: getAdminSettings });
  const [form, setForm] = useState<AdminSystemSettings | null>(null);

  useEffect(() => {
    if (data) {
      setForm(data);
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: (payload: AdminSystemSettings) => saveAdminSettings(payload)
  });

  if (!form) {
    return <section className="surface" style={{ padding: "1.2rem" }}>Loading settings...</section>;
  }

  return (
    <section className="surface" style={{ padding: "1.2rem" }}>
      <div className="space-between">
        <div>
          <h2 style={{ margin: 0 }}>Platform Settings</h2>
          <p className="helper">Configure core platform behavior and moderation defaults.</p>
        </div>
        <button className="btn btn-primary" onClick={() => saveMutation.mutate(form)}>
          {saveMutation.isPending ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <div className="form-grid" style={{ marginTop: "1rem" }}>
        <div className="field">
          <label>Platform name</label>
          <input className="input" value={form.platformName} onChange={(e) => setForm((curr) => (curr ? { ...curr, platformName: e.target.value } : curr))} />
        </div>
        <div className="field">
          <label>Default user role</label>
          <select className="select" value={form.defaultRole} onChange={(e) => setForm((curr) => (curr ? { ...curr, defaultRole: e.target.value as "candidate" | "employer" } : curr))}>
            <option value="candidate">Candidate</option>
            <option value="employer">Employer</option>
          </select>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginTop: "1rem" }}>
        <ToggleCard title="Registration Enabled" checked={form.registrationEnabled} onChange={(value) => setForm((curr) => (curr ? { ...curr, registrationEnabled: value } : curr))} />
        <ToggleCard title="Company Approval Required" checked={form.companyApprovalRequired} onChange={(value) => setForm((curr) => (curr ? { ...curr, companyApprovalRequired: value } : curr))} />
        <ToggleCard title="Job Approval Required" checked={form.jobApprovalRequired} onChange={(value) => setForm((curr) => (curr ? { ...curr, jobApprovalRequired: value } : curr))} />
        <ToggleCard title="Notifications Enabled" checked={form.notificationsEnabled} onChange={(value) => setForm((curr) => (curr ? { ...curr, notificationsEnabled: value } : curr))} />
        <ToggleCard title="Maintenance Mode" checked={form.maintenanceMode} onChange={(value) => setForm((curr) => (curr ? { ...curr, maintenanceMode: value } : curr))} />
      </div>
    </section>
  );
}

function ToggleCard({ title, checked, onChange }: { title: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <article className="card space-between">
      <strong>{title}</strong>
      <label className="helper" style={{ display: "inline-flex", gap: "0.45rem", alignItems: "center" }}>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        {checked ? "On" : "Off"}
      </label>
    </article>
  );
}

