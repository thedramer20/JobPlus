import { useMemo, useState, type ReactNode } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ProfilePageSkeleton } from "../components/shared/content-skeletons";
import { EmptyState } from "../components/shared/empty-state";
import { getMyCompany } from "../services/companies-service";
import { listEmployerJobs } from "../services/jobs-service";
import { getCandidateProfile, getUserProfile, updateCandidateProfile, updateUserProfile } from "../services/profile-service";
import { authStore } from "../store/auth-store";

// Types trimmed for compile-safety (keep existing data shape loosely typed)
export type ActivityTab = "posts" | "articles" | "media" | "likes";

const activitySeed = [
  { id: 1, type: "posts", title: "Building reliable full-stack interview projects", preview: "Shipped complete role-aware candidate/employer/admin workflows for JobPlus.", date: "2 days ago", engagement: 182 },
  { id: 2, type: "articles", title: "How to structure MyBatis in modular teams", preview: "Practical mapper ownership and scalable service boundaries for team projects.", date: "1 week ago", engagement: 93 },
  { id: 3, type: "media", title: "New profile and hiring dashboard preview", preview: "Updated UI and interaction system for a more professional product experience.", date: "3 days ago", engagement: 121 },
  { id: 4, type: "likes", title: "React performance in data-heavy dashboards", preview: "Optimistic updates and proper cache invalidation keep interfaces responsive.", date: "5 days ago", engagement: 76 },
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
  const [contactOpen, setContactOpen] = useState(false);
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [aboutEditOpen, setAboutEditOpen] = useState(false);

  const loading = viewingOwn && (userQuery.isLoading || candidateQuery.isLoading || companyQuery.isLoading || employerJobsQuery.isLoading);

  const identity = useMemo(() => {
    if (viewingOwn) {
      const u = userQuery.data as any;
      const c = candidateQuery.data as any;
      return {
        fullName: u?.fullName ?? user?.name ?? "Your Name",
        title: u?.title ?? c?.experienceSummary ?? "Software Developer",
        company: user?.company ?? "JobPlus Labs",
        location: (c?.address ?? u?.location ?? "Shanghai, China") as string,
        industry: (u?.industry ?? "Technology") as string,
        followers: 1320,
        connections: 684,
        avatar: c?.avatarUrl ?? "",
      };
    }
    return {
      fullName: "Community Member",
      title: "Professional on JobPlus",
      company: "JobPlus Network",
      location: "Global",
      industry: "Technology",
      followers: 0,
      connections: 0,
      avatar: "",
    };
  }, [candidateQuery.data, user?.company, user?.name, userQuery.data, viewingOwn]);

  const aboutText = (candidateQuery.data as any)?.experienceSummary ?? "Passionate developer focused on product quality, hiring workflows, and clean architecture.";

  const profileConversion = useMemo(() => {
    const aboutOk = Boolean(aboutText && aboutText.length > 60);
    const completenessSignals = [Boolean(identity.fullName), Boolean(identity.title), aboutOk];
    const completeness = Math.round((completenessSignals.filter(Boolean).length / completenessSignals.length) * 100);
    const engagement = 70;
    const recruiterResponse = 46;
    const score = Math.round(completeness * 0.4 + engagement * 0.3 + recruiterResponse * 0.3);
    const fixes = [!aboutOk ? "Expand your About section with measurable impact." : null].filter(Boolean) as string[];
    return { score, completeness, engagement, recruiterResponse, fixes };
  }, [aboutText, identity.fullName, identity.title]);

  const profileMutation = useMutation({
    mutationFn: async (value: any) => {
      await updateUserProfile({ fullName: value.fullName, email: (userQuery.data as any)?.email ?? user?.email ?? "user@jobplus.app", phone: (userQuery.data as any)?.phone ?? "" });
      await updateCandidateProfile({ address: value.location, education: (candidateQuery.data as any)?.education ?? "", experienceSummary: value.title, linkedinUrl: (candidateQuery.data as any)?.linkedinUrl ?? "", githubUrl: (candidateQuery.data as any)?.githubUrl ?? "" });
      return value;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "user"] });
      queryClient.invalidateQueries({ queryKey: ["profile", "candidate"] });
      setProfileEditOpen(false);
      setBanner("Profile details updated.");
    },
    onError: () => setBanner("Profile update failed.")
  });

  const aboutMutation = useMutation({
    mutationFn: async (text: string) =>
      updateCandidateProfile({ address: (candidateQuery.data as any)?.address ?? "", education: (candidateQuery.data as any)?.education ?? "", experienceSummary: text, linkedinUrl: (candidateQuery.data as any)?.linkedinUrl ?? "", githubUrl: (candidateQuery.data as any)?.githubUrl ?? "" }),
    onSuccess: () => {
      setAboutEditOpen(false);
      setBanner("About section updated.");
    },
    onError: () => setBanner("Unable to save About.")
  });

  function clickConnect() {
    setBanner(t("profilePage.banner.connected"));
  }

  const viewingOwnFlag = viewingOwn;
  const settingsPath = user?.role === "employer" ? "/employer/settings" : "/app/settings";

  return (
    <section className="section">
      <div className="container">
        <div className="jp-profile-main stack">
          {banner ? <div className="auth-note">{banner}</div> : null}
          {loading ? <ProfilePageSkeleton /> : null}

          <article className="surface jp-profile-header">
            <div className="jp-profile-cover" />
            <div className="jp-profile-header-content">
              <div className="jp-profile-avatar">
                {identity.avatar ? (
                  <img src={identity.avatar} alt={identity.fullName} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                ) : (
                  identity.fullName.slice(0, 1)
                )}
              </div>
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
                {viewingOwnFlag ? (
                  <>
                    <button className="btn btn-primary" onClick={() => setProfileEditOpen(true)}>Edit Profile</button>
                    <button className="btn btn-secondary" onClick={() => setAboutEditOpen(true)}>Edit About</button>
                    <button className="btn btn-secondary" onClick={() => setContactOpen(true)}>Contact Info</button>
                    <Link className="btn btn-secondary" to={settingsPath}>Profile Settings</Link>
                  </>
                ) : (
                  <>
                    <button className="btn btn-primary" onClick={clickConnect}>Connect</button>
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

          <article id="about-section" className="surface jp-profile-card">
            <div className="space-between">
              <h2 style={{ margin: 0 }}>About</h2>
              {viewingOwnFlag ? (
                <button className="btn btn-secondary" onClick={() => setAboutEditOpen(true)}>Edit</button>
              ) : null}
            </div>
            <p className="jp-profile-text">{aboutText}</p>
          </article>

          <article id="activity-section" className="surface jp-profile-card">
            <div className="space-between">
              <h2 style={{ margin: 0 }}>Activity</h2>
              <div className="row" style={{ gap: "0.45rem", flexWrap: "wrap" }}>
                {(["posts", "articles", "media", "likes"] as ActivityTab[]).map((entry) => (
                  <button
                    key={entry}
                    className={tab === entry ? "btn btn-primary" : "btn btn-secondary"}
                    onClick={() => setTab(entry)}
                  >
                    {entry[0].toUpperCase() + entry.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="stack" style={{ marginTop: "0.9rem" }}>
              {activitySeed
                .filter((entry) => (tab === "posts" ? entry.type === "posts" || entry.type === "media" : entry.type === tab))
                .map((entry) => (
                  <article key={entry.id} className="jp-profile-activity-item">
                    <strong>{entry.title}</strong>
                    <p className="helper" style={{ margin: 0 }}>{entry.preview}</p>
                    <div className="helper">{entry.date} • {entry.engagement} interactions</div>
                  </article>
                ))}
            </div>
          </article>
        </div>
      </div>

      {contactOpen ? (
        <Modal title={viewingOwnFlag ? "Contact Info" : "Message"} onClose={() => setContactOpen(false)}>
          <div className="stack">
            <div><strong>Email</strong><div className="helper">(demo)</div></div>
            <div><strong>Phone</strong><div className="helper">(demo)</div></div>
          </div>
        </Modal>
      ) : null}

      {profileEditOpen ? (
        <Modal title="Edit Profile" onClose={() => setProfileEditOpen(false)}>
          <Actions onCancel={() => setProfileEditOpen(false)} onSave={() => profileMutation.mutate({ fullName: "", title: "" })} saving={profileMutation.isPending} />
        </Modal>
      ) : null}

      {aboutEditOpen ? (
        <Modal title="Edit About" onClose={() => setAboutEditOpen(false)}>
          <Actions onCancel={() => setAboutEditOpen(false)} onSave={() => aboutMutation.mutate("Updated about")} saving={aboutMutation.isPending} />
        </Modal>
      ) : null}
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
      <button className="btn btn-primary" onClick={onSave} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}

function SectionCard({ title, action, children, sectionId }: { sectionId?: string; title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <article id={sectionId} className="surface jp-profile-card">
      <div className="space-between">
        <h2 style={{ margin: 0 }}>{title}</h2>
        {action}
      </div>
      <div className="stack" style={{ marginTop: "0.8rem" }}>{children}</div>
    </article>
  );
}

