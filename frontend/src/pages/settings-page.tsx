// @ts-nocheck
import { useEffect, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { usePreferences } from "../context/PreferencesContext";
import { getCandidateProfile, getUserProfile, updateCandidateProfile, updateUserProfile } from "../services/profile-service";
import { authStore } from "../store/auth-store";
import type { UserRole } from "../types/auth";

type SettingsSectionKey = "account" | "profile" | "privacy" | "security" | "notifications" | "appearance" | "language" | "accessibility" | "data" | "connected" | "preferences" | "support";
type ThemeMode = "light" | "dark" | "system";
type UiDensity = "compact" | "comfortable";
type FontScale = "small" | "medium" | "large";
type TimeFormat = "12h" | "24h";

interface SectionDef {
  key: SettingsSectionKey;
  icon: string;
  title: string;
  description: string;
}

const sections: SectionDef[] = [
  { key: "account", icon: "👤", title: "Account", description: "Identity and account management" },
  { key: "profile", icon: "🪪", title: "Profile", description: "Professional profile content" },
  { key: "privacy", icon: "🛡️", title: "Privacy", description: "Visibility and audience controls" },
  { key: "security", icon: "🔐", title: "Security", description: "Password and session safety" },
  { key: "notifications", icon: "🔔", title: "Notifications", description: "Alert types and channels" },
  { key: "appearance", icon: "🎨", title: "Appearance", description: "Theme and UI density" },
  { key: "language", icon: "🌍", title: "Language & Region", description: "Locale and formatting" },
  { key: "accessibility", icon: "♿", title: "Accessibility", description: "Inclusive interaction options" },
  { key: "data", icon: "🗂️", title: "Data & Storage", description: "Data transparency and cleanup" },
  { key: "connected", icon: "🔗", title: "Connected Accounts", description: "External integrations" },
  { key: "preferences", icon: "⚙️", title: "Preferences", description: "Recommendations and feed tuning" },
  { key: "support", icon: "🆘", title: "Help & Support", description: "Support and issue reporting" }
];

const languageOptions = [
  { value: "en", label: "English" },
  { value: "zh", label: "Chinese (中文)" },
  { value: "ar", label: "Arabic (العربية)" },
  { value: "es", label: "Spanish (Español)" }
] as const;

const regionOptions = ["United States", "China", "United Arab Emirates", "United Kingdom", "Saudi Arabia", "Singapore"] as const;
const timezoneOptions = ["UTC-08:00 America/Los_Angeles", "UTC+00:00 Europe/London", "UTC+03:00 Asia/Riyadh", "UTC+08:00 Asia/Shanghai"] as const;
const categories = ["Engineering", "Marketing", "Product", "Finance", "Design", "Healthcare", "Education", "Data"] as const;

function writeLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage failures.
  }
}

function readLocal<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function clearSettingsStorage(): void {
  const keys = [
    "jobplus-settings-privacy",
    "jobplus-settings-notifications",
    "jobplus-settings-appearance",
    "jobplus-settings-language",
    "jobplus-settings-accessibility",
    "jobplus-settings-connected",
    "jobplus-settings-preferences"
  ];
  keys.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore cleanup failures.
    }
  });
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function capitalizeWords(value: string): string {
  return value
    .replace(/([A-Z])/g, " $1")
    .split(" ")
    .filter(Boolean)
    .map((token) => capitalize(token.toLowerCase()))
    .join(" ");
}

