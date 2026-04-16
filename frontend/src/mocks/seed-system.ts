import type { Application } from "../types/application";
import type { Company } from "../types/company";
import type { Job, JobFilters } from "../types/job";
import type { Notification } from "../types/meta";
import type { CandidateProfile, Resume, SavedJob, UserProfile } from "../types/profile";

export interface DemoUser {
  id: number;
  username: string;
  fullName: string;
  role: "candidate" | "employer" | "admin";
  title: string;
  company?: string;
  location: string;
  activity: "high" | "medium" | "low";
  skills: string[];
  experienceSummary: string;
  education: string;
  avatarUrl: string;
}

export interface DemoConversation {
  id: number;
  participantUsername: string;
  participantName: string;
  participantRole: string;
  participantCompany: string;
  avatar: string;
  status: "online" | "away" | "offline";
  unread: number;
  lastSeen: string;
  lastMessage: string;
  messages: string[];
}

export interface DemoConnectionEdge {
  sourceUsername: string;
  targetUsername: string;
  strength: "high" | "medium" | "low";
  lastInteractionDays: number;
}

const universities = [
  "Shanghai University of Engineering and Science",
  "Hangzhou Dianzi University",
  "Shanghai Polytechnic University",
  "Shaoxing University",
  "Nanjing University of Technology",
  "SIAS University"
];

const firstNames = [
  "Amina", "Noah", "Lina", "Omar", "Sophia", "Ethan", "Nadia", "Karim", "Emma",
  "Hassan", "Maya", "Ray", "Olivia", "Daniel", "Fatima", "Leo", "Jia", "Samuel"
];

const lastNames = [
  "Yusuf", "Lin", "Morgan", "Rahman", "Ahmed", "Park", "Mensah", "Haddad", "Vega",
  "Cole", "Silva", "Kim", "Chen", "Tran", "Gomez", "Roberts", "White", "Khan"
];

const candidateTitles = [
  "Junior Frontend Engineer", "Backend Engineer", "Full Stack Developer", "Data Analyst",
  "Product Designer", "DevOps Engineer", "QA Engineer", "Mobile Engineer", "AI Engineer"
];

const employerTitles = [
  "Talent Acquisition Manager", "Engineering Director", "Recruiting Partner",
  "HR Business Partner", "People Operations Lead", "Hiring Manager"
];

const locations = [
  "Shanghai, China", "Beijing, China", "Hangzhou, China", "Shenzhen, China", "Nanjing, China",
  "Dubai, UAE", "Singapore", "Berlin, Germany", "London, UK", "Toronto, Canada", "Remote"
];

const industries = [
  "FinTech", "HealthTech", "Ecommerce", "SaaS", "AI Platform", "Enterprise Software",
  "EdTech", "Logistics Tech", "Cybersecurity", "HR Tech", "Media Technology"
];

const companyNamePrefixes = [
  "Nova", "Apex", "Vertex", "Blue", "Quantum", "Talent", "Orbit", "Spark", "Scale", "Pioneer"
];

const companyNameSuffixes = [
  "Systems", "Labs", "Works", "Dynamics", "Cloud", "Bridge", "Flow", "Pulse", "Core", "Stack"
];

const roleRequirements: Record<string, string[]> = {
  "Software Development": ["TypeScript", "React", "System Design", "API Integration"],
  "Data & Analytics": ["SQL", "Python", "Dashboarding", "Data Modeling"],
  "Product Management": ["Roadmapping", "Stakeholder Management", "User Research", "Metrics"],
  "Design": ["Figma", "Design Systems", "UX Research", "Interaction Design"],
  "Human Resources": ["Hiring", "Interviewing", "People Operations", "Communication"],
  "Sales": ["Outbound", "CRM", "Negotiation", "Pipeline Management"],
  "Marketing": ["Campaign Strategy", "Analytics", "Copywriting", "Lifecycle Marketing"],
  "Finance": ["Financial Modeling", "Forecasting", "Business Analysis", "Reporting"]
};

const jobCategories = Object.keys(roleRequirements);

