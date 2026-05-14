import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import { usePreferences } from "../context/PreferencesContext";
import { authStore } from "../store/auth-store";
import { changePassword, getCandidateProfile, getUserProfile, updateCandidateProfile, updateUserProfile } from "../services/profile-service";
import { getLinkedSocialProviders, getSocialProviders, startSocialAuth, unlinkSocialProvider, type SocialProvider } from "../services/auth-service";
import { supportedLanguages, type SupportedLanguage } from "../i18n";
import type { UiPersonalityMode } from "../lib/ui-intelligence";

type SettingsTab = "profile" | "account" | "security" | "notifications" | "preferences";

interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  period: string;
}

interface EducationEntry {
  id: string;
  school: string;
  degree: string;
  period: string;
}

const tabs: Array<{ key: SettingsTab; labelKey: string; descriptionKey: string }> = [
  { key: "profile", labelKey: "settingsPage.tabs.profile", descriptionKey: "settingsPage.tabs.profileDesc" },
  { key: "account", labelKey: "settingsPage.tabs.account", descriptionKey: "settingsPage.tabs.accountDesc" },
  { key: "security", labelKey: "settingsPage.tabs.security", descriptionKey: "settingsPage.tabs.securityDesc" },
  { key: "notifications", labelKey: "settingsPage.tabs.notifications", descriptionKey: "settingsPage.tabs.notificationsDesc" },
  { key: "preferences", labelKey: "settingsPage.tabs.preferences", descriptionKey: "settingsPage.tabs.preferencesDesc" }
];

const MAX_AVATAR_FILE_SIZE = 2 * 1024 * 1024;