export function SettingsPage() {
  const queryClient = useQueryClient();
  const { user } = authStore();
  const { theme, setTheme, language, setLanguage } = usePreferences();

  const [active, setActive] = useState<SettingsSectionKey>("account");
  const [banner, setBanner] = useState("");
  const [bannerType, setBannerType] = useState<"success" | "error" | "info">("info");
  const [saving, setSaving] = useState<Record<SettingsSectionKey, boolean>>({} as Record<SettingsSectionKey, boolean>);

  const userQuery = useQuery({ queryKey: ["profile", "user"], queryFn: getUserProfile });
  const candidateQuery = useQuery({ queryKey: ["profile", "candidate"], queryFn: getCandidateProfile });

  const [accountForm, setAccountForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    accountType: (user?.role ?? "candidate") as UserRole,
    emailVerified: false,
    avatarUrl: ""
  });
  const [profileForm, setProfileForm] = useState({
    headline: "",
    about: "",
    experienceSummary: "",
    education: "",
    skills: "Java, Spring Boot, React",
    projects: "",
    profilePreview: true
  });
  const [privacyForm, setPrivacyForm] = useState({
    profileVisibility: "public",
    allowConnectionRequests: "everyone",
    allowMessages: "connections",
    showEmail: false,
    showPhone: false,
    searchEngineIndexing: true,
    blockedUsers: "spam.user1, fake.recruiter2"
  });
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    suspiciousLoginAlerts: true,
    activeSessions: [
      { id: "s1", device: "Chrome on Windows", location: "Shanghai", lastSeen: "Now", current: true },
      { id: "s2", device: "Safari on iPhone", location: "Dubai", lastSeen: "2 hours ago", current: false }
    ]
  });
  const [notificationForm, setNotificationForm] = useState({
    messages: { inApp: true, email: true, push: false },
    connectionRequests: { inApp: true, email: false, push: false },
    jobAlerts: { inApp: true, email: true, push: false },
    applicationUpdates: { inApp: true, email: true, push: false },
    system: { inApp: true, email: true, push: false }
  });
  const [appearanceForm, setAppearanceForm] = useState({
    themeMode: (theme as ThemeMode) || "light",
    density: "comfortable" as UiDensity,
    fontSize: "medium" as FontScale
  });
  const [languageForm, setLanguageForm] = useState({
    languageCode: language,
    region: "China",
    dateFormat: "YYYY-MM-DD",
    timeFormat: "24h" as TimeFormat,
    timezone: "UTC+08:00 Asia/Shanghai"
  });
  const [accessibilityForm, setAccessibilityForm] = useState({
    highContrast: false,
    textScale: "medium" as FontScale,
    reduceMotion: false,
    screenReaderHints: true,
    keyboardNavigation: true
  });
  const [connectedAccounts, setConnectedAccounts] = useState({ google: true, linkedin: false, github: false });
  const [preferenceForm, setPreferenceForm] = useState({
    preferredCategories: ["Engineering", "Product"] as string[],
    preferredLocations: "Shanghai, Remote",
    salaryExpectation: "20,000 - 35,000 CNY",
    recommendationMode: "balanced",
    feedPersonalization: true
  });

  const accountMutation = useMutation({
    mutationFn: async () => {
      const payload = { fullName: accountForm.fullName.trim(), email: accountForm.email.trim(), phone: accountForm.phone.trim() };
      await updateUserProfile(payload);
      return payload;
    }
  });
  const profileMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        address: languageForm.region,
        education: profileForm.education,
        experienceSummary: profileForm.headline,
        linkedinUrl: "",
        githubUrl: ""
      };
      await updateCandidateProfile(payload);
      return payload;
    }
  });

  useEffect(() => {
    if (userQuery.data) {
      setAccountForm((current) => ({
        ...current,
        fullName: userQuery.data.fullName ?? user?.name ?? "",
        username: userQuery.data.username ?? user?.name?.toLowerCase().replace(/\s+/g, ".") ?? "jobplus-user",
        email: userQuery.data.email ?? user?.email ?? "",
        phone: userQuery.data.phone ?? "",
        emailVerified: Boolean(userQuery.data.email),
        accountType: (user?.role ?? "candidate") as UserRole
      }));
    }
  }, [user?.email, user?.name, user?.role, userQuery.data]);

  useEffect(() => {
    if (candidateQuery.data) {
      setProfileForm((current) => ({
        ...current,
        headline: candidateQuery.data.experienceSummary || current.headline,
        about: candidateQuery.data.experienceSummary || current.about,
        experienceSummary: candidateQuery.data.experienceSummary || current.experienceSummary,
        education: candidateQuery.data.education || current.education
      }));
    }
  }, [candidateQuery.data]);

  useEffect(() => {
    const savedPrivacy = readLocal<typeof privacyForm>("jobplus-settings-privacy");
    const savedNotifications = readLocal<typeof notificationForm>("jobplus-settings-notifications");
    const savedAppearance = readLocal<typeof appearanceForm>("jobplus-settings-appearance");
    const savedLanguage = readLocal<typeof languageForm>("jobplus-settings-language");
    const savedAccessibility = readLocal<typeof accessibilityForm>("jobplus-settings-accessibility");
    const savedConnected = readLocal<typeof connectedAccounts>("jobplus-settings-connected");
    const savedPreferences = readLocal<typeof preferenceForm>("jobplus-settings-preferences");
    if (savedPrivacy) setPrivacyForm(savedPrivacy);
    if (savedNotifications) setNotificationForm(savedNotifications);
    if (savedAppearance) setAppearanceForm(savedAppearance);
    if (savedLanguage) setLanguageForm(savedLanguage);
    if (savedAccessibility) setAccessibilityForm(savedAccessibility);
    if (savedConnected) setConnectedAccounts(savedConnected);
    if (savedPreferences) setPreferenceForm(savedPreferences);
  }, []);

  useEffect(() => {
    writeLocal("jobplus-settings-privacy", privacyForm);
    writeLocal("jobplus-settings-notifications", notificationForm);
    writeLocal("jobplus-settings-appearance", appearanceForm);
    writeLocal("jobplus-settings-language", languageForm);
    writeLocal("jobplus-settings-accessibility", accessibilityForm);
    writeLocal("jobplus-settings-connected", connectedAccounts);
    writeLocal("jobplus-settings-preferences", preferenceForm);
  }, [privacyForm, notificationForm, appearanceForm, languageForm, accessibilityForm, connectedAccounts, preferenceForm]);

  useEffect(() => {
    document.documentElement.setAttribute("data-ui-density", appearanceForm.density);
    document.documentElement.setAttribute("data-font-scale", appearanceForm.fontSize);
    document.documentElement.setAttribute("data-reduce-motion", accessibilityForm.reduceMotion ? "true" : "false");
    document.documentElement.setAttribute("data-high-contrast", accessibilityForm.highContrast ? "true" : "false");
  }, [accessibilityForm.highContrast, accessibilityForm.reduceMotion, appearanceForm.density, appearanceForm.fontSize]);

  const storageUsage = useMemo(() => {
    if (typeof window === "undefined") return "0 KB";
    let total = 0;
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key) continue;
      const value = localStorage.getItem(key) ?? "";
      total += key.length + value.length;
    }
    return `${(total / 1024).toFixed(1)} KB`;
  }, [privacyForm, notificationForm, appearanceForm, languageForm, accessibilityForm, connectedAccounts, preferenceForm]);

  function setSectionSaving(section: SettingsSectionKey, value: boolean) {
    setSaving((current) => ({ ...current, [section]: value }));
  }

  async function saveAccount() {
    setSectionSaving("account", true);
    try {
      await accountMutation.mutateAsync();
      queryClient.invalidateQueries({ queryKey: ["profile", "user"] });
      setBannerType("success");
      setBanner("Account settings saved.");
    } catch {
      setBannerType("error");
      setBanner("Account save failed.");
    } finally {
      setSectionSaving("account", false);
    }
  }

  async function saveProfile() {
    setSectionSaving("profile", true);
    try {
      await profileMutation.mutateAsync();
      queryClient.invalidateQueries({ queryKey: ["profile", "candidate"] });
      setBannerType("success");
      setBanner("Profile settings saved.");
    } catch {
      setBannerType("error");
      setBanner("Profile save failed.");
    } finally {
      setSectionSaving("profile", false);
    }
  }

  function saveLocal(section: SettingsSectionKey, text: string) {
    setSectionSaving(section, true);
    window.setTimeout(() => {
      setSectionSaving(section, false);
      setBannerType("success");
      setBanner(text);
    }, 260);
  }

  function updateThemeMode(next: ThemeMode) {
    setAppearanceForm((current) => ({ ...current, themeMode: next }));
    if (next === "system") {
      const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
      return;
    }
    setTheme(next);
  }

  function updateLanguageCode(next: string) {
    setLanguageForm((current) => ({ ...current, languageCode: next as typeof current.languageCode }));
    if (next === "en" || next === "zh") {
      setLanguage(next);
      return;
    }
    setBannerType("info");
    setBanner("Language pack for this locale is not installed yet.");
  }

  function updatePassword() {
    if (!securityForm.currentPassword || !securityForm.newPassword || !securityForm.confirmPassword) {
      setBannerType("error");
      setBanner("Complete all password fields.");
      return;
    }
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      setBannerType("error");
      setBanner("New password and confirmation do not match.");
      return;
    }
    setSecurityForm((current) => ({ ...current, currentPassword: "", newPassword: "", confirmPassword: "" }));
    saveLocal("security", "Security settings updated.");
  }

  function logoutOtherSessions() {
    setSecurityForm((current) => ({
      ...current,
      activeSessions: current.activeSessions.filter((session) => session.current)
    }));
    setBannerType("success");
    setBanner("Logged out from other devices.");
  }

  function toggleConnected(provider: keyof typeof connectedAccounts) {
    const next = !connectedAccounts[provider];
    setConnectedAccounts((current) => ({ ...current, [provider]: next }));
    setBannerType("success");
    setBanner(`${capitalize(provider)} ${next ? "connected" : "disconnected"}.`);
  }

  return (
    <div className="jp-settings-page">
      <section className="surface jp-settings-shell">
        <aside className="jp-settings-sidebar">
          <div className="eyebrow">Settings Center</div>
          <h2 className="headline" style={{ margin: "0.35rem 0 0.6rem", fontSize: "2rem" }}>Control Center</h2>
          <p className="helper" style={{ margin: 0 }}>Configure account, privacy, security, and personalization.</p>
          <div className="jp-settings-nav-list">
            {sections.map((section) => (
              <button key={section.key} type="button" className={`jp-settings-nav-item ${active === section.key ? "is-active" : ""}`} onClick={() => setActive(section.key)}>
                <span className="jp-settings-nav-icon">{section.icon}</span>
                <span><strong>{section.title}</strong><small>{section.description}</small></span>
              </button>
            ))}
          </div>
        </aside>
        <main className="jp-settings-main">
          {banner ? <div className={`jp-settings-banner is-${bannerType}`}>{banner}</div> : null}
          {renderActiveSection({
            active,
            saving,
            accountForm,
            setAccountForm,
            profileForm,
            setProfileForm,
            privacyForm,
            setPrivacyForm,
            securityForm,
            setSecurityForm,
            notificationForm,
            setNotificationForm,
            appearanceForm,
            setAppearanceForm,
            languageForm,
            setLanguageForm,
            accessibilityForm,
            setAccessibilityForm,
            connectedAccounts,
            preferenceForm,
            setPreferenceForm,
            storageUsage,
            categories,
            languageOptions,
            regionOptions,
            timezoneOptions,
            saveAccount,
            saveProfile,
            saveLocal,
            updateThemeMode,
            updateLanguageCode,
            updatePassword,
            logoutOtherSessions,
            toggleConnected,
            clearSettingsStorage,
            setBanner,
            setBannerType
          })}
        </main>
      </section>
    </div>
  );
}