const workModes = ["Remote", "Hybrid", "On-site"] as const;
const jobTypes = ["Full-time", "Part-time", "Contract", "Temporary", "Internship"] as const;
const levels = ["Internship", "Entry level", "Associate", "Mid-Senior level", "Director", "Executive"] as const;

function buildUsers(): DemoUser[] {
  return Array.from({ length: 18 }).map((_, index) => {
    const first = firstNames[index % firstNames.length];
    const last = lastNames[(index * 3) % lastNames.length];
    const fullName = `${first} ${last}`;
    const username = `${first}.${last}`.toLowerCase();
    const role = index === 0 ? "admin" : index % 5 === 0 ? "employer" : "candidate";
    const title = role === "candidate"
      ? candidateTitles[index % candidateTitles.length]
      : role === "employer"
        ? employerTitles[index % employerTitles.length]
        : "Platform Administrator";
    const company = role !== "candidate" ? `${companyNamePrefixes[index % companyNamePrefixes.length]} ${companyNameSuffixes[index % companyNameSuffixes.length]}` : undefined;
    const location = locations[index % locations.length];
    const activity = index % 4 === 0 ? "low" : index % 3 === 0 ? "medium" : "high";
    const category = jobCategories[index % jobCategories.length];
    const skills = roleRequirements[category].slice(0, 3);
    return {
      id: index + 1,
      username,
      fullName,
      role,
      title,
      company,
      location,
      activity,
      skills,
      experienceSummary: `${title} focused on measurable delivery and cross-functional collaboration.`,
      education: `${universities[index % universities.length]} · Bachelor of Software Engineering`,
      avatarUrl: `https://i.pravatar.cc/120?img=${(index % 70) + 1}`
    };
  });
}

