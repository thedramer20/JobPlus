export interface Company {
  id: number;
  ownerUsername?: string;
  name: string;
  industry: string;
  location: string;
  size: string;
  description: string;
  website: string;
  status?: string;
  logoUrl?: string;
}