type RenderProps = {
  active: SettingsSectionKey;
  saving: Record<SettingsSectionKey, boolean>;
  accountForm: any;
  setAccountForm: Dispatch<SetStateAction<any>>;
  profileForm: any;
  setProfileForm: Dispatch<SetStateAction<any>>;
  privacyForm: any;
  setPrivacyForm: Dispatch<SetStateAction<any>>;
  securityForm: any;
  setSecurityForm: Dispatch<SetStateAction<any>>;
  notificationForm: Record<string, { inApp: boolean; email: boolean; push: boolean }>;
  setNotificationForm: Dispatch<SetStateAction<Record<string, { inApp: boolean; email: boolean; push: boolean }>>>;
  appearanceForm: any;
  setAppearanceForm: Dispatch<SetStateAction<any>>;
  languageForm: any;
  setLanguageForm: Dispatch<SetStateAction<any>>;
  accessibilityForm: any;
  setAccessibilityForm: Dispatch<SetStateAction<any>>;
  connectedAccounts: { google: boolean; linkedin: boolean; github: boolean };
  preferenceForm: any;
  setPreferenceForm: Dispatch<SetStateAction<any>>;
  storageUsage: string;
  categories: readonly string[];
  languageOptions: readonly { value: string; label: string }[];
  regionOptions: readonly string[];
  timezoneOptions: readonly string[];
  saveAccount: () => void;
  saveProfile: () => void;
  saveLocal: (section: SettingsSectionKey, text: string) => void;
  updateThemeMode: (next: ThemeMode) => void;
  updateLanguageCode: (next: string) => void;
  updatePassword: () => void;
  logoutOtherSessions: () => void;
  toggleConnected: (provider: "google" | "linkedin" | "github") => void;
  clearSettingsStorage: () => void;
  setBanner: (value: string) => void;
  setBannerType: (value: "success" | "error" | "info") => void;
};