function buildCompanies(): Company[] {
  return Array.from({ length: 28 }).map((_, index) => {
    const name = `${companyNamePrefixes[index % companyNamePrefixes.length]}${companyNameSuffixes[(index + 2) % companyNameSuffixes.length]}`;
    return {
      id: index + 1,
      ownerUsername: demoUsers[(index + 1) % demoUsers.length].username,
      name,
      industry: industries[index % industries.length],
      location: locations[index % locations.length],
      size: `${50 + index * 25} employees`,
      description: `${name} builds hiring-grade products with strong delivery focus in ${industries[index % industries.length]}.`,
      website: `https://${name.toLowerCase()}.example.com`,
      status: index % 7 === 0 ? "Pending" : "Active",
      logoUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(name)}`
    };
  });
}

function buildJobs(): Job[] {
  const jobs: Job[] = [];
  for (let index = 0; index < 120; index++) {
    const company = demoCompanies[index % demoCompanies.length];
    const category = jobCategories[index % jobCategories.length];
    const level = levels[index % levels.length];
    const mode = workModes[index % workModes.length];
    const type = jobTypes[index % jobTypes.length];
    const baseSalary = 35000 + (index % 12) * 9000;
    const strict = index % 5 === 0;
    const requirements = [
      ...roleRequirements[category].slice(0, strict ? 4 : 2),
      ...(strict ? ["Kubernetes", "System Design"] : [])
    ];
    jobs.push({
      id: index + 1,
      title: `${level} ${category.replace("&", "and")} Specialist`,
      company: company.name,
      companyId: company.id,
      location: company.location,
      workMode: mode,
      type,
      category,
      categoryId: (index % jobCategories.length) + 1,
      level,
      salaryMin: baseSalary,
      salaryMax: baseSalary + 22000,
      currency: "USD",
      salary: `$${baseSalary.toLocaleString()} - $${(baseSalary + 22000).toLocaleString()}`,
      status: index % 9 === 0 ? "Closed" : "Open",
      postedAt: `${(index % 14) + 1} days ago`,
      description: `Join ${company.name} to deliver high-impact ${category.toLowerCase()} outcomes with measurable business value.`,
      requirements,
      deadline: index % 7 === 0 ? undefined : new Date(Date.now() + (index % 30 + 5) * 86400000).toISOString().slice(0, 10),
      vacancyCount: (index % 4) + 1
    });
  }
  return jobs;
}

function buildNotifications(): Notification[] {
  const messages = [
    "A recruiter viewed your profile",
    "New high-match role is available",
    "Connection request from hiring manager",
    "Your application moved to reviewed",
    "Follow-up reminder for recruiter outreach",
    "Interview slot opened this week"
  ];
  return Array.from({ length: 70 }).map((_, index) => ({
    id: index + 1,
    message: `${messages[index % messages.length]} · ${demoJobs[index % demoJobs.length].company}`,
    type: index % 4 === 0 ? "Application Update" : index % 3 === 0 ? "Message" : index % 5 === 0 ? "Connection" : "Job Match",
    isRead: index % 3 === 0,
    createdAt: new Date(Date.now() - index * 1000 * 60 * 47).toISOString()
  }));
}

function buildConversations(): DemoConversation[] {
  return demoUsers
    .filter((user) => user.role !== "admin")
    .slice(0, 12)
    .map((user, index) => ({
      id: index + 1,
      participantUsername: user.username,
      participantName: user.fullName,
      participantRole: user.title,
      participantCompany: user.company ?? demoCompanies[index % demoCompanies.length].name,
      avatar: `${user.fullName.split(" ").map((part) => part[0]).join("").slice(0, 2)}`,
      status: index % 4 === 0 ? "offline" : index % 3 === 0 ? "away" : "online",
      unread: index % 5 === 0 ? 0 : (index % 4) + 1,
      lastSeen: index % 3 === 0 ? "Yesterday" : `${index + 2}m ago`,
      lastMessage: index % 2 === 0
        ? "Can we schedule a short call about this opportunity?"
        : "Thanks for your application. Could you share one recent project?",
      messages: [
        "Hi, I saw your profile and wanted to connect about an open role.",
        "Thanks for reaching out. I’m interested and can share my latest project summary.",
        "Great. Are you available for a quick call this week?"
      ]
    }));
}

function buildConnections(): DemoConnectionEdge[] {
  const edges: DemoConnectionEdge[] = [];
  for (let index = 0; index < demoUsers.length; index++) {
    const source = demoUsers[index];
    const targetA = demoUsers[(index + 2) % demoUsers.length];
    const targetB = demoUsers[(index + 5) % demoUsers.length];
    edges.push({
      sourceUsername: source.username,
      targetUsername: targetA.username,
      strength: index % 3 === 0 ? "high" : "medium",
      lastInteractionDays: (index % 7) + 1
    });
    edges.push({
      sourceUsername: source.username,
      targetUsername: targetB.username,
      strength: index % 4 === 0 ? "low" : "medium",
      lastInteractionDays: (index % 18) + 2
    });
  }
  return edges;
}

function buildApplications(): Application[] {
  return Array.from({ length: 48 }).map((_, index) => ({
    id: index + 1,
    jobId: demoJobs[index].id,
    jobTitle: demoJobs[index].title,
    company: demoJobs[index].company,
    status: index % 11 === 0 ? "Rejected" : index % 9 === 0 ? "Accepted" : index % 5 === 0 ? "Shortlisted" : index % 3 === 0 ? "Reviewed" : "Pending",
    appliedAt: new Date(Date.now() - index * 86400000).toISOString().slice(0, 10),
    candidateUsername: demoUsers[(index + 2) % demoUsers.length].username,
    resumeId: (index % 4) + 1,
    coverLetter: "I align with this role and can deliver measurable outcomes across your listed requirements."
  }));
}

function buildResumes(): Resume[] {
  return Array.from({ length: 5 }).map((_, index) => ({
    id: index + 1,
    userId: 2,
    fileName: `Resume_${index + 1}_2026.pdf`,
    filePath: `/resumes/resume_${index + 1}.pdf`,
    uploadedAt: new Date(Date.now() - index * 86400000 * 12).toISOString()
  }));
}

function buildSavedJobs(): SavedJob[] {
  return demoJobs.slice(0, 16).map((job, index) => ({
    id: index + 1,
    jobId: job.id,
    jobTitle: job.title,
    companyName: job.company,
    location: job.location,
    jobType: job.type,
    status: "Saved",
    savedAt: new Date(Date.now() - index * 86400000 * 2).toISOString()
  }));
}

export const demoUsers = buildUsers();
export const demoCompanies = buildCompanies();
export const demoJobs = buildJobs();
export const demoNotifications = buildNotifications();
export const demoConversations = buildConversations();
export const demoConnections = buildConnections();
export let demoApplicationsStore = buildApplications();
export let demoResumesStore = buildResumes();
export let demoSavedJobsStore = buildSavedJobs();

export function listDemoJobs(filters?: Partial<JobFilters>): Job[] {
  let rows = demoJobs.slice();
  if (!filters) return rows;
  if (filters.query?.trim()) {
    const q = filters.query.toLowerCase();
    rows = rows.filter((job) => `${job.title} ${job.company} ${job.description}`.toLowerCase().includes(q));
  }
  if (filters.locations?.length) {
    rows = rows.filter((job) => filters.locations?.includes(job.location));
  }
  if (filters.jobType?.length) {
    rows = rows.filter((job) => filters.jobType?.includes(job.type));
  }
  if (filters.workType?.length) {
    rows = rows.filter((job) => filters.workType?.includes(job.workMode));
  }
  if (filters.experienceLevel?.length) {
    rows = rows.filter((job) => filters.experienceLevel?.includes(job.level));
  }
  if (filters.companies?.length) {
    rows = rows.filter((job) => filters.companies?.includes(job.company));
  }
  if (filters.minSalary?.[0]) {
    const min = Number(filters.minSalary[0]);
    rows = rows.filter((job) => (job.salaryMax ?? 0) >= min);
  }
  return rows;
}

export function findDemoJob(id: number): Job | undefined {
  return demoJobs.find((job) => job.id === id);
}

export function findDemoCompany(id: number): Company | undefined {
  return demoCompanies.find((company) => company.id === id);
}

export function findDemoUserByUsername(username: string): DemoUser | undefined {
  return demoUsers.find((user) => user.username === username);
}

export function getDemoUserProfile(): UserProfile {
  const user = demoUsers[1];
  return {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    email: `${user.username}@jobplus.app`,
    phone: "+86 139 8888 1000",
    role: "ROLE_CANDIDATE",
    status: "ACTIVE"
  };
}

export function getDemoCandidateProfile(): CandidateProfile {
  const user = demoUsers[1];
  return {
    userId: user.id,
    username: user.username,
    fullName: user.fullName,
    email: `${user.username}@jobplus.app`,
    phone: "+86 139 8888 1000",
    address: user.location,
    education: user.education,
    experienceSummary: user.experienceSummary,
    avatarUrl: user.avatarUrl,
    linkedinUrl: `https://linkedin.com/in/${user.username}`,
    githubUrl: `https://github.com/${user.username.replace(".", "")}`,
    updatedAt: new Date().toISOString()
  };
}

export function saveDemoJob(jobId: number): SavedJob {
  const job = findDemoJob(jobId);
  if (!job) {
    throw new Error("Job not found");
  }
  const existing = demoSavedJobsStore.find((item) => item.jobId === jobId);
  if (existing) return existing;
  const saved: SavedJob = {
    id: demoSavedJobsStore.length + 1,
    jobId,
    jobTitle: job.title,
    companyName: job.company,
    location: job.location,
    jobType: job.type,
    status: "Saved",
    savedAt: new Date().toISOString()
  };
  demoSavedJobsStore = [saved, ...demoSavedJobsStore];
  return saved;
}

export function removeDemoSavedJob(jobId: number): void {
  demoSavedJobsStore = demoSavedJobsStore.filter((item) => item.jobId !== jobId);
}

export function createDemoApplication(payload: { jobId: number; resumeId?: number | null; coverLetter?: string }): Application {
  const job = findDemoJob(payload.jobId);
  if (!job) {
    throw new Error("Job not found");
  }
  const created: Application = {
    id: demoApplicationsStore.length + 1,
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    status: "Pending",
    appliedAt: new Date().toISOString().slice(0, 10),
    candidateUsername: demoUsers[1].username,
    resumeId: payload.resumeId ?? null,
    coverLetter: payload.coverLetter ?? null
  };
  demoApplicationsStore = [created, ...demoApplicationsStore];
  return created;
}
