import { useMemo, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ProfilePageSkeleton } from "../components/shared/content-skeletons";
import { EmptyState } from "../components/shared/empty-state";
import { getMyCompany } from "../services/companies-service";
import { listEmployerJobs } from "../services/jobs-service";
import { getCandidateProfile, getUserProfile, updateCandidateProfile, updateUserProfile } from "../services/profile-service";
import { authStore } from "../store/auth-store";

type ActivityTab = "posts" | "articles" | "media" | "likes";
type ConnectState = "connect" | "pending" | "connected";
type SkillItem = { name: string; endorsements: number };
type ExperienceItem = { id: number; role: string; company: string; period: string; location: string; type: string; description: string; logo: string };
type EducationItem = { id: number; school: string; degree: string; field: string; period: string; logo: string };

const suggestions = [
  { id: 1, username: "nadia.mensah", name: "Nadia Mensah", title: "Engineering Manager", company: "JobPlus Labs", location: "Shanghai", skills: ["React", "Leadership"], mutual: 8, avatar: "https://i.pravatar.cc/120?img=44" },
  { id: 2, username: "amina.yusuf", name: "Amina Yusuf", title: "Backend Developer", company: "TalentFlow", location: "Shanghai", skills: ["Java", "Spring Boot"], mutual: 6, avatar: "https://i.pravatar.cc/120?img=15" },
  { id: 3, username: "omar.faris", name: "Omar Faris", title: "Product Engineer", company: "Nova Works", location: "Dubai", skills: ["TypeScript", "React"], mutual: 4, avatar: "https://i.pravatar.cc/120?img=12" }
];

const activitySeed = [
  { id: 1, type: "posts", title: "Building reliable full-stack interview projects", preview: "Shipped complete role-aware candidate/employer/admin workflows for JobPlus.", date: "2 days ago", engagement: 182 },
  { id: 2, type: "articles", title: "How to structure MyBatis in modular teams", preview: "Practical mapper ownership and scalable service boundaries for team projects.", date: "1 week ago", engagement: 93 },
  { id: 3, type: "media", title: "New profile and hiring dashboard preview", preview: "Updated UI and interaction system for a more professional product experience.", date: "3 days ago", engagement: 121 },
  { id: 4, type: "likes", title: "React performance in data-heavy dashboards", preview: "Optimistic updates and proper cache invalidation keep interfaces responsive.", date: "5 days ago", engagement: 76 }
];

