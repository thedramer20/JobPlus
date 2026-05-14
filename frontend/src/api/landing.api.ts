import client from './client';

export interface HomepageStats {
  totalJobSeekers: number;
  totalCompanies:  number;
  hiresThisMonth:  number;
  countries:       number;
}

export interface FeaturedJob {
  id:          number;
  title:       string;
  company:     { name: string; logoUrl: string; slug: string; };
  location:    string;
  locationType:'ON_SITE' | 'REMOTE' | 'HYBRID';
  salaryMin:   number;
  salaryMax:   number;
  jobType:     string;
  skills:      string[];
  matchScore?: number;
  isEasyApply: boolean;
  postedAt:    string;
}

export interface TopCompany {
  id:          number;
  name:        string;
  slug:        string;
  logoUrl:     string;
  industry:    string;
  openRoles:   number;
  rating:      number;
  isFollowing: boolean;
}

export interface Category {
  label:    string;
  jobCount: number;
  icon:     string;
}

export const landingAPI = {
  /**
   * GET /api/landing/stats
   * Returns platform-wide statistics for the stats bar
   * Backend: SELECT COUNT(*) queries on users, companies, applications tables
   */
  getStats: (): Promise<HomepageStats> =>
    client.get('/landing/stats').then((r: any) => r.data),

  /**
   * GET /api/jobs/featured?limit=6
   * Returns 6 featured/active jobs
   * If user is authenticated: includes personalized matchScore
   * Backend: SELECT * FROM jobs WHERE is_featured=1 AND status='ACTIVE' LIMIT 6
   */
  getFeaturedJobs: (): Promise<FeaturedJob[]> =>
    client.get('/jobs/featured', { params: { limit: 6 } }).then((r: any) => r.data),

  /**
   * GET /api/companies/top?limit=6
   * Returns 6 top companies sorted by open roles
   * Backend: SELECT c.*, COUNT(j.id) as openRoles FROM companies c
   *          LEFT JOIN jobs j ON j.company_id = c.id AND j.status='ACTIVE'
   *          GROUP BY c.id ORDER BY openRoles DESC LIMIT 6
   */
  getTopCompanies: (): Promise<TopCompany[]> =>
    client.get('/companies/top', { params: { limit: 6 } }).then((r: any) => r.data),

  /**
   * GET /api/jobs/categories
   * Returns job counts per category
   * Backend: SELECT industry, COUNT(*) as jobCount FROM jobs
   *          WHERE status='ACTIVE' GROUP BY industry
   */
  getCategories: (): Promise<Category[]> =>
    client.get('/jobs/categories').then((r: any) => r.data),

  /**
   * GET /api/jobs/live-ticker?limit=12
   * Returns latest 12 active job postings for the live ticker
   */
  getLiveTicker: (): Promise<FeaturedJob[]> =>
    client.get('/jobs/live-ticker', { params: { limit: 12 } }).then((r: any) => r.data),
};
