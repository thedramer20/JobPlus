import { useMemo, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { EmptyState } from "../components/shared/empty-state";
import { getCandidateProfile, getUserProfile, updateCandidateProfile, updateUserProfile } from "../services/profile-service";
import { authStore } from "../store/auth-store";

type ActivityTab = "posts" | "articles" | "media" | "likes";
type ConnectState = "connect" | "pending" | "connected";
type ProfileEditDraft = { fullName: string; title: string; company: string; location: string; industry: string };
type SkillItem = { name: string; endorsements: number };
type ExperienceItem = { id: number; role: string; company: string; period: string; location: string; type: string; description: string; logo: string };
type EducationItem = { id: number; school: string; degree: string; field: string; period: string; logo: string };
type SuggestedProfile = { id: number; username: string; name: string; title: string; company: string; location: string; industry: string; skills: string[]; mutualConnections: number; avatar: string };
type ProfileIdentity = { fullName: string; username: string; title: string; company: string; location: string; industry: string; followers: number; connections: number; avatar: string };
type ActivityItem = { id: number; type: ActivityTab; title: string; preview: string; date: string; engagement: number };

const suggestions: SuggestedProfile[] = [
  { id: 1, username: "nadia.mensah", name: "Nadia Mensah", title: "Engineering Manager", company: "JobPlus Labs", location: "Shanghai", industry: "Technology", skills: ["React", "Leadership"], mutualConnections: 8, avatar: "https://i.pravatar.cc/120?img=44" },
  { id: 2, username: "amina.yusuf", name: "Amina Yusuf", title: "Backend Developer", company: "TalentFlow", location: "Shanghai", industry: "Technology", skills: ["Java", "Spring Boot"], mutualConnections: 6, avatar: "https://i.pravatar.cc/120?img=15" },
  { id: 3, username: "omar.faris", name: "Omar Faris", title: "Product Engineer", company: "Nova Works", location: "Dubai", industry: "Technology", skills: ["TypeScript", "React"], mutualConnections: 4, avatar: "https://i.pravatar.cc/120?img=12" }
];

const mockActivity: ActivityItem[] = [
  { id: 1, type: "posts", title: "Building reliable full-stack interview projects", preview: "Shipped complete role-aware candidate/employer/admin workflows for JobPlus.", date: "2 days ago", engagement: 182 },
  { id: 2, type: "articles", title: "How to structure MyBatis in modular teams", preview: "Practical mapper ownership and scalable service boundaries for team projects.", date: "1 week ago", engagement: 93 },
  { id: 3, type: "media", title: "New profile and hiring dashboard preview", preview: "Updated UI and interaction system for a more professional product experience.", date: "3 days ago", engagement: 121 },
  { id: 4, type: "likes", title: "React performance in data-heavy dashboards", preview: "Optimistic updates and proper cache invalidation keep interfaces responsive.", date: "5 days ago", engagement: 76 }
];

export function ProfilePage() {
  const queryClient = useQueryClient();
  const { user } = authStore();
  const params = useParams<{ username?: string }>();
  const [searchParams] = useSearchParams();
  const requestedUser = (params.username ?? searchParams.get("user") ?? "").trim().toLowerCase();
  const viewingOwn = searchParams.get("view") !== "public" && !requestedUser;

  const userQuery = useQuery({ queryKey: ["profile", "user"], queryFn: getUserProfile, enabled: viewingOwn });
  const candidateQuery = useQuery({ queryKey: ["profile", "candidate"], queryFn: getCandidateProfile, enabled: viewingOwn });

  const [tab, setTab] = useState<ActivityTab>("posts");
  const [banner, setBanner] = useState("");
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [connectState, setConnectState] = useState<ConnectState>("connect");
  const [connectByUser, setConnectByUser] = useState<Record<string, ConnectState>>({});
  const [followed, setFollowed] = useState(false);
  const [messageDraft, setMessageDraft] = useState("");
  const [contactOpen, setContactOpen] = useState(false);
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [aboutEditOpen, setAboutEditOpen] = useState(false);
  const [eduOpen, setEduOpen] = useState(false);
  const [expOpen, setExpOpen] = useState(false);
  const [skillOpen, setSkillOpen] = useState(false);
  const [editingEduId, setEditingEduId] = useState<number | null>(null);
  const [editingExpId, setEditingExpId] = useState<number | null>(null);
  const [editingSkillName, setEditingSkillName] = useState<string | null>(null);

  const [expItems, setExpItems] = useState<ExperienceItem[]>([
    { id: 1, role: "Full Stack Developer", company: "JobPlus Labs", period: "2025 - Present", location: "Shanghai", type: "Full-time", description: "Building role-aware hiring modules and polished frontend UX.", logo: "🚀" }
  ]);
  const [eduItems, setEduItems] = useState<EducationItem[]>([
    { id: 1, school: "University of Applied Software Engineering", degree: "Bachelor", field: "Software Engineering", period: "2022 - 2026", logo: "🎓" }
  ]);
  const [skillItems, setSkillItems] = useState<SkillItem[]>([
    { name: "Java", endorsements: 46 },
    { name: "Spring Boot", endorsements: 39 },
    { name: "React", endorsements: 34 },
    { name: "TypeScript", endorsements: 21 }
  ]);

  const publicProfile = useMemo(() => suggestions.find((x) => x.username === requestedUser), [requestedUser]);
  const [overrides, setOverrides] = useState<Partial<ProfileIdentity>>({});

  const baseIdentity: ProfileIdentity = useMemo(() => {
    if (!viewingOwn) {
      if (publicProfile) {
        return { fullName: publicProfile.name, username: publicProfile.username, title: publicProfile.title, company: publicProfile.company, location: publicProfile.location, industry: publicProfile.industry, followers: 1200, connections: 520, avatar: publicProfile.avatar };
      }
      return { fullName: "Community Member", username: requestedUser || "unknown", title: "Professional on JobPlus", company: "JobPlus Network", location: "Global", industry: "Technology", followers: 0, connections: 0, avatar: "" };
    }
    return {
      fullName: userQuery.data?.fullName ?? user?.name ?? "Your Name",
      username: userQuery.data?.username ?? "jobplus-user",
      title: candidateQuery.data?.experienceSummary?.slice(0, 80) || user?.title || "Software Developer",
      company: user?.company ?? "JobPlus Labs",
      location: candidateQuery.data?.address ?? "Shanghai, China",
      industry: "Technology",
      followers: 1320,
      connections: 684,
      avatar: ""
    };
  }, [viewingOwn, publicProfile, requestedUser, userQuery.data?.fullName, userQuery.data?.username, user?.name, user?.title, user?.company, candidateQuery.data?.experienceSummary, candidateQuery.data?.address]);
  const identity = { ...baseIdentity, ...overrides };

  const [profileDraft, setProfileDraft] = useState<ProfileEditDraft>({ fullName: "", title: "", company: "", location: "", industry: "" });
  const [aboutOverride, setAboutOverride] = useState<string | null>(null);
  const [aboutDraft, setAboutDraft] = useState("");
  const aboutText = aboutOverride ?? candidateQuery.data?.experienceSummary ?? "Passionate developer focused on product quality, hiring workflows, and clean architecture.";

  const [eduDraft, setEduDraft] = useState<Omit<EducationItem, "id">>({ school: "", degree: "", field: "", period: "", logo: "🎓" });
  const [expDraft, setExpDraft] = useState<Omit<ExperienceItem, "id">>({ role: "", company: "", period: "", location: "", type: "", description: "", logo: "💼" });
  const [skillDraft, setSkillDraft] = useState<SkillItem>({ name: "", endorsements: 1 });

  const profileMutation = useMutation({
    mutationFn: async (v: ProfileEditDraft) => {
      try {
        await updateUserProfile({ fullName: v.fullName, email: userQuery.data?.email ?? user?.email ?? "user@jobplus.app", phone: userQuery.data?.phone ?? "" });
        await updateCandidateProfile({ address: v.location, education: candidateQuery.data?.education ?? "", experienceSummary: v.title, linkedinUrl: candidateQuery.data?.linkedinUrl ?? "", githubUrl: candidateQuery.data?.githubUrl ?? "" });
      } catch {}
      return v;
    },
    onSuccess: (v) => {
      setOverrides((c) => ({ ...c, ...v }));
      queryClient.invalidateQueries({ queryKey: ["profile", "user"] });
      queryClient.invalidateQueries({ queryKey: ["profile", "candidate"] });
      setProfileEditOpen(false);
      setBanner("Profile details updated.");
    },
    onError: () => setBanner("Profile update failed.")
  });

  const aboutMutation = useMutation({
    mutationFn: async (text: string) => {
      try {
        await updateCandidateProfile({ address: candidateQuery.data?.address ?? "", education: candidateQuery.data?.education ?? "", experienceSummary: text, linkedinUrl: candidateQuery.data?.linkedinUrl ?? "", githubUrl: candidateQuery.data?.githubUrl ?? "" });
      } catch {}
      return text;
    },
    onSuccess: (text) => {
      setAboutOverride(text);
      setAboutEditOpen(false);
      setBanner("About section updated.");
    },
    onError: () => setBanner("Unable to save About.")
  });

  const ranked = useMemo(() => {
    const base = skillItems.map((s) => s.name.toLowerCase());
    return suggestions
      .filter((s) => s.username !== identity.username)
      .map((s) => {
        const overlap = s.skills.filter((k) => base.includes(k.toLowerCase())).length;
        const score = overlap * 3 + s.mutualConnections * 2 + (s.location === identity.location ? 2 : 0);
        const reason = s.mutualConnections >= 5 ? `Because you share ${s.mutualConnections} mutual connections` : overlap ? "Same industry and skills" : "Relevant profile";
        return { ...s, score, reason };
      })
      .sort((a, b) => b.score - a.score);
  }, [identity.username, identity.location, skillItems]);

  function openProfileEditor() {
    setProfileDraft({ fullName: identity.fullName, title: identity.title, company: identity.company, location: identity.location, industry: identity.industry });
    setProfileEditOpen(true);
  }
  function saveProfile() {
    const v = { ...profileDraft, fullName: profileDraft.fullName.trim(), title: profileDraft.title.trim(), company: profileDraft.company.trim(), location: profileDraft.location.trim(), industry: profileDraft.industry.trim() };
    if (!v.fullName || !v.title) return setBanner("Name and title are required.");
    profileMutation.mutate(v);
  }
  function openAboutEditor() {
    setAboutDraft(aboutText);
    setAboutEditOpen(true);
  }
  function saveAbout() {
    const v = aboutDraft.trim();
    if (!v) return setBanner("About text cannot be empty.");
    aboutMutation.mutate(v);
  }

  function cycleConnect(v: ConnectState): ConnectState {
    if (v === "connect") return "pending";
    if (v === "pending") return "connected";
    return "connected";
  }
  function clickConnect() {
    setConnectState((c) => {
      const n = cycleConnect(c);
      setBanner(n === "pending" ? "Connection request sent." : "You are now connected.");
      return n;
    });
  }
  function clickSidebarConnect(username: string) {
    setConnectByUser((c) => {
      const n = cycleConnect(c[username] ?? "connect");
      setBanner(n === "pending" ? "Connection request sent." : "You are now connected.");
      return { ...c, [username]: n };
    });
  }

  function saveExperience() {
    const v = { ...expDraft, role: expDraft.role.trim(), company: expDraft.company.trim(), description: expDraft.description.trim() };
    if (!v.role || !v.company) return setBanner("Role and company are required.");
    if (editingExpId) setExpItems((l) => l.map((x) => (x.id === editingExpId ? { ...x, ...v } : x)));
    else setExpItems((l) => [{ id: Date.now(), ...v }, ...l]);
    setExpOpen(false);
    setBanner(editingExpId ? "Experience updated." : "Experience added.");
  }
  function saveEducation() {
    const v = { ...eduDraft, school: eduDraft.school.trim(), degree: eduDraft.degree.trim() };
    if (!v.school || !v.degree) return setBanner("School and degree are required.");
    if (editingEduId) setEduItems((l) => l.map((x) => (x.id === editingEduId ? { ...x, ...v } : x)));
    else setEduItems((l) => [{ id: Date.now(), ...v }, ...l]);
    setEduOpen(false);
    setBanner(editingEduId ? "Education updated." : "Education added.");
  }
  function saveSkill() {
    const v = { name: skillDraft.name.trim(), endorsements: Math.max(1, Number(skillDraft.endorsements) || 1) };
    if (!v.name) return setBanner("Skill name is required.");
    if (!editingSkillName && skillItems.some((s) => s.name.toLowerCase() === v.name.toLowerCase())) return setBanner("Skill already exists.");
    if (editingSkillName) setSkillItems((l) => l.map((x) => (x.name === editingSkillName ? v : x)));
    else setSkillItems((l) => [v, ...l]);
    setSkillOpen(false);
    setBanner(editingSkillName ? "Skill updated." : "Skill added.");
  }

  const loading = viewingOwn && (userQuery.isLoading || candidateQuery.isLoading);

  return (
    <section className="section">
      <div className="container jp-profile-layout">
        <div className="jp-profile-main stack">
          {banner ? <div className="auth-note">{banner}</div> : null}
          {loading ? <article className="surface jp-profile-card"><div className="helper">Loading profile...</div></article> : null}

          <article className="surface jp-profile-header">
            <div className="jp-profile-cover" />
            <div className="jp-profile-header-content">
              <div className="jp-profile-avatar">{identity.avatar ? <img src={identity.avatar} alt={identity.fullName} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} /> : identity.fullName.slice(0, 1)}</div>
              <div className="jp-profile-identity stack" style={{ gap: "0.3rem" }}>
                <h1 style={{ margin: 0 }}>{identity.fullName}</h1>
                <div className="helper">{identity.title}</div>
                <div className="helper">{identity.company} - {identity.location} - {identity.industry}</div>
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
                  </>
                ) : (
                  <>
                    <button className={connectState === "connected" ? "btn btn-secondary" : "btn btn-primary"} onClick={clickConnect}>{labelConnect(connectState)}</button>
                    <button className="btn btn-secondary" onClick={() => setFollowed((v) => !v)}>{followed ? "Following" : "Follow"}</button>
                    <button className="btn btn-secondary" onClick={() => setContactOpen(true)}>Message</button>
                  </>
                )}
              </div>
            </div>
          </article>

          <article className="surface jp-profile-card">
            <div className="space-between">
              <h2 style={{ margin: 0 }}>About</h2>
              {viewingOwn ? <button className="btn btn-secondary" onClick={openAboutEditor}>Edit</button> : null}
            </div>
            <p className="jp-profile-text">{aboutText}</p>
          </article>

          <article className="surface jp-profile-card">
            <div className="space-between">
              <h2 style={{ margin: 0 }}>Activity</h2>
              <div className="row" style={{ gap: "0.45rem", flexWrap: "wrap" }}>
                {(["posts", "articles", "media", "likes"] as ActivityTab[]).map((t) => <button key={t} className={tab === t ? "btn btn-primary" : "btn btn-secondary"} onClick={() => setTab(t)}>{cap(t)}</button>)}
              </div>
            </div>
            <div className="stack" style={{ marginTop: "0.9rem" }}>
              {mockActivity.filter((x) => (tab === "posts" ? x.type === "posts" || x.type === "media" : x.type === tab)).map((x) => (
                <article key={x.id} className="jp-profile-activity-item">
                  <strong>{x.title}</strong>
                  <p className="helper" style={{ margin: 0 }}>{x.preview}</p>
                  <div className="helper">{x.date} - {x.engagement} interactions</div>
                </article>
              ))}
            </div>
          </article>

          <article className="surface jp-profile-card">
            <div className="space-between">
              <h2 style={{ margin: 0 }}>Experience</h2>
              {viewingOwn ? <button className="btn btn-secondary" onClick={() => { setEditingExpId(null); setExpDraft({ role: "", company: "", period: "", location: "", type: "", description: "", logo: "💼" }); setExpOpen(true); }}>Add Experience</button> : null}
            </div>
            <div className="stack" style={{ marginTop: "0.8rem" }}>
              {expItems.length ? expItems.map((x) => (
                <article key={x.id} className="jp-profile-item-row">
                  <span className="jp-profile-item-logo">{x.logo}</span>
                  <div className="stack" style={{ gap: "0.2rem" }}>
                    <strong>{x.role}</strong>
                    <span className="helper">{x.company} - {x.type}</span>
                    <span className="helper">{x.period} - {x.location}</span>
                    <p className="helper" style={{ margin: 0 }}>{x.description}</p>
                    {viewingOwn ? <div className="row" style={{ gap: "0.45rem" }}><button className="btn btn-secondary" onClick={() => { setEditingExpId(x.id); setExpDraft({ role: x.role, company: x.company, period: x.period, location: x.location, type: x.type, description: x.description, logo: x.logo }); setExpOpen(true); }}>Edit</button><button className="btn btn-secondary" onClick={() => setExpItems((l) => l.filter((i) => i.id !== x.id))}>Delete</button></div> : null}
                  </div>
                </article>
              )) : <EmptyState title="No experience entries" description="Add your professional experience." compact />}
            </div>
          </article>

          <article className="surface jp-profile-card">
            <div className="space-between">
              <h2 style={{ margin: 0 }}>Education</h2>
              {viewingOwn ? <button className="btn btn-secondary" onClick={() => { setEditingEduId(null); setEduDraft({ school: "", degree: "", field: "", period: "", logo: "🎓" }); setEduOpen(true); }}>Add Education</button> : null}
            </div>
            <div className="stack" style={{ marginTop: "0.8rem" }}>
              {eduItems.length ? eduItems.map((x) => (
                <article key={x.id} className="jp-profile-item-row">
                  <span className="jp-profile-item-logo">{x.logo}</span>
                  <div className="stack" style={{ gap: "0.2rem" }}>
                    <strong>{x.school}</strong>
                    <span className="helper">{x.degree} - {x.field}</span>
                    <span className="helper">{x.period}</span>
                    {viewingOwn ? <div className="row" style={{ gap: "0.45rem" }}><button className="btn btn-secondary" onClick={() => { setEditingEduId(x.id); setEduDraft({ school: x.school, degree: x.degree, field: x.field, period: x.period, logo: x.logo }); setEduOpen(true); }}>Edit</button><button className="btn btn-secondary" onClick={() => setEduItems((l) => l.filter((i) => i.id !== x.id))}>Delete</button></div> : null}
                  </div>
                </article>
              )) : <EmptyState title="No education entries" description="Add your education background." compact />}
            </div>
          </article>

          <article className="surface jp-profile-card">
            <div className="space-between">
              <h2 style={{ margin: 0 }}>Skills</h2>
              {viewingOwn ? <button className="btn btn-secondary" onClick={() => { setEditingSkillName(null); setSkillDraft({ name: "", endorsements: 1 }); setSkillOpen(true); }}>Add Skill</button> : null}
            </div>
            <div className="jp-skill-grid">
              {(showAllSkills ? skillItems : skillItems.slice(0, 5)).map((x) => (
                <div key={x.name} className="jp-skill-pill">
                  <strong>{x.name}</strong><span className="helper">{x.endorsements} endorsements</span>
                  {viewingOwn ? <div className="row" style={{ gap: "0.35rem" }}><button className="btn btn-secondary" onClick={() => { setEditingSkillName(x.name); setSkillDraft({ ...x }); setSkillOpen(true); }}>Edit</button><button className="btn btn-secondary" onClick={() => setSkillItems((l) => l.filter((i) => i.name !== x.name))}>Delete</button></div> : null}
                </div>
              ))}
            </div>
            {skillItems.length > 5 ? <button className="btn btn-secondary" onClick={() => setShowAllSkills((v) => !v)}>{showAllSkills ? "Show less" : "Show more"}</button> : null}
          </article>
        </div>

        <aside className="jp-profile-sidebar stack">
          <article className="surface jp-profile-card">
            <h3 style={{ marginTop: 0 }}>Similar Profiles</h3>
            <div className="stack" style={{ gap: "0.75rem" }}>
              {ranked.map((x) => (
                <div key={x.id} className="jp-suggest-item">
                  <Link to={`/profile/${x.username}`}><img src={x.avatar} alt={x.name} className="jp-suggest-avatar" /></Link>
                  <div className="stack" style={{ gap: "0.15rem" }}>
                    <Link to={`/profile/${x.username}`} style={{ textDecoration: "none", color: "inherit" }}><strong>{x.name}</strong></Link>
                    <span className="helper">{x.title} - {x.company}</span>
                    <span className="helper">{x.reason}</span>
                  </div>
                  <button className="btn btn-secondary" onClick={() => clickSidebarConnect(x.username)}>{labelConnect(connectByUser[x.username] ?? "connect")}</button>
                </div>
              ))}
            </div>
          </article>
          <article className="surface jp-profile-card">
            <h3 style={{ marginTop: 0 }}>People Also Viewed</h3>
            <div className="stack" style={{ gap: "0.55rem" }}>
              {ranked.map((x) => <Link key={x.id} to={`/profile/${x.username}`} className="jp-link-button">{x.name} - {x.title}</Link>)}
            </div>
          </article>
        </aside>
      </div>

      {contactOpen ? <Modal title={viewingOwn ? "Contact Info" : `Message ${identity.fullName}`} onClose={() => setContactOpen(false)}>
        {viewingOwn ? (
          <div className="stack">
            <div><strong>Email</strong><div className="helper">{userQuery.data?.email ?? "profile@jobplus.app"}</div></div>
            <div><strong>Phone</strong><div className="helper">{userQuery.data?.phone ?? "+86 139 0000 0000"}</div></div>
            <div><strong>Location</strong><div className="helper">{identity.location}</div></div>
          </div>
        ) : (
          <div className="stack">
            <textarea className="textarea" value={messageDraft} onChange={(e) => setMessageDraft(e.target.value)} placeholder={`Write a message to ${identity.fullName}...`} />
            <div className="row" style={{ justifyContent: "flex-end" }}><button className="btn btn-primary" onClick={() => { if (!messageDraft.trim()) return setBanner("Please write a message first."); setBanner(`Message sent to ${identity.fullName}.`); setContactOpen(false); setMessageDraft(""); }}>Send Message</button></div>
          </div>
        )}
      </Modal> : null}

      {profileEditOpen ? <Modal title="Edit Profile" onClose={() => setProfileEditOpen(false)}>
        <div className="form-grid">
          <div className="field"><label>Full Name</label><input className="input" value={profileDraft.fullName} onChange={(e) => setProfileDraft((c) => ({ ...c, fullName: e.target.value }))} /></div>
          <div className="field"><label>Professional Title</label><input className="input" value={profileDraft.title} onChange={(e) => setProfileDraft((c) => ({ ...c, title: e.target.value }))} /></div>
          <div className="field"><label>Company</label><input className="input" value={profileDraft.company} onChange={(e) => setProfileDraft((c) => ({ ...c, company: e.target.value }))} /></div>
          <div className="field"><label>Location</label><input className="input" value={profileDraft.location} onChange={(e) => setProfileDraft((c) => ({ ...c, location: e.target.value }))} /></div>
          <div className="field" style={{ gridColumn: "1 / -1" }}><label>Industry</label><input className="input" value={profileDraft.industry} onChange={(e) => setProfileDraft((c) => ({ ...c, industry: e.target.value }))} /></div>
        </div>
        <Actions onCancel={() => setProfileEditOpen(false)} onSave={saveProfile} saving={profileMutation.isPending} />
      </Modal> : null}

      {aboutEditOpen ? <Modal title="Edit About" onClose={() => setAboutEditOpen(false)}>
        <textarea className="textarea" value={aboutDraft} onChange={(e) => setAboutDraft(e.target.value)} />
        <Actions onCancel={() => setAboutEditOpen(false)} onSave={saveAbout} saving={aboutMutation.isPending} />
      </Modal> : null}

      {expOpen ? <Modal title={editingExpId ? "Edit Experience" : "Add Experience"} onClose={() => setExpOpen(false)}>
        <div className="form-grid">
          <div className="field"><label>Role</label><input className="input" value={expDraft.role} onChange={(e) => setExpDraft((c) => ({ ...c, role: e.target.value }))} /></div>
          <div className="field"><label>Company</label><input className="input" value={expDraft.company} onChange={(e) => setExpDraft((c) => ({ ...c, company: e.target.value }))} /></div>
          <div className="field"><label>Period</label><input className="input" value={expDraft.period} onChange={(e) => setExpDraft((c) => ({ ...c, period: e.target.value }))} /></div>
          <div className="field"><label>Location</label><input className="input" value={expDraft.location} onChange={(e) => setExpDraft((c) => ({ ...c, location: e.target.value }))} /></div>
          <div className="field"><label>Type</label><input className="input" value={expDraft.type} onChange={(e) => setExpDraft((c) => ({ ...c, type: e.target.value }))} /></div>
          <div className="field"><label>Logo</label><input className="input" value={expDraft.logo} onChange={(e) => setExpDraft((c) => ({ ...c, logo: e.target.value }))} /></div>
          <div className="field" style={{ gridColumn: "1 / -1" }}><label>Description</label><textarea className="textarea" value={expDraft.description} onChange={(e) => setExpDraft((c) => ({ ...c, description: e.target.value }))} /></div>
        </div>
        <Actions onCancel={() => setExpOpen(false)} onSave={saveExperience} />
      </Modal> : null}

      {eduOpen ? <Modal title={editingEduId ? "Edit Education" : "Add Education"} onClose={() => setEduOpen(false)}>
        <div className="form-grid">
          <div className="field"><label>School</label><input className="input" value={eduDraft.school} onChange={(e) => setEduDraft((c) => ({ ...c, school: e.target.value }))} /></div>
          <div className="field"><label>Degree</label><input className="input" value={eduDraft.degree} onChange={(e) => setEduDraft((c) => ({ ...c, degree: e.target.value }))} /></div>
          <div className="field"><label>Field</label><input className="input" value={eduDraft.field} onChange={(e) => setEduDraft((c) => ({ ...c, field: e.target.value }))} /></div>
          <div className="field"><label>Period</label><input className="input" value={eduDraft.period} onChange={(e) => setEduDraft((c) => ({ ...c, period: e.target.value }))} /></div>
          <div className="field" style={{ gridColumn: "1 / -1" }}><label>Logo</label><input className="input" value={eduDraft.logo} onChange={(e) => setEduDraft((c) => ({ ...c, logo: e.target.value }))} /></div>
        </div>
        <Actions onCancel={() => setEduOpen(false)} onSave={saveEducation} />
      </Modal> : null}

      {skillOpen ? <Modal title={editingSkillName ? "Edit Skill" : "Add Skill"} onClose={() => setSkillOpen(false)}>
        <div className="form-grid">
          <div className="field"><label>Skill</label><input className="input" value={skillDraft.name} onChange={(e) => setSkillDraft((c) => ({ ...c, name: e.target.value }))} /></div>
          <div className="field"><label>Endorsements</label><input className="input" type="number" min={1} value={skillDraft.endorsements} onChange={(e) => setSkillDraft((c) => ({ ...c, endorsements: Number(e.target.value) }))} /></div>
        </div>
        <Actions onCancel={() => setSkillOpen(false)} onSave={saveSkill} />
      </Modal> : null}
    </section>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="jp-modal-backdrop" role="dialog" aria-modal="true">
      <div className="surface jp-contact-modal">
        <div className="space-between">
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
        <div className="stack">{children}</div>
      </div>
    </div>
  );
}

function Actions({ onCancel, onSave, saving = false }: { onCancel: () => void; onSave: () => void; saving?: boolean }) {
  return (
    <div className="row" style={{ justifyContent: "flex-end", gap: "0.5rem" }}>
      <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
      <button className="btn btn-primary" onClick={onSave} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
    </div>
  );
}

function labelConnect(v: ConnectState): string {
  if (v === "pending") return "Pending";
  if (v === "connected") return "Connected";
  return "Connect";
}

function cap(v: string): string {
  return v.charAt(0).toUpperCase() + v.slice(1);
}