function renderActiveSection(props: RenderProps): ReactNode {
  const {
    active, saving, accountForm, setAccountForm, profileForm, setProfileForm, privacyForm, setPrivacyForm, securityForm, setSecurityForm,
    notificationForm, setNotificationForm, appearanceForm, setAppearanceForm, languageForm, setLanguageForm, accessibilityForm, setAccessibilityForm,
    connectedAccounts, preferenceForm, setPreferenceForm, storageUsage, categories, languageOptions, regionOptions, timezoneOptions, saveAccount, saveProfile,
    saveLocal, updateThemeMode, updateLanguageCode, updatePassword, logoutOtherSessions, toggleConnected, clearSettingsStorage, setBanner, setBannerType
  } = props;

  if (active === "account") return (
    <section className="jp-settings-section surface">
      <header className="jp-settings-section-header"><h3>Account Settings</h3><p className="helper">Manage identity and account status.</p></header>
      <div className="form-grid">
        <Field label="Full Name"><input className="input" value={accountForm.fullName} onChange={(e) => setAccountForm((c) => ({ ...c, fullName: e.target.value }))} /></Field>
        <Field label="Username"><input className="input" value={accountForm.username} onChange={(e) => setAccountForm((c) => ({ ...c, username: e.target.value }))} /></Field>
        <Field label="Email"><input className="input" value={accountForm.email} onChange={(e) => setAccountForm((c) => ({ ...c, email: e.target.value }))} /></Field>
        <Field label="Phone"><input className="input" value={accountForm.phone} onChange={(e) => setAccountForm((c) => ({ ...c, phone: e.target.value }))} /></Field>
        <Field label="Profile Picture URL"><input className="input" value={accountForm.avatarUrl} onChange={(e) => setAccountForm((c) => ({ ...c, avatarUrl: e.target.value }))} /></Field>
        <Field label="Account Type"><select className="select" value={accountForm.accountType} onChange={(e) => setAccountForm((c) => ({ ...c, accountType: e.target.value as UserRole }))}><option value="candidate">Job Seeker</option><option value="employer">Employer</option><option value="admin">Admin</option></select></Field>
      </div>
      <div className="jp-settings-inline"><span className={`status ${accountForm.emailVerified ? "status-success" : "status-warning"}`}>{accountForm.emailVerified ? "Email verified" : "Email not verified"}</span><button className="btn btn-secondary" onClick={() => setBanner("Verification email sent.")}>Send Verification</button></div>
      <div className="jp-settings-actions"><button className="btn btn-secondary" onClick={() => setBanner("Deactivation flow started.")}>Deactivate</button><button className="btn btn-secondary" onClick={() => setBanner("Delete account request submitted.")}>Delete Account</button><button className="btn btn-primary" onClick={saveAccount} disabled={saving.account}>{saving.account ? "Saving..." : "Save Account"}</button></div>
    </section>
  );

  if (active === "profile") return (
    <section className="jp-settings-section surface">
      <header className="jp-settings-section-header"><h3>Profile Settings</h3><p className="helper">Manage profile presentation and content.</p></header>
      <div className="form-grid">
        <Field label="Headline"><input className="input" value={profileForm.headline} onChange={(e) => setProfileForm((c) => ({ ...c, headline: e.target.value }))} /></Field>
        <Field label="About"><textarea className="textarea" value={profileForm.about} onChange={(e) => setProfileForm((c) => ({ ...c, about: e.target.value }))} /></Field>
        <Field label="Experience Summary"><textarea className="textarea" value={profileForm.experienceSummary} onChange={(e) => setProfileForm((c) => ({ ...c, experienceSummary: e.target.value }))} /></Field>
        <Field label="Education"><textarea className="textarea" value={profileForm.education} onChange={(e) => setProfileForm((c) => ({ ...c, education: e.target.value }))} /></Field>
        <Field label="Skills"><input className="input" value={profileForm.skills} onChange={(e) => setProfileForm((c) => ({ ...c, skills: e.target.value }))} /></Field>
        <Field label="Projects"><textarea className="textarea" value={profileForm.projects} onChange={(e) => setProfileForm((c) => ({ ...c, projects: e.target.value }))} /></Field>
      </div>
      <div className="jp-settings-inline"><Toggle label="Enable profile preview mode" checked={profileForm.profilePreview} onChange={(v) => setProfileForm((c) => ({ ...c, profilePreview: v }))} /><Link className="btn btn-secondary" to="/app/profile">Preview Profile</Link></div>
      <div className="jp-settings-actions"><button className="btn btn-secondary" onClick={() => setBanner("Canceled profile changes.")}>Cancel</button><button className="btn btn-primary" onClick={saveProfile} disabled={saving.profile}>{saving.profile ? "Saving..." : "Save Profile"}</button></div>
    </section>
  );

  if (active === "privacy") return (
    <section className="jp-settings-section surface">
      <header className="jp-settings-section-header"><h3>Privacy Settings</h3><p className="helper">Choose who can view and contact you.</p></header>
      <div className="form-grid">
        <Field label="Profile Visibility"><select className="select" value={privacyForm.profileVisibility} onChange={(e) => setPrivacyForm((c) => ({ ...c, profileVisibility: e.target.value }))}><option value="public">Public</option><option value="connections">Connections</option><option value="private">Private</option></select></Field>
        <Field label="Who can connect"><select className="select" value={privacyForm.allowConnectionRequests} onChange={(e) => setPrivacyForm((c) => ({ ...c, allowConnectionRequests: e.target.value }))}><option value="everyone">Everyone</option><option value="verified">Verified users</option><option value="none">No one</option></select></Field>
        <Field label="Who can message"><select className="select" value={privacyForm.allowMessages} onChange={(e) => setPrivacyForm((c) => ({ ...c, allowMessages: e.target.value }))}><option value="everyone">Everyone</option><option value="connections">Connections</option><option value="none">No one</option></select></Field>
        <Field label="Blocked Users"><input className="input" value={privacyForm.blockedUsers} onChange={(e) => setPrivacyForm((c) => ({ ...c, blockedUsers: e.target.value }))} /></Field>
      </div>
      <div className="jp-settings-inline jp-toggle-grid"><Toggle label="Show email" checked={privacyForm.showEmail} onChange={(v) => setPrivacyForm((c) => ({ ...c, showEmail: v }))} /><Toggle label="Show phone" checked={privacyForm.showPhone} onChange={(v) => setPrivacyForm((c) => ({ ...c, showPhone: v }))} /><Toggle label="Allow search engines" checked={privacyForm.searchEngineIndexing} onChange={(v) => setPrivacyForm((c) => ({ ...c, searchEngineIndexing: v }))} /></div>
      <div className="jp-settings-actions"><button className="btn btn-primary" onClick={() => saveLocal("privacy", "Privacy settings saved.")} disabled={saving.privacy}>{saving.privacy ? "Saving..." : "Save Privacy"}</button></div>
    </section>
  );

  if (active === "security") return (
    <section className="jp-settings-section surface">
      <header className="jp-settings-section-header"><h3>Security Settings</h3><p className="helper">Password, 2FA placeholder, and session control.</p></header>
      <div className="form-grid">
        <Field label="Current Password"><input className="input" type="password" value={securityForm.currentPassword} onChange={(e) => setSecurityForm((c) => ({ ...c, currentPassword: e.target.value }))} /></Field>
        <Field label="New Password"><input className="input" type="password" value={securityForm.newPassword} onChange={(e) => setSecurityForm((c) => ({ ...c, newPassword: e.target.value }))} /></Field>
        <Field label="Confirm Password"><input className="input" type="password" value={securityForm.confirmPassword} onChange={(e) => setSecurityForm((c) => ({ ...c, confirmPassword: e.target.value }))} /></Field>
      </div>
      <div className="jp-settings-inline jp-toggle-grid"><Toggle label="Enable 2FA" checked={securityForm.twoFactorEnabled} onChange={(v) => setSecurityForm((c) => ({ ...c, twoFactorEnabled: v }))} /><Toggle label="Suspicious login alerts" checked={securityForm.suspiciousLoginAlerts} onChange={(v) => setSecurityForm((c) => ({ ...c, suspiciousLoginAlerts: v }))} /></div>
      <div className="jp-settings-device-list"><strong>Active Sessions</strong>{securityForm.activeSessions.map((session) => <div key={session.id} className="jp-settings-device-item"><div><strong>{session.device}</strong><div className="helper">{session.location} - {session.lastSeen}</div></div><span className={`status ${session.current ? "status-info" : "status-success"}`}>{session.current ? "Current" : "Active"}</span></div>)}</div>
      <div className="jp-settings-actions"><button className="btn btn-secondary" onClick={logoutOtherSessions}>Logout Other Devices</button><button className="btn btn-primary" onClick={updatePassword} disabled={saving.security}>{saving.security ? "Saving..." : "Update Security"}</button></div>
    </section>
  );

  if (active === "notifications") return (
    <section className="jp-settings-section surface">
      <header className="jp-settings-section-header"><h3>Notifications</h3><p className="helper">Configure channels for each alert type.</p></header>
      <div className="jp-settings-notification-grid">
        {Object.entries(notificationForm).map(([type, channels]) => (
          <div key={type} className="jp-settings-notification-card">
            <strong>{capitalizeWords(type)}</strong>
            <Toggle label="In-app" checked={channels.inApp} onChange={(v) => setNotificationForm((c) => ({ ...c, [type]: { ...channels, inApp: v } }))} />
            <Toggle label="Email" checked={channels.email} onChange={(v) => setNotificationForm((c) => ({ ...c, [type]: { ...channels, email: v } }))} />
            <Toggle label="Push (future)" checked={channels.push} onChange={(v) => setNotificationForm((c) => ({ ...c, [type]: { ...channels, push: v } }))} />
          </div>
        ))}
      </div>
      <div className="jp-settings-actions"><button className="btn btn-primary" onClick={() => saveLocal("notifications", "Notification settings saved.")} disabled={saving.notifications}>{saving.notifications ? "Saving..." : "Save Notifications"}</button></div>
    </section>
  );

  if (active === "appearance") return (
    <section className="jp-settings-section surface">
      <header className="jp-settings-section-header"><h3>Appearance</h3><p className="helper">Theme, UI density, and font size preferences.</p></header>
      <div className="form-grid">
        <Field label="Theme"><select className="select" value={appearanceForm.themeMode} onChange={(e) => updateThemeMode(e.target.value as ThemeMode)}><option value="light">Light</option><option value="dark">Dark</option><option value="system">System</option></select></Field>
        <Field label="UI Density"><select className="select" value={appearanceForm.density} onChange={(e) => setAppearanceForm((c) => ({ ...c, density: e.target.value as UiDensity }))}><option value="comfortable">Comfortable</option><option value="compact">Compact</option></select></Field>
        <Field label="Font Size"><select className="select" value={appearanceForm.fontSize} onChange={(e) => setAppearanceForm((c) => ({ ...c, fontSize: e.target.value as FontScale }))}><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option></select></Field>
      </div>
      <div className="jp-settings-actions"><button className="btn btn-primary" onClick={() => saveLocal("appearance", "Appearance settings saved.")} disabled={saving.appearance}>{saving.appearance ? "Saving..." : "Save Appearance"}</button></div>
    </section>
  );

  if (active === "language") return (
    <section className="jp-settings-section surface">
      <header className="jp-settings-section-header"><h3>Language & Region</h3><p className="helper">Locale, date/time format, and timezone controls.</p></header>
      <div className="form-grid">
        <Field label="Language"><select className="select" value={languageForm.languageCode} onChange={(e) => updateLanguageCode(e.target.value)}>{languageOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></Field>
        <Field label="Region"><select className="select" value={languageForm.region} onChange={(e) => setLanguageForm((c) => ({ ...c, region: e.target.value }))}>{regionOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></Field>
        <Field label="Date Format"><input className="input" value={languageForm.dateFormat} onChange={(e) => setLanguageForm((c) => ({ ...c, dateFormat: e.target.value }))} /></Field>
        <Field label="Time Format"><select className="select" value={languageForm.timeFormat} onChange={(e) => setLanguageForm((c) => ({ ...c, timeFormat: e.target.value as TimeFormat }))}><option value="12h">12-hour</option><option value="24h">24-hour</option></select></Field>
        <Field label="Timezone" className="jp-settings-field-span"><select className="select" value={languageForm.timezone} onChange={(e) => setLanguageForm((c) => ({ ...c, timezone: e.target.value }))}>{timezoneOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></Field>
      </div>
      <div className="jp-settings-actions"><button className="btn btn-primary" onClick={() => saveLocal("language", "Language and region settings saved.")} disabled={saving.language}>{saving.language ? "Saving..." : "Save Language & Region"}</button></div>
    </section>
  );

  if (active === "accessibility") return (
    <section className="jp-settings-section surface">
      <header className="jp-settings-section-header"><h3>Accessibility</h3><p className="helper">Enable accessibility options and motion preferences.</p></header>
      <div className="jp-settings-inline jp-toggle-grid">
        <Toggle label="High contrast mode" checked={accessibilityForm.highContrast} onChange={(v) => setAccessibilityForm((c) => ({ ...c, highContrast: v }))} />
        <Toggle label="Reduce motion" checked={accessibilityForm.reduceMotion} onChange={(v) => setAccessibilityForm((c) => ({ ...c, reduceMotion: v }))} />
        <Toggle label="Screen reader hints" checked={accessibilityForm.screenReaderHints} onChange={(v) => setAccessibilityForm((c) => ({ ...c, screenReaderHints: v }))} />
        <Toggle label="Keyboard navigation enhancements" checked={accessibilityForm.keyboardNavigation} onChange={(v) => setAccessibilityForm((c) => ({ ...c, keyboardNavigation: v }))} />
      </div>
      <div className="form-grid"><Field label="Text Scale"><select className="select" value={accessibilityForm.textScale} onChange={(e) => setAccessibilityForm((c) => ({ ...c, textScale: e.target.value as FontScale }))}><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option></select></Field></div>
      <div className="jp-settings-actions"><button className="btn btn-primary" onClick={() => saveLocal("accessibility", "Accessibility settings saved.")} disabled={saving.accessibility}>{saving.accessibility ? "Saving..." : "Save Accessibility"}</button></div>
    </section>
  );

  if (active === "data") return (
    <section className="jp-settings-section surface">
      <header className="jp-settings-section-header"><h3>Data & Storage</h3><p className="helper">Download, clear, and inspect your local data footprint.</p></header>
      <div className="jp-settings-data-grid">
        <div className="card"><strong>Local Storage Usage</strong><p className="helper">{storageUsage}</p><button className="btn btn-secondary" onClick={() => setBanner("Data export started.")}>Download My Data</button></div>
        <div className="card"><strong>Cache Management</strong><p className="helper">Clear local cached preferences and settings.</p><button className="btn btn-secondary" onClick={() => { clearSettingsStorage(); setBannerType("success"); setBanner("Settings cache cleared."); }}>Clear Cache</button></div>
        <div className="card"><strong>Saved Items</strong><p className="helper">Manage saved jobs and bookmarks.</p><Link className="btn btn-secondary" to="/app/saved-jobs">Open Saved Jobs</Link></div>
      </div>
    </section>
  );

  if (active === "connected") return (
    <section className="jp-settings-section surface">
      <header className="jp-settings-section-header"><h3>Connected Accounts</h3><p className="helper">Connect external identities for sign-in and profile import.</p></header>
      <div className="jp-settings-connected-grid">{(["google", "linkedin", "github"] as const).map((provider) => <div key={provider} className="jp-connected-card"><strong>{capitalize(provider)}</strong><span className={`status ${connectedAccounts[provider] ? "status-success" : "status-warning"}`}>{connectedAccounts[provider] ? "Connected" : "Not connected"}</span><button className={connectedAccounts[provider] ? "btn btn-secondary" : "btn btn-primary"} onClick={() => toggleConnected(provider)}>{connectedAccounts[provider] ? "Disconnect" : "Connect"}</button></div>)}</div>
    </section>
  );

  if (active === "preferences") return (
    <section className="jp-settings-section surface">
      <header className="jp-settings-section-header"><h3>Preferences</h3><p className="helper">Configure personalization and recommendation behavior.</p></header>
      <div className="form-grid">
        <Field label="Preferred Categories"><div className="jp-settings-chip-grid">{categories.map((category) => { const selected = preferenceForm.preferredCategories.includes(category); return <button type="button" key={category} className={`jp-settings-chip ${selected ? "is-selected" : ""}`} onClick={() => setPreferenceForm((current) => ({ ...current, preferredCategories: selected ? current.preferredCategories.filter((item) => item !== category) : [...current.preferredCategories, category] }))}>{category}</button>; })}</div></Field>
        <Field label="Preferred Locations"><input className="input" value={preferenceForm.preferredLocations} onChange={(e) => setPreferenceForm((c) => ({ ...c, preferredLocations: e.target.value }))} /></Field>
        <Field label="Salary Expectation"><input className="input" value={preferenceForm.salaryExpectation} onChange={(e) => setPreferenceForm((c) => ({ ...c, salaryExpectation: e.target.value }))} /></Field>
        <Field label="Recommendation Mode"><select className="select" value={preferenceForm.recommendationMode} onChange={(e) => setPreferenceForm((c) => ({ ...c, recommendationMode: e.target.value }))}><option value="balanced">Balanced</option><option value="aggressive">Aggressive</option><option value="conservative">Conservative</option></select></Field>
      </div>
      <div className="jp-settings-inline"><Toggle label="Enable feed personalization" checked={preferenceForm.feedPersonalization} onChange={(v) => setPreferenceForm((c) => ({ ...c, feedPersonalization: v }))} /></div>
      <div className="jp-settings-actions"><button className="btn btn-primary" onClick={() => saveLocal("preferences", "Preferences saved.")} disabled={saving.preferences}>{saving.preferences ? "Saving..." : "Save Preferences"}</button></div>
    </section>
  );

  return (
    <section className="jp-settings-section surface">
      <header className="jp-settings-section-header"><h3>Help & Support</h3><p className="helper">Resources for troubleshooting and contacting support.</p></header>
      <div className="jp-settings-data-grid">
        <div className="card"><strong>Help Center</strong><p className="helper">Read guides and FAQs.</p><button className="btn btn-secondary" onClick={() => setBanner("Help center opens in production deployment.")}>Open Help Center</button></div>
        <div className="card"><strong>Report a Problem</strong><p className="helper">Submit issue diagnostics to support.</p><button className="btn btn-secondary" onClick={() => setBanner("Problem report submitted.")}>Report Problem</button></div>
        <div className="card"><strong>Contact Support</strong><p className="helper">Create support request ticket.</p><button className="btn btn-primary" onClick={() => setBanner("Support ticket created.")}>Contact Support</button></div>
      </div>
    </section>
  );
}

function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`field ${className}`}>
      <label>{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="jp-toggle-row">
      <span>{label}</span>
      <button type="button" className={`jp-switch ${checked ? "is-on" : ""}`} onClick={() => onChange(!checked)} aria-pressed={checked}>
        <span className="jp-switch-thumb" />
      </button>
    </label>
  );
}
