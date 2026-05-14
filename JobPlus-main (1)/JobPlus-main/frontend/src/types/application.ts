export interface Application {
  id: number;
  jobId?: number;
  jobTitle: string;
  company?: string;
  status: "Pending" | "Reviewed" | "Shortlisted" | "Rejected" | "Accepted";
  appliedAt: string;
  candidateUsername?: string;
  resumeId?: number | null;
  coverLetter?: string | null;
}
