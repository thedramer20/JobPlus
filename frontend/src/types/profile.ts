export interface UserProfile {
  id: number;
  username: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  role: string;
  status: string;
}

export interface CandidateProfile {
  userId: number;
  username: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  education: string | null;
  experienceSummary: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  updatedAt: string | null;
}

export interface Resume {
  id: number;
  userId: number;
  fileName: string;
  filePath: string;
  uploadedAt: string;
}

export interface SavedJob {
  id: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  location: string;
  jobType: string;
  status: string;
  savedAt: string;
}
