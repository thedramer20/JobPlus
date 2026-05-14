export interface JobCategory {
  id: number;
  name: string;
  description: string | null;
}

export interface Notification {
  id: number;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdminOverview {
  usersCount: number;
  companiesCount: number;
  jobsCount: number;
  openJobsCount: number;
}
