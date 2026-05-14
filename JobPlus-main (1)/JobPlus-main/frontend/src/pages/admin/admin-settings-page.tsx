import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAdminSettings, saveAdminSettings } from "../../services/admin-service";
import type { AdminSystemSettings } from "../../types/admin";

type AdminSettingsTab = "general" | "moderation" | "notifications" | "security" | "preferences";

const tabs: Array<{ key: AdminSettingsTab; title: string; description: string }> = [
  { key: "general", title: "General", description: "Core platform identity and role defaults." },
  { key: "moderation", title: "Moderation", description: "Risk thresholds, approvals, and trust controls." },
  { key: "notifications", title: "Notifications", description: "Alert channels and escalation behavior." },
  { key: "security", title: "Security & Access", description: "Session hardening and admin protections." },
  { key: "preferences", title: "Preferences", description: "Language, theme, and operations defaults." }
];

export function AdminSettingsPage() {
  const { data } = useQuery({ queryKey: ["admin", "settings"], queryFn: getAdminSettings });
  const [form, setForm] = useState<AdminSystemSettings | null>(null);
  const [tab, setTab] = useState<AdminSettingsTab>("general");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: (payload: AdminSystemSettings) => saveAdminSettings(payload),
    onSuccess: () => setStatus("Settings saved successfully."),
    onError: () => setStatus("Saving failed. Please retry.")
  });

  if (!form) {
    return <section className="surface jp-admin-section">Loading settings...</section>;
  }

  return (
    <section className="surface jp-admin-section">
      <div className="space-between">
        <div>
          <h2 style={{ margin: 0 }}>Admin Platform Settings</h2>
          <p className="helper">Enterprise controls for platform behavior, moderation policy, and operational preferences.</p>
        </div>
        <button className="btn btn-primary" onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending}>
          {saveMutation.isPending ? "Saving..." : "Save all changes"}
        </button>
      </div>

      {status ? <div className="jp-settings-banner is-info" style={{ marginTop: "0.85rem" }}>{status}</div> : null}

      <div className="jp-admin-settings-layout">
        <aside className="jp-admin-settings-nav">
          {tabs.map((item) => (
            <button key={item.key} type="button" className={`jp-admin-settings-tab ${tab === item.key ? "is-active" : ""}`} onClick={() => setTab(item.key)}>
              <strong>{item.title}</strong>
              <small>{item.description}</small>
            </button>
          ))}
        </aside>

        <main className="jp-admin-settings-content">
          {tab === "general" ? (
            <section className="stack">
              <div className="form-grid">
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
              <div className="grid grid-3">
                <ToggleCard title="Registration Enabled" checked={form.registrationEnabled} onChange={(value) => setForm((curr) => (curr ? { ...curr, registrationEnabled: value } : curr))} />
                <ToggleCard title="Maintenance Mode" checked={form.maintenanceMode} onChange={(value) => setForm((curr) => (curr ? { ...curr, maintenanceMode: value } : curr))} />
                <ToggleCard title="System Notifications" checked={form.notificationsEnabled} onChange={(value) => setForm((curr) => (curr ? { ...curr, notificationsEnabled: value } : curr))} />
              </div>
            </section>
          ) : null}

          {tab === "moderation" ? (
            <section className="stack">
              <div className="grid grid-3">
                <ToggleCard title="Company Approval Required" checked={form.companyApprovalRequired} onChange={(value) => setForm((curr) => (curr ? { ...curr, companyApprovalRequired: value } : curr))} />
                <ToggleCard title="Job Approval Required" checked={form.jobApprovalRequired} onChange={(value) => setForm((curr) => (curr ? { ...curr, jobApprovalRequired: value } : curr))} />
              </div>
              <div className="form-grid">
                <div className="field">
                  <label>Moderation threshold ({form.moderationThreshold})</label>
                  <input type="range" min={40} max={95} value={form.moderationThreshold} onChange={(e) => setForm((curr) => (curr ? { ...curr, moderationThreshold: Number(e.target.value) } : curr))} />
                </div>
                <div className="field">
                  <label>Verification SLA (hours)</label>
                  <input className="input" type="number" min={1} max={120} value={form.verificationSlaHours} onChange={(e) => setForm((curr) => (curr ? { ...curr, verificationSlaHours: Number(e.target.value) } : curr))} />
                </div>
              </div>
            </section>
          ) : null}

          {tab === "notifications" ? (
            <section className="grid grid-3">
              <ToggleCard title="In-app Alerts" checked={form.notificationsEnabled} onChange={(value) => setForm((curr) => (curr ? { ...curr, notificationsEnabled: value } : curr))} />
              <ToggleCard title="Escalation Digest Emails" checked={true} onChange={() => undefined} />
              <ToggleCard title="Incident Pager Sync" checked={true} onChange={() => undefined} />
            </section>
          ) : null}

          {tab === "security" ? (
            <section className="stack">
              <div className="grid grid-3">
                <ToggleCard title="2FA Required For Admins" checked={true} onChange={() => undefined} />
                <ToggleCard title="Session Device Tracking" checked={true} onChange={() => undefined} />
                <ToggleCard title="Sensitive Action Confirmation" checked={true} onChange={() => undefined} />
              </div>
              <article className="surface-muted" style={{ padding: "1rem" }}>
                <strong>Role Access Governance</strong>
                <p className="helper" style={{ marginBottom: "0.4rem" }}>Permission policies are managed from the dedicated Permissions module.</p>
                <a className="btn btn-secondary" href="/admin/permissions">Open Permissions</a>
              </article>
            </section>
          ) : null}

          {tab === "preferences" ? (
            <section className="stack">
              <div className="form-grid">
                <div className="field">
                  <label>Admin language</label>
                  <select className="select" defaultValue="en">
                    <option value="en">English</option>
                    <option value="ar">Arabic</option>
                    <option value="zh">Chinese</option>
                    <option value="fr">French</option>
                    <option value="es">Spanish</option>
                  </select>
                </div>
                <div className="field">
                  <label>Admin theme</label>
                  <select className="select" defaultValue="system">
                    <option value="system">System default</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label>Feature flags (comma separated)</label>
                <input className="input" value={form.featureFlags.join(", ")} onChange={(e) => setForm((curr) => (curr ? { ...curr, featureFlags: e.target.value.split(",").map((flag) => flag.trim()).filter(Boolean) } : curr))} />
              </div>
            </section>
          ) : null}
        </main>
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