export function ProfilePage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { user } = authStore();
  const params = useParams<{ username?: string }>();
  const [searchParams] = useSearchParams();
  const requestedUser = (params.username ?? searchParams.get("user") ?? "").trim().toLowerCase();
  const viewingOwn = searchParams.get("view") !== "public" && !requestedUser;

  const userQuery = useQuery({ queryKey: ["profile", "user"], queryFn: getUserProfile, enabled: viewingOwn });
  const candidateQuery = useQuery({ queryKey: ["profile", "candidate"], queryFn: getCandidateProfile, enabled: viewingOwn });
  const companyQuery = useQuery({ queryKey: ["companies", "my-profile-company"], queryFn: getMyCompany, enabled: viewingOwn && user?.role === "employer" });
  const employerJobsQuery = useQuery({ queryKey: ["jobs", "my-profile-company"], queryFn: listEmployerJobs, enabled: viewingOwn && user?.role === "employer" });

  const [tab, setTab] = useState<ActivityTab>("posts");
  const [banner, setBanner] = useState("");
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [connectState, setConnectState] = useState<ConnectState>("connect");
  const [followed, setFollowed] = useState(false);
  const [messageDraft, setMessageDraft] = useState("");
  const [offerPower, setOfferPower] = useState(81);
  const [snapshotOpen, setSnapshotOpen] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [aboutEditOpen, setAboutEditOpen] = useState(false);
  const [eduOpen, setEduOpen] = useState(false);
  const [expOpen, setExpOpen] = useState(false);
  const [skillOpen, setSkillOpen] = useState(false);
  const [editingEduId, setEditingEduId] = useState<number | null>(null);
  const [editingExpId, setEditingExpId] = useState<number | null>(null);
  const [editingSkillName, setEditingSkillName] = useState<string | null>(null);
  const [profileDraft, setProfileDraft] = useState({ fullName: "", title: "", company: "", location: "", industry: "" });
  const [aboutOverride, setAboutOverride] = useState<string | null>(null);
  const [aboutDraft, setAboutDraft] = useState("");
  const [eduDraft, setEduDraft] = useState<Omit<EducationItem, "id">>({ school: "", degree: "", field: "", period: "", logo: "EDU" });
  const [expDraft, setExpDraft] = useState<Omit<ExperienceItem, "id">>({ role: "", company: "", period: "", location: "", type: "", description: "", logo: "EXP" });
  const [skillDraft, setSkillDraft] = useState<SkillItem>({ name: "", endorsements: 1 });

  const [expItems, setExpItems] = useState<ExperienceItem[]>([{ id: 1, role: "Full Stack Developer", company: "JobPlus Labs", period: "2025 - Present", location: "Shanghai", type: "Full-time", description: "Building role-aware hiring modules and polished frontend UX.", logo: "DEV" }]);
  const [eduItems, setEduItems] = useState<EducationItem[]>([{ id: 1, school: "University of Applied Software Engineering", degree: "Bachelor", field: "Software Engineering", period: "2022 - 2026", logo: "EDU" }]);
  const [skillItems, setSkillItems] = useState<SkillItem[]>([{ name: "Java", endorsements: 46 }, { name: "Spring Boot", endorsements: 39 }, { name: "React", endorsements: 34 }, { name: "TypeScript", endorsements: 21 }]);

  const publicProfile = useMemo(() => suggestions.find((x) => x.username === requestedUser), [requestedUser]);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const settingsPath = user?.role === "employer" ? "/employer/settings" : "/app/settings";

  const identity = useMemo(() => {
    if (!viewingOwn) {
      if (publicProfile) return { fullName: publicProfile.name, username: publicProfile.username, title: publicProfile.title, company: publicProfile.company, location: publicProfile.location, industry: "Technology", followers: 1200, connections: 520, avatar: publicProfile.avatar };
      return { fullName: "Community Member", username: requestedUser || "unknown", title: "Professional on JobPlus", company: "JobPlus Network", location: "Global", industry: "Technology", followers: 0, connections: 0, avatar: "" };
    }
    return {
      fullName: overrides.fullName ?? userQuery.data?.fullName ?? user?.name ?? "Your Name",
      username: userQuery.data?.username ?? "jobplus-user",
      title: overrides.title ?? candidateQuery.data?.experienceSummary?.slice(0, 80) ?? user?.title ?? "Software Developer",
      company: overrides.company ?? user?.company ?? "JobPlus Labs",
      location: overrides.location ?? candidateQuery.data?.address ?? "Shanghai, China",
      industry: overrides.industry ?? "Technology",
      followers: 1320,
      connections: 684,
      avatar: candidateQuery.data?.avatarUrl ?? ""
    };
  }, [candidateQuery.data?.address, candidateQuery.data?.avatarUrl, candidateQuery.data?.experienceSummary, overrides, publicProfile, requestedUser, user?.company, user?.name, user?.title, userQuery.data?.fullName, userQuery.data?.username, viewingOwn]);

  const aboutText = aboutOverride ?? candidateQuery.data?.experienceSummary ?? "Passionate developer focused on product quality, hiring workflows, and clean architecture.";
  const profileConversion = useMemo(() => {
    const completenessSignals = [
      Boolean(identity.fullName),
      Boolean(identity.title),
      Boolean(aboutText && aboutText.length > 60),
      skillItems.length > 0,
      expItems.length > 0,
      eduItems.length > 0
    ];
    const completeness = Math.round((completenessSignals.filter(Boolean).length / completenessSignals.length) * 100);
    const engagement = Math.min(100, 40 + skillItems.reduce((sum, item) => sum + item.endorsements, 0) / 6);
    const recruiterResponse = connectState === "connected" ? 76 : connectState === "pending" ? 58 : 46;
    const score = Math.round(completeness * 0.4 + engagement * 0.3 + recruiterResponse * 0.3);
    const fixes = [
      !aboutText || aboutText.length < 80 ? "Expand your About section with measurable impact." : null,
      skillItems.length < 5 ? "Add at least 2 role-critical skills for stronger matching." : null,
      expItems.length < 2 ? "Add one more recent experience entry to improve recruiter confidence." : null
    ].filter(Boolean) as string[];
    return { score, completeness, engagement: Math.round(engagement), recruiterResponse, fixes };
  }, [identity.fullName, identity.title, aboutText, skillItems, expItems, eduItems, connectState]);
  const loading = viewingOwn && (userQuery.isLoading || candidateQuery.isLoading || companyQuery.isLoading || employerJobsQuery.isLoading);

  const profileMutation = useMutation({
    mutationFn: async (value: typeof profileDraft) => {
      await updateUserProfile({ fullName: value.fullName, email: userQuery.data?.email ?? user?.email ?? "user@jobplus.app", phone: userQuery.data?.phone ?? "" });
      await updateCandidateProfile({ address: value.location, education: candidateQuery.data?.education ?? "", experienceSummary: value.title, linkedinUrl: candidateQuery.data?.linkedinUrl ?? "", githubUrl: candidateQuery.data?.githubUrl ?? "" });
      return value;
    },
    onSuccess: (value) => {
      setOverrides((current) => ({ ...current, ...value }));
      queryClient.invalidateQueries({ queryKey: ["profile", "user"] });
      queryClient.invalidateQueries({ queryKey: ["profile", "candidate"] });
      setProfileEditOpen(false);
      setBanner("Profile details updated.");
    },
    onError: () => setBanner("Profile update failed.")
  });

  const aboutMutation = useMutation({
    mutationFn: async (text: string) => updateCandidateProfile({ address: candidateQuery.data?.address ?? "", education: candidateQuery.data?.education ?? "", experienceSummary: text, linkedinUrl: candidateQuery.data?.linkedinUrl ?? "", githubUrl: candidateQuery.data?.githubUrl ?? "" }),
    onSuccess: () => {
      setAboutOverride(aboutDraft.trim());
      setAboutEditOpen(false);
      setBanner("About section updated.");
    },
    onError: () => setBanner("Unable to save About.")
  });

  function saveProfile() {
    const value = { ...profileDraft, fullName: profileDraft.fullName.trim(), title: profileDraft.title.trim(), company: profileDraft.company.trim(), location: profileDraft.location.trim(), industry: profileDraft.industry.trim() };
    if (!value.fullName || !value.title) return setBanner(t("profilePage.banner.nameTitleRequired"));
    profileMutation.mutate(value);
    if (aboutDraft.trim() && aboutDraft.trim() !== aboutText.trim()) {
      aboutMutation.mutate(aboutDraft.trim());
    }
  }
  function cycleConnect(value: ConnectState): ConnectState { return value === "connect" ? "pending" : "connected"; }
  function openProfileEditor() { setProfileDraft({ fullName: identity.fullName, title: identity.title, company: identity.company, location: identity.location, industry: identity.industry }); setAboutDraft(aboutText); setProfileEditOpen(true); }
  function openAboutEditor() { setAboutDraft(aboutText); setAboutEditOpen(true); }
  function clickConnect() { setConnectState((c) => { const n = cycleConnect(c); setBanner(n === "pending" ? t("profilePage.banner.connectSent") : t("profilePage.banner.connected")); return n; }); }
  function saveAbout() {
    const value = aboutDraft.trim();
    if (!value) return setBanner(t("profilePage.banner.aboutRequired"));
    aboutMutation.mutate(value);
  }

  function saveExperience() {
    const value = { ...expDraft, role: expDraft.role.trim(), company: expDraft.company.trim(), description: expDraft.description.trim() };
    if (!value.role || !value.company) return setBanner(t("profilePage.banner.roleCompanyRequired"));
    setExpItems((list) => editingExpId ? list.map((item) => (item.id === editingExpId ? { ...item, ...value } : item)) : [{ id: Date.now(), ...value }, ...list]);
    setExpOpen(false);
  }
  function saveEducation() {
    const value = { ...eduDraft, school: eduDraft.school.trim(), degree: eduDraft.degree.trim() };
    if (!value.school || !value.degree) return setBanner(t("profilePage.banner.schoolDegreeRequired"));
    setEduItems((list) => editingEduId ? list.map((item) => (item.id === editingEduId ? { ...item, ...value } : item)) : [{ id: Date.now(), ...value }, ...list]);
    setEduOpen(false);
  }
  function saveSkill() {
    const value = { name: skillDraft.name.trim(), endorsements: Math.max(1, Number(skillDraft.endorsements) || 1) };
    if (!value.name) return setBanner(t("profilePage.banner.skillRequired"));
    if (!editingSkillName && skillItems.some((s) => s.name.toLowerCase() === value.name.toLowerCase())) return setBanner(t("profilePage.banner.skillExists"));
    setSkillItems((list) => editingSkillName ? list.map((item) => (item.name === editingSkillName ? value : item)) : [value, ...list]);
    setSkillOpen(false);
  }

  return (
    <section className="section">
      <div className="container">
        <div className="jp-profile-main stack">
          {banner ? <div className="auth-note">{banner}</div> : null}
          {loading ? <ProfilePageSkeleton /> : null}

          <article className="surface jp-profile-header jp-reveal-up">
            <div className="jp-profile-cover" />
            <div className="jp-profile-header-content">
              <div className="jp-profile-avatar">{identity.avatar ? <img src={identity.avatar} alt={identity.fullName} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} /> : identity.fullName.slice(0, 1)}</div>
              <div className="jp-profile-identity stack" style={{ gap: "0.3rem" }}>
                <h1 style={{ margin: 0 }}>{identity.fullName}</h1>
                <div className="helper">{identity.title}</div>
                <div className="helper">{identity.company} • {identity.location} • {identity.industry}</div>
                <div className="row" style={{ flexWrap: "wrap", gap: "0.6rem" }}>
                  <span className="tag">{identity.followers.toLocaleString()} followers</span>
                  <span className="tag">{identity.connections.toLocaleString()} connections</span>
                </div>
              </div>
              <div className="jp-profile-actions">
                {viewingOwn ? (
                  <>
                    <button className="btn btn-primary" onClick={openProfileEditor}>Edit Profile</button>
                    <button className="btn btn-secondary" onClick={openAboutEditor}>Edit About</button>
                    <button className="btn btn-secondary" onClick={() => setContactOpen(true)}>Contact Info</button>
                    <Link className="btn btn-secondary" to={settingsPath}>Profile Settings</Link>
                  </>
                ) : (
                  <>
                    <button className={connectState === "connected" ? "btn btn-secondary" : "btn btn-primary"} onClick={clickConnect}>{connectState === "pending" ? "Pending" : connectState === "connected" ? "Connected" : "Connect"}</button>
                    <button className="btn btn-secondary" onClick={() => setFollowed((v) => !v)}>{followed ? "Following" : "Follow"}</button>
                    <button className="btn btn-secondary" onClick={() => setContactOpen(true)}>Message</button>
                  </>
                )}
              </div>
            </div>
          </article>

          <article className="surface jp-profile-card">
            <div className="space-between" style={{ alignItems: "center" }}>
              <h2 style={{ margin: 0 }}>Profile Conversion System</h2>
              <span className="pill">Score {profileConversion.score}%</span>
            </div>
            <div className="jp-conversion-bars">
              <div className="jp-conversion-row"><span>Completeness</span><strong>{profileConversion.completeness}%</strong></div>
              <div className="jp-conversion-row"><span>Engagement strength</span><strong>{profileConversion.engagement}%</strong></div>
              <div className="jp-conversion-row"><span>Recruiter response signal</span><strong>{profileConversion.recruiterResponse}%</strong></div>
            </div>
            {profileConversion.fixes.length ? (
              <ul className="jp-quality-list" style={{ marginTop: "0.6rem" }}>
                {profileConversion.fixes.map((fix) => (
                  <li key={fix}>{fix}</li>
                ))}
              </ul>
            ) : (
              <p className="helper" style={{ marginTop: "0.55rem" }}>
                Your profile is recruiter-ready. Keep momentum with targeted outreach this week.
              </p>
            )}
          </article>

          <article id="about-section" className="surface jp-profile-card jp-reveal-up"><div className="space-between"><h2 style={{ margin: 0 }}>About</h2>{viewingOwn ? <button className="btn btn-secondary" onClick={openAboutEditor}>Edit</button> : null}</div><p className="jp-profile-text">{aboutText}</p></article>

          <article className="surface jp-profile-card">
            <div className="space-between">
              <strong>Role Reality Snapshot</strong>
              <button className="btn btn-ghost" type="button" onClick={() => setSnapshotOpen((open) => !open)}>
                {snapshotOpen ? "Hide" : "Show"}
              </button>
            </div>
            {snapshotOpen ? (
              <div className="stack" style={{ gap: "0.8rem", marginTop: "1rem" }}>
                <div className="space-between">
                  <span className="helper">Job-match signal</span>
                  <strong>88%</strong>
                </div>
                <div className="space-between">
                  <span className="helper">Growth leverage</span>
                  <strong>79%</strong>
                </div>
                <div className="space-between">
                  <span className="helper">Offer momentum</span>
                  <strong>{offerPower}%</strong>
                </div>
                <div className="jp-progress-bar" style={{ marginTop: "0.5rem" }}>
                  <div className="jp-progress-fill" style={{ width: `${offerPower}%` }} />
                </div>
              </div>
            ) : null}
          </article>

          {viewingOwn && user?.role === "employer" && companyQuery.data ? (
            <article className="surface jp-profile-card">
              <div className="space-between"><h2 style={{ margin: 0 }}>Company Summary</h2><Link className="btn btn-secondary" to="/employer/company">Manage Company</Link></div>
              <div className="jp-company-summary-grid">
                <div className="jp-company-summary-brand">
                  {companyQuery.data.logoUrl ? <img src={companyQuery.data.logoUrl} alt={companyQuery.data.name} className="jp-company-summary-logo" /> : <span className="jp-company-summary-mark">{companyQuery.data.name.slice(0, 2).toUpperCase()}</span>}
                  <div className="stack" style={{ gap: "0.2rem" }}>
                    <strong>{companyQuery.data.name}</strong>
                    <span className="helper">{companyQuery.data.industry} • {companyQuery.data.location}</span>
                    <span className="helper">{companyQuery.data.size}</span>
                  </div>
                </div>
                <div className="jp-company-summary-stats">
                  <div className="jp-detail-stat"><span className="helper">Open jobs</span><strong>{(employerJobsQuery.data ?? []).filter((job) => job.status === "Open").length}</strong></div>
                  <div className="jp-detail-stat"><span className="helper">Total jobs</span><strong>{(employerJobsQuery.data ?? []).length}</strong></div>
                </div>
              </div>
            </article>
          ) : null}

          <article id="activity-section" className="surface jp-profile-card jp-reveal-up">
            <div className="space-between"><h2 style={{ margin: 0 }}>Activity</h2><div className="row" style={{ gap: "0.45rem", flexWrap: "wrap" }}>{(["posts", "articles", "media", "likes"] as ActivityTab[]).map((entry) => <button key={entry} className={tab === entry ? "btn btn-primary" : "btn btn-secondary"} onClick={() => setTab(entry)}>{entry[0].toUpperCase() + entry.slice(1)}</button>)}</div></div>
            <div className="stack" style={{ marginTop: "0.9rem" }}>{activitySeed.filter((entry) => (tab === "posts" ? entry.type === "posts" || entry.type === "media" : entry.type === tab)).map((entry) => <article key={entry.id} className="jp-profile-activity-item"><strong>{entry.title}</strong><p className="helper" style={{ margin: 0 }}>{entry.preview}</p><div className="helper">{entry.date} • {entry.engagement} interactions</div></article>)}</div>
          </article>

          <SectionCard sectionId="experience-section" title="Experience" action={viewingOwn ? <button className="btn btn-secondary" onClick={() => { setEditingExpId(null); setExpDraft({ role: "", company: "", period: "", location: "", type: "", description: "", logo: "EXP" }); setExpOpen(true); }}>Add Experience</button> : null}>
            {expItems.length ? expItems.map((entry) => <article key={entry.id} className="jp-profile-item-row"><span className="jp-profile-item-logo">{entry.logo}</span><div className="stack" style={{ gap: "0.2rem" }}><strong>{entry.role}</strong><span className="helper">{entry.company} • {entry.type}</span><span className="helper">{entry.period} • {entry.location}</span><p className="helper" style={{ margin: 0 }}>{entry.description}</p>{viewingOwn ? <div className="row" style={{ gap: "0.45rem" }}><button className="btn btn-secondary" onClick={() => { setEditingExpId(entry.id); setExpDraft({ role: entry.role, company: entry.company, period: entry.period, location: entry.location, type: entry.type, description: entry.description, logo: entry.logo }); setExpOpen(true); }}>Edit</button><button className="btn btn-secondary" onClick={() => setExpItems((list) => list.filter((item) => item.id !== entry.id))}>Delete</button></div> : null}</div></article>) : <EmptyState title="No experience entries" description="Add your professional experience." compact />}
          </SectionCard>

          <SectionCard sectionId="education-section" title="Education" action={viewingOwn ? <button className="btn btn-secondary" onClick={() => { setEditingEduId(null); setEduDraft({ school: "", degree: "", field: "", period: "", logo: "EDU" }); setEduOpen(true); }}>Add Education</button> : null}>
            {eduItems.length ? eduItems.map((entry) => <article key={entry.id} className="jp-profile-item-row"><span className="jp-profile-item-logo">{entry.logo}</span><div className="stack" style={{ gap: "0.2rem" }}><strong>{entry.school}</strong><span className="helper">{entry.degree} • {entry.field}</span><span className="helper">{entry.period}</span>{viewingOwn ? <div className="row" style={{ gap: "0.45rem" }}><button className="btn btn-secondary" onClick={() => { setEditingEduId(entry.id); setEduDraft({ school: entry.school, degree: entry.degree, field: entry.field, period: entry.period, logo: entry.logo }); setEduOpen(true); }}>Edit</button><button className="btn btn-secondary" onClick={() => setEduItems((list) => list.filter((item) => item.id !== entry.id))}>Delete</button></div> : null}</div></article>) : <EmptyState title="No education entries" description="Add your education background." compact />}
          </SectionCard>

          <SectionCard sectionId="skills-section" title="Skills" action={viewingOwn ? <button className="btn btn-secondary" onClick={() => { setEditingSkillName(null); setSkillDraft({ name: "", endorsements: 1 }); setSkillOpen(true); }}>Add Skill</button> : null}>
            <div className="jp-skill-grid">{(showAllSkills ? skillItems : skillItems.slice(0, 5)).map((entry) => <div key={entry.name} className="jp-skill-pill"><strong>{entry.name}</strong><span className="helper">{entry.endorsements} endorsements</span>{viewingOwn ? <div className="row" style={{ gap: "0.35rem" }}><button className="btn btn-secondary" onClick={() => { setEditingSkillName(entry.name); setSkillDraft({ ...entry }); setSkillOpen(true); }}>Edit</button><button className="btn btn-secondary" onClick={() => setSkillItems((list) => list.filter((item) => item.name !== entry.name))}>Delete</button></div> : null}</div>)}</div>
            {skillItems.length > 5 ? <button className="btn btn-secondary" onClick={() => setShowAllSkills((value) => !value)}>{showAllSkills ? "Show less" : "Show more"}</button> : null}
          </SectionCard>
        </div>
      </div>

      {contactOpen ? <Modal title={viewingOwn ? "Contact Info" : `Message ${identity.fullName}`} onClose={() => setContactOpen(false)}>{viewingOwn ? <div className="stack"><div><strong>Email</strong><div className="helper">{userQuery.data?.email ?? "profile@jobplus.app"}</div></div><div><strong>Phone</strong><div className="helper">{userQuery.data?.phone ?? "+86 139 0000 0000"}</div></div><div><strong>Location</strong><div className="helper">{identity.location}</div></div></div> : <div className="stack"><textarea className="textarea" value={messageDraft} onChange={(event) => setMessageDraft(event.target.value)} placeholder={`Write a message to ${identity.fullName}...`} /><div className="row" style={{ justifyContent: "flex-end" }}><button className="btn btn-primary" onClick={() => { if (!messageDraft.trim()) return setBanner("Please write a message first."); setBanner(`Message sent to ${identity.fullName}.`); setContactOpen(false); setMessageDraft(""); }}>Send Message</button></div></div>}</Modal> : null}
      {profileEditOpen ? <Modal title="Edit Profile" onClose={() => setProfileEditOpen(false)}><FormGrid fields={[["Full Name", profileDraft.fullName, (v) => setProfileDraft((c) => ({ ...c, fullName: v }))], ["Professional Title", profileDraft.title, (v) => setProfileDraft((c) => ({ ...c, title: v }))], ["Company", profileDraft.company, (v) => setProfileDraft((c) => ({ ...c, company: v }))], ["Location", profileDraft.location, (v) => setProfileDraft((c) => ({ ...c, location: v }))], ["Industry", profileDraft.industry, (v) => setProfileDraft((c) => ({ ...c, industry: v }))]]} /><Actions onCancel={() => setProfileEditOpen(false)} onSave={saveProfile} saving={profileMutation.isPending} /></Modal> : null}
      {aboutEditOpen ? <Modal title="Edit About" onClose={() => setAboutEditOpen(false)}><textarea className="textarea" value={aboutDraft} onChange={(event) => setAboutDraft(event.target.value)} /><Actions onCancel={() => setAboutEditOpen(false)} onSave={saveAbout} saving={aboutMutation.isPending} /></Modal> : null}
      {expOpen ? <Modal title={editingExpId ? "Edit Experience" : "Add Experience"} onClose={() => setExpOpen(false)}><FormGrid fields={[["Role", expDraft.role, (v) => setExpDraft((c) => ({ ...c, role: v }))], ["Company", expDraft.company, (v) => setExpDraft((c) => ({ ...c, company: v }))], ["Period", expDraft.period, (v) => setExpDraft((c) => ({ ...c, period: v }))], ["Location", expDraft.location, (v) => setExpDraft((c) => ({ ...c, location: v }))], ["Type", expDraft.type, (v) => setExpDraft((c) => ({ ...c, type: v }))], ["Badge", expDraft.logo, (v) => setExpDraft((c) => ({ ...c, logo: v.toUpperCase().slice(0, 4) }))]]} /><div className="field"><label>Description</label><textarea className="textarea" value={expDraft.description} onChange={(event) => setExpDraft((c) => ({ ...c, description: event.target.value }))} /></div><Actions onCancel={() => setExpOpen(false)} onSave={saveExperience} /></Modal> : null}
      {eduOpen ? <Modal title={editingEduId ? "Edit Education" : "Add Education"} onClose={() => setEduOpen(false)}><FormGrid fields={[["School", eduDraft.school, (v) => setEduDraft((c) => ({ ...c, school: v }))], ["Degree", eduDraft.degree, (v) => setEduDraft((c) => ({ ...c, degree: v }))], ["Field", eduDraft.field, (v) => setEduDraft((c) => ({ ...c, field: v }))], ["Period", eduDraft.period, (v) => setEduDraft((c) => ({ ...c, period: v }))], ["Badge", eduDraft.logo, (v) => setEduDraft((c) => ({ ...c, logo: v.toUpperCase().slice(0, 4) }))]]} /><Actions onCancel={() => setEduOpen(false)} onSave={saveEducation} /></Modal> : null}
      {skillOpen ? <Modal title={editingSkillName ? "Edit Skill" : "Add Skill"} onClose={() => setSkillOpen(false)}><div className="form-grid"><div className="field"><label>Skill</label><input className="input" value={skillDraft.name} onChange={(event) => setSkillDraft((current) => ({ ...current, name: event.target.value }))} /></div><div className="field"><label>Endorsements</label><input className="input" type="number" min={1} value={skillDraft.endorsements} onChange={(event) => setSkillDraft((current) => ({ ...current, endorsements: Number(event.target.value) }))} /></div></div><Actions onCancel={() => setSkillOpen(false)} onSave={saveSkill} /></Modal> : null}
    </section>
  );
}