export function SettingsPage() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const { user, token } = authStore();
  const { theme, setTheme, language, setLanguage, uiPersonality, setUiPersonality } = usePreferences();
  const isCandidate = user?.role === "candidate";

  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  const userQuery = useQuery({ queryKey: ["profile", "user"], queryFn: getUserProfile });
  const candidateQuery = useQuery({ queryKey: ["profile", "candidate"], queryFn: getCandidateProfile, enabled: isCandidate });
  const socialProvidersQuery = useQuery({ queryKey: ["auth", "social-providers"], queryFn: getSocialProviders, retry: 0 });
  const socialLinksQuery = useQuery({
    queryKey: ["auth", "social-links"],
    queryFn: getLinkedSocialProviders,
    enabled: Boolean(user)
  });

  const [accountForm, setAccountForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    username: "",
    roleLabel: ""
  });
  const [profileForm, setProfileForm] = useState({
    headline: "",
    location: "",
    about: "",
    company: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: ""
  });
  const [avatarState, setAvatarState] = useState({ currentUrl: "", previewUrl: "", dirty: false, uploading: false });
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [experience, setExperience] = useState<ExperienceEntry[]>([]);
  const [education, setEducation] = useState<EducationEntry[]>([]);
  const [experienceDraft, setExperienceDraft] = useState({ role: "", company: "", period: "" });
  const [educationDraft, setEducationDraft] = useState({ school: "", degree: "", period: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [notificationForm, setNotificationForm] = useState({
    messagesInApp: true,
    messagesEmail: false,
    jobAlertsInApp: true,
    jobAlertsEmail: true,
    applicationUpdatesInApp: true,
    applicationUpdatesEmail: true
  });

  useEffect(() => {
    if (searchParams.get("linked") === "success") {
      setFeedback({ type: "success", text: "Social account linked successfully." });
      setSearchParams((current) => {
        current.delete("linked");
        return current;
      }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (!userQuery.data) return;
    setAccountForm({
      fullName: userQuery.data.fullName ?? user?.name ?? "",
      email: userQuery.data.email ?? user?.email ?? "",
      phone: userQuery.data.phone ?? "",
      username: userQuery.data.username ?? "",
      roleLabel: (userQuery.data.role ?? user?.role ?? "candidate").replace("ROLE_", "")
    });
  }, [user?.email, user?.name, user?.role, userQuery.data]);

  useEffect(() => {
    const local = readLocalSettings();
    if (candidateQuery.data) {
      setProfileForm({
        headline: local.headline ?? "",
        location: candidateQuery.data.address ?? local.location ?? "",
        about: candidateQuery.data.experienceSummary ?? local.about ?? "",
        company: local.company ?? "",
        linkedinUrl: candidateQuery.data.linkedinUrl ?? "",
        githubUrl: candidateQuery.data.githubUrl ?? "",
        portfolioUrl: local.portfolioUrl ?? ""
      });
      setAvatarState((current) => ({
        ...current,
        currentUrl: candidateQuery.data.avatarUrl ?? local.avatarUrl ?? "",
        previewUrl: candidateQuery.data.avatarUrl ?? local.avatarUrl ?? "",
        dirty: false
      }));
    }
    setSkills(local.skills ?? []);
    setExperience(local.experience ?? []);
    setEducation(local.education ?? []);
    if (local.notificationForm) setNotificationForm(local.notificationForm);
  }, [candidateQuery.data]);

  useEffect(() => {
    if (!userQuery.data && !candidateQuery.data) return;
    writeLocalSettings({
      headline: profileForm.headline,
      location: profileForm.location,
      about: profileForm.about,
      company: profileForm.company,
      portfolioUrl: profileForm.portfolioUrl,
      avatarUrl: avatarState.previewUrl,
      skills,
      experience,
      education,
      notificationForm
    });
  }, [avatarState.previewUrl, candidateQuery.data, education, experience, notificationForm, profileForm, skills, userQuery.data]);

  const accountMutation = useMutation({
    mutationFn: () => updateUserProfile({ fullName: accountForm.fullName.trim(), email: accountForm.email.trim(), phone: accountForm.phone.trim() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "user"] });
      setFeedback({ type: "success", text: "Account settings saved successfully." });
    },
    onError: () => setFeedback({ type: "error", text: "Unable to save account settings." })
  });

  const profileMutation = useMutation({
    mutationFn: () =>
      updateCandidateProfile({
        address: profileForm.location.trim(),
        education: formatEducationForBackend(education),
        experienceSummary: profileForm.about.trim(),
        avatarUrl: avatarState.previewUrl,
        linkedinUrl: profileForm.linkedinUrl.trim(),
        githubUrl: profileForm.githubUrl.trim()
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "candidate"] });
      setAvatarState((current) => ({ ...current, currentUrl: current.previewUrl, dirty: false, uploading: false }));
      setFeedback({ type: "success", text: "Profile settings saved successfully." });
    },
    onError: () => {
      setAvatarState((current) => ({ ...current, uploading: false }));
      setFeedback({ type: "error", text: "Unable to save profile changes." });
    }
  });

  const passwordMutation = useMutation({
    mutationFn: () => changePassword(passwordForm),
    onSuccess: () => {
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setFeedback({ type: "success", text: "Password changed successfully." });
    },
    onError: (error: unknown) => setFeedback({ type: "error", text: getErrorMessage(error) ?? "Unable to change password." })
  });

  const unlinkSocialMutation = useMutation({
    mutationFn: (provider: SocialProvider) => unlinkSocialProvider(provider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "social-links"] });
      setFeedback({ type: "success", text: "Account disconnected successfully." });
    },
    onError: () => setFeedback({ type: "error", text: "Unable to disconnect account." })
  });

  const loadingProfile = userQuery.isLoading || (isCandidate && candidateQuery.isLoading);
  const profileCompletion = useMemo(() => {
    const checks = [Boolean(accountForm.fullName), Boolean(profileForm.about), Boolean(profileForm.location), Boolean(avatarState.previewUrl), skills.length > 0, experience.length > 0];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [accountForm.fullName, avatarState.previewUrl, experience.length, profileForm.about, profileForm.location, skills.length]);

  function handleAvatarFile(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setFeedback({ type: "error", text: "Please upload a PNG or JPG image." });
    if (file.size > MAX_AVATAR_FILE_SIZE) return setFeedback({ type: "error", text: "Image must be 2MB or less." });
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setAvatarState((current) => ({ ...current, previewUrl: result, dirty: true }));
      setFeedback({ type: "info", text: "Image preview ready. Save profile to apply it." });
    };
    reader.onerror = () => setFeedback({ type: "error", text: "Failed to read image file." });
    reader.readAsDataURL(file);
  }

  function removeAvatar() {
    setAvatarState((current) => ({ ...current, previewUrl: "", dirty: true }));
  }

  function addSkill() {
    const value = skillInput.trim();
    if (!value) return;
    if (skills.some((skill) => skill.toLowerCase() === value.toLowerCase())) return setFeedback({ type: "info", text: "That skill is already listed." });
    setSkills((current) => [...current, value]);
    setSkillInput("");
  }

  function addExperience() {
    if (!experienceDraft.role.trim() || !experienceDraft.company.trim()) return setFeedback({ type: "error", text: "Experience needs role and company." });
    setExperience((current) => [...current, { id: `${Date.now()}`, role: experienceDraft.role.trim(), company: experienceDraft.company.trim(), period: experienceDraft.period.trim() }]);
    setExperienceDraft({ role: "", company: "", period: "" });
  }

  function addEducation() {
    if (!educationDraft.school.trim() || !educationDraft.degree.trim()) return setFeedback({ type: "error", text: "Education needs school and degree." });
    setEducation((current) => [...current, { id: `${Date.now()}`, school: educationDraft.school.trim(), degree: educationDraft.degree.trim(), period: educationDraft.period.trim() }]);
    setEducationDraft({ school: "", degree: "", period: "" });
  }

  function saveProfileSection() {
    if (!profileForm.about.trim()) return setFeedback({ type: "error", text: "About section is required." });
    if (!profileForm.location.trim()) return setFeedback({ type: "error", text: "Location is required." });
    if (!isCandidate) return setFeedback({ type: "info", text: "Profile details stored locally for this account type." });
    setAvatarState((current) => ({ ...current, uploading: current.dirty }));
    profileMutation.mutate();
  }

  function saveAccountSection() {
    if (!accountForm.fullName.trim()) return setFeedback({ type: "error", text: "Full name is required." });
    if (!isValidEmail(accountForm.email)) return setFeedback({ type: "error", text: "Please enter a valid email address." });
    accountMutation.mutate();
  }

  function connectSocial(provider: SocialProvider) {
    const enabled = socialProvidersQuery.data?.[provider];
    if (!enabled) {
      setFeedback({ type: "error", text: `${provider[0].toUpperCase() + provider.slice(1)} is not configured by server.` });
      return;
    }
    if (!token) {
      setFeedback({ type: "error", text: "Sign in again to link social accounts." });
      return;
    }
    startSocialAuth(provider, "link", token);
  }

  return (
    <section className="section-tight">
      <div className="container">
        <div className="jp-settings-page">
          <section className="surface jp-settings-shell">
            <aside className="jp-settings-sidebar">
              <div className="eyebrow">{t("common.settings")}</div>
              <h2 className="headline" style={{ margin: "0.35rem 0 0.55rem", fontSize: "1.95rem" }}>{t("settingsPage.title")}</h2>
              <p className="helper" style={{ marginTop: 0 }}>{t("settingsPage.subtitle")}</p>
              <div className="jp-settings-nav-list">
                {tabs.map((tab) => (
                  <button key={tab.key} type="button" className={`jp-settings-nav-item ${activeTab === tab.key ? "is-active" : ""}`} onClick={() => setActiveTab(tab.key)}>
                    <span><strong>{t(tab.labelKey)}</strong><small>{t(tab.descriptionKey)}</small></span>
                  </button>
                ))}
              </div>
              <div className="jp-profile-strength-track" style={{ marginTop: "1rem" }}><span style={{ width: `${profileCompletion}%` }} /></div>
              <div className="helper">{t("settingsPage.profileStrength", { value: profileCompletion })}</div>
            </aside>
            <main className="jp-settings-main">
              {feedback ? <div className={`jp-settings-banner is-${feedback.type}`}>{feedback.text}</div> : null}
              {loadingProfile ? <section className="jp-settings-section surface"><p className="helper">{t("settingsPage.loading")}</p></section> : null}
              <AnimatePresence mode="wait">
                {!loadingProfile && activeTab === "profile" ? (
                  <motion.section
                    key="profile"
                    className="jp-settings-section surface stack"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.32 }}
                  >
                  <header className="jp-settings-section-header">
                    <h3>{t("settingsPage.tabs.profile")}</h3>
                    <p className="helper">{t("settingsPage.tabs.profileDesc")}</p>
                  </header>

                  <article className="surface-muted" style={{ padding: "1rem" }}>
                    <div className="space-between" style={{ alignItems: "center" }}>
                      <div className="row" style={{ alignItems: "center", gap: "0.85rem" }}>
                        <AvatarPreview src={avatarState.previewUrl} fallbackText={accountForm.fullName || user?.name || "JP"} />
                        <div className="stack" style={{ gap: "0.2rem" }}>
                          <strong>Profile Photo</strong>
                          <span className="helper">Upload PNG/JPG up to 2MB. Preview updates before save.</span>
                        </div>
                      </div>
                      <div className="row" style={{ gap: "0.5rem", flexWrap: "wrap" }}>
                        <label className="btn btn-secondary" htmlFor="avatar-file-input">Change Photo</label>
                        <input id="avatar-file-input" type="file" accept="image/png,image/jpeg,image/jpg" style={{ display: "none" }} onChange={(event) => handleAvatarFile(event.target.files?.[0] ?? null)} />
                        <button type="button" className="btn btn-secondary" onClick={removeAvatar}>Remove</button>
                      </div>
                    </div>
                  </article>

                  <div className="form-grid">
                    <Field label="Headline"><input className="input" value={profileForm.headline} onChange={(e) => setProfileForm((c) => ({ ...c, headline: e.target.value }))} /></Field>
                    <Field label="Location"><input className="input" value={profileForm.location} onChange={(e) => setProfileForm((c) => ({ ...c, location: e.target.value }))} /></Field>
                    <Field label="Company"><input className="input" value={profileForm.company} onChange={(e) => setProfileForm((c) => ({ ...c, company: e.target.value }))} /></Field>
                    <Field label="LinkedIn URL"><input className="input" value={profileForm.linkedinUrl} onChange={(e) => setProfileForm((c) => ({ ...c, linkedinUrl: e.target.value }))} /></Field>
                    <Field label="GitHub URL"><input className="input" value={profileForm.githubUrl} onChange={(e) => setProfileForm((c) => ({ ...c, githubUrl: e.target.value }))} /></Field>
                    <Field label="Portfolio URL"><input className="input" value={profileForm.portfolioUrl} onChange={(e) => setProfileForm((c) => ({ ...c, portfolioUrl: e.target.value }))} /></Field>
                    <Field label="About" className="jp-settings-field-span"><textarea className="textarea" value={profileForm.about} onChange={(e) => setProfileForm((c) => ({ ...c, about: e.target.value }))} /></Field>
                  </div>

                  <div className="grid grid-2">
                    <section className="surface-muted" style={{ padding: "1rem" }}>
                      <strong>Skills</strong>
                      <div className="row" style={{ marginTop: "0.65rem", flexWrap: "wrap" }}>
                        {skills.map((skill) => <button key={skill} className="jp-settings-chip is-selected" onClick={() => setSkills((current) => current.filter((item) => item !== skill))} type="button">{skill}</button>)}
                        {!skills.length ? <span className="helper">No skills yet.</span> : null}
                      </div>
                      <div className="row" style={{ marginTop: "0.75rem", gap: "0.5rem" }}>
                        <input className="input" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Add a skill" />
                        <button type="button" className="btn btn-secondary" onClick={addSkill}>Add</button>
                      </div>
                    </section>

                    <section className="surface-muted" style={{ padding: "1rem" }}>
                      <strong>Experience</strong>
                      <div className="stack" style={{ marginTop: "0.6rem", gap: "0.45rem" }}>
                        {experience.map((entry) => <div key={entry.id} className="jp-dashboard-mini-line"><strong>{entry.role}</strong><small>{entry.company} {entry.period ? `- ${entry.period}` : ""}</small></div>)}
                        {!experience.length ? <span className="helper">No experience entries yet.</span> : null}
                      </div>
                      <div className="stack" style={{ marginTop: "0.75rem", gap: "0.45rem" }}>
                        <input className="input" value={experienceDraft.role} onChange={(e) => setExperienceDraft((c) => ({ ...c, role: e.target.value }))} placeholder="Role" />
                        <input className="input" value={experienceDraft.company} onChange={(e) => setExperienceDraft((c) => ({ ...c, company: e.target.value }))} placeholder="Company" />
                        <input className="input" value={experienceDraft.period} onChange={(e) => setExperienceDraft((c) => ({ ...c, period: e.target.value }))} placeholder="Period" />
                        <button type="button" className="btn btn-secondary" onClick={addExperience}>Add Experience</button>
                      </div>
                    </section>
                  </div>

                  <section className="surface-muted" style={{ padding: "1rem" }}>
                    <strong>Education</strong>
                    <div className="stack" style={{ marginTop: "0.6rem", gap: "0.45rem" }}>
                      {education.map((entry) => <div key={entry.id} className="jp-dashboard-mini-line"><strong>{entry.school}</strong><small>{entry.degree} {entry.period ? `- ${entry.period}` : ""}</small></div>)}
                      {!education.length ? <span className="helper">No education entries yet.</span> : null}
                    </div>
                    <div className="form-grid" style={{ marginTop: "0.75rem" }}>
                      <Field label="School"><input className="input" value={educationDraft.school} onChange={(e) => setEducationDraft((c) => ({ ...c, school: e.target.value }))} /></Field>
                      <Field label="Degree"><input className="input" value={educationDraft.degree} onChange={(e) => setEducationDraft((c) => ({ ...c, degree: e.target.value }))} /></Field>
                      <Field label="Period" className="jp-settings-field-span"><input className="input" value={educationDraft.period} onChange={(e) => setEducationDraft((c) => ({ ...c, period: e.target.value }))} /></Field>
                    </div>
                    <div className="jp-settings-actions">
                      <button type="button" className="btn btn-secondary" onClick={addEducation}>Add Education</button>
                    </div>
                  </section>

                  <div className="jp-settings-actions">
                    <button type="button" className="btn btn-primary" onClick={saveProfileSection} disabled={profileMutation.isPending || avatarState.uploading}>
                      {profileMutation.isPending || avatarState.uploading ? t("common.loading") : t("settingsPage.saveProfile")}
                    </button>
                  </div>
                </section>
              ) : null}

              {!loadingProfile && activeTab === "account" ? (
                <motion.section
                  key="account"
                  className="jp-settings-section surface"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.32 }}
                >
                  <header className="jp-settings-section-header"><h3>{t("settingsPage.tabs.account")}</h3><p className="helper">{t("settingsPage.tabs.accountDesc")}</p></header>
                  <div className="form-grid">
                    <Field label="Full Name"><input className="input" value={accountForm.fullName} onChange={(e) => setAccountForm((c) => ({ ...c, fullName: e.target.value }))} /></Field>
                    <Field label="Username"><input className="input" value={accountForm.username} disabled /></Field>
                    <Field label="Email"><input className="input" value={accountForm.email} onChange={(e) => setAccountForm((c) => ({ ...c, email: e.target.value }))} /></Field>
                    <Field label="Phone Number"><input className="input" value={accountForm.phone} onChange={(e) => setAccountForm((c) => ({ ...c, phone: e.target.value }))} /></Field>
                    <Field label="Account Type" className="jp-settings-field-span"><input className="input" value={accountForm.roleLabel} disabled /></Field>
                  </div>
                  <div className="jp-settings-actions">
                    <button type="button" className="btn btn-primary" onClick={saveAccountSection} disabled={accountMutation.isPending}>{accountMutation.isPending ? t("common.loading") : t("settingsPage.saveAccount")}</button>
                  </div>

                  <article className="surface-muted" style={{ padding: "1rem", marginTop: "1rem" }}>
                    <div className="space-between" style={{ alignItems: "center" }}>
                      <div>
                        <strong>Connected Accounts</strong>
                        <div className="helper">Link Google or GitHub for faster secure sign-in.</div>
                      </div>
                      <span className="pill">{socialLinksQuery.data ? Object.values(socialLinksQuery.data).filter(Boolean).length : 0} linked</span>
                    </div>
                    <div className="row" style={{ marginTop: "0.8rem", flexWrap: "wrap" }}>
                      {(["google", "github"] as SocialProvider[]).map((provider) => {
                        const linked = Boolean(socialLinksQuery.data?.[provider]);
                        return (
                          <div key={provider} className="row" style={{ gap: "0.5rem", alignItems: "center" }}>
                            <span className={`tag ${linked ? "status-success" : ""}`}>{provider.toUpperCase()}</span>
                            {linked ? (
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => unlinkSocialMutation.mutate(provider)}
                                disabled={unlinkSocialMutation.isPending}
                              >
                                Disconnect
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => connectSocial(provider)}
                                disabled={!socialProvidersQuery.data?.[provider]}
                              >
                                Connect
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </article>
                </section>
              ) : null}

              {!loadingProfile && activeTab === "security" ? (
                <section className="jp-settings-section surface">
                  <header className="jp-settings-section-header"><h3>{t("settingsPage.tabs.security")}</h3><p className="helper">{t("settingsPage.tabs.securityDesc")}</p></header>
                  <div className="form-grid">
                    <Field label="Current Password"><input type="password" className="input" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((c) => ({ ...c, currentPassword: e.target.value }))} /></Field>
                    <Field label="New Password"><input type="password" className="input" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((c) => ({ ...c, newPassword: e.target.value }))} /></Field>
                    <Field label="Confirm New Password" className="jp-settings-field-span"><input type="password" className="input" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm((c) => ({ ...c, confirmPassword: e.target.value }))} /></Field>
                  </div>
                  <div className="jp-settings-actions">
                    <button type="button" className="btn btn-primary" onClick={() => passwordMutation.mutate()} disabled={passwordMutation.isPending}>{passwordMutation.isPending ? t("common.loading") : t("settingsPage.changePassword")}</button>
                  </div>
                </section>
              ) : null}

              {!loadingProfile && activeTab === "notifications" ? (
                <section className="jp-settings-section surface">
                  <header className="jp-settings-section-header"><h3>{t("settingsPage.tabs.notifications")}</h3><p className="helper">{t("settingsPage.tabs.notificationsDesc")}</p></header>
                  <div className="jp-settings-notification-grid">
                    <NotificationCard title="Messages" values={{ inApp: notificationForm.messagesInApp, email: notificationForm.messagesEmail }} onChange={(changes) => setNotificationForm((c) => ({ ...c, ...changes }))} keys={{ inApp: "messagesInApp", email: "messagesEmail" }} />
                    <NotificationCard title="Job Alerts" values={{ inApp: notificationForm.jobAlertsInApp, email: notificationForm.jobAlertsEmail }} onChange={(changes) => setNotificationForm((c) => ({ ...c, ...changes }))} keys={{ inApp: "jobAlertsInApp", email: "jobAlertsEmail" }} />
                    <NotificationCard title="Application Updates" values={{ inApp: notificationForm.applicationUpdatesInApp, email: notificationForm.applicationUpdatesEmail }} onChange={(changes) => setNotificationForm((c) => ({ ...c, ...changes }))} keys={{ inApp: "applicationUpdatesInApp", email: "applicationUpdatesEmail" }} />
                  </div>
                  <div className="jp-settings-actions"><button type="button" className="btn btn-primary" onClick={() => setFeedback({ type: "success", text: "Notification preferences saved." })}>{t("settingsPage.saveNotifications")}</button></div>
                </section>
              ) : null}

              {!loadingProfile && activeTab === "preferences" ? (
                <section className="jp-settings-section surface">
                  <header className="jp-settings-section-header"><h3>{t("settingsPage.tabs.preferences")}</h3><p className="helper">{t("settingsPage.tabs.preferencesDesc")}</p></header>
                  <div className="form-grid">
                    <Field label={t("common.theme")}><select className="select" value={theme} onChange={(e) => setTheme(e.target.value as "light" | "dark")}><option value="light">{t("common.light")}</option><option value="dark">{t("common.dark")}</option></select></Field>
                    <Field label={t("common.language")}><select className="select" value={language} onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}>{supportedLanguages.map((code) => <option key={code} value={code}>{t(`languages.${code}`)}</option>)}</select></Field>
                    <Field label="UI Personality" className="jp-settings-field-span">
                      <select
                        className="select"
                        value={uiPersonality}
                        onChange={(event) => setUiPersonality(event.target.value as UiPersonalityMode)}
                      >
                        <option value="minimal">Minimal Mode</option>
                        <option value="professional">Professional Mode</option>
                        <option value="dynamic">Dynamic AI Mode</option>
                      </select>
                    </Field>
                  </div>
                  <div className="jp-settings-actions"><Link className="btn btn-secondary" to={user?.role === "candidate" ? "/app/profile" : "/profile/nadia.mensah"}>{t("settingsPage.openProfile")}</Link></div>
                </section>
              ) : null}
            </main>
          </section>
        </div>
      </div>
    </section>
  );
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function AvatarPreview({ src, fallbackText }: { src: string; fallbackText: string }) {
  const initial = fallbackText.trim().charAt(0).toUpperCase() || "J";
  return (
    <div style={{ width: "64px", height: "64px", borderRadius: "16px", border: "1px solid var(--border)", background: "var(--surface-alt)", overflow: "hidden", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "var(--primary-dark)" }}>
      {src ? <img src={src} alt="Profile preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initial}
    </div>
  );
}

function NotificationCard({
  title,
  values,
  keys,
  onChange
}: {
  title: string;
  values: { inApp: boolean; email: boolean };
  keys: { inApp: string; email: string };
  onChange: (changes: Record<string, boolean>) => void;
}) {
  return (
    <article className="jp-settings-notification-card">
      <strong>{title}</strong>
      <ToggleRow label="In-app" checked={values.inApp} onChange={(value) => onChange({ [keys.inApp]: value })} />
      <ToggleRow label="Email" checked={values.email} onChange={(value) => onChange({ [keys.email]: value })} />
    </article>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (next: boolean) => void }) {
  return (
    <label className="jp-toggle-row">
      <span>{label}</span>
      <button type="button" className={`jp-switch ${checked ? "is-on" : ""}`} onClick={() => onChange(!checked)} aria-pressed={checked}>
        <span className="jp-switch-thumb" />
      </button>
    </label>
  );
}

function formatEducationForBackend(education: EducationEntry[]): string {
  if (!education.length) return "";
  return education.map((entry) => `${entry.school} (${entry.degree}${entry.period ? `, ${entry.period}` : ""})`).join(" | ");
}

function getErrorMessage(error: unknown): string | null {
  if (typeof error === "object" && error && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return null;
}

function readLocalSettings() {
  try {
    const raw = localStorage.getItem("jobplus-settings-profile-v2");
    if (!raw) return {} as any;
    return JSON.parse(raw);
  } catch {
    return {} as any;
  }
}

function writeLocalSettings(value: unknown) {
  try {
    localStorage.setItem("jobplus-settings-profile-v2", JSON.stringify(value));
  } catch {
    // ignore
  }
}

function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return <div className={`field ${className}`}><label>{label}</label>{children}</div>;
}