function SectionCard({ sectionId, title, action, children }: { sectionId?: string; title: string; action?: ReactNode; children: ReactNode }) {
  return <article id={sectionId} className="surface jp-profile-card jp-reveal-up"><div className="space-between"><h2 style={{ margin: 0 }}>{title}</h2>{action}</div><div className="stack" style={{ marginTop: "0.8rem" }}>{children}</div></article>;
}
function FormGrid({ fields }: { fields: [string, string, (value: string) => void][] }) {
  return <div className="form-grid">{fields.map(([label, value, set]) => <div className="field" key={label}><label>{label}</label><input className="input" value={value} onChange={(event) => set(event.target.value)} /></div>)}</div>;
}
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return <div className="jp-modal-backdrop" role="dialog" aria-modal="true"><div className="surface jp-contact-modal"><div className="space-between"><h3 style={{ margin: 0 }}>{title}</h3><button className="btn btn-secondary" onClick={onClose}>Close</button></div><div className="stack">{children}</div></div></div>;
}
function Actions({ onCancel, onSave, saving = false }: { onCancel: () => void; onSave: () => void; saving?: boolean }) {
  return <div className="row" style={{ justifyContent: "flex-end", gap: "0.5rem" }}><button className="btn btn-secondary" onClick={onCancel}>Cancel</button><button className="btn btn-primary" onClick={onSave} disabled={saving}>{saving ? "Saving..." : "Save"}</button></div>;
}
