import { http } from "../lib/http";
import type { Company } from "../types/company";

interface CompanyDto {
  id: number;
  ownerUserId: number;
  ownerUsername: string;
  companyName: string;
  description: string | null;
  industry: string | null;
  location: string | null;
  website: string | null;
  logoUrl: string | null;
  companySize: string | null;
  status: string;
}

export async function listCompanies(): Promise<Company[]> {
  const { data } = await http.get<CompanyDto[]>("/api/companies");
  return data.map(mapCompany);
}

export async function getCompany(id: number): Promise<Company> {
  const { data } = await http.get<CompanyDto>(`/api/companies/${id}`);
  return mapCompany(data);
}

export async function getMyCompany(): Promise<Company> {
  const { data } = await http.get<CompanyDto>("/api/companies/me");
  return mapCompany(data);
}

export async function saveMyCompany(payload: {
  id?: number;
  companyName: string;
  description: string;
  industry: string;
  location: string;
  website: string;
  logoUrl: string;
  companySize: string;
  status?: string;
}): Promise<Company> {
  if (payload.id) {
    const { data } = await http.put<CompanyDto>(`/api/companies/${payload.id}`, payload);
    return mapCompany(data);
  }
  const { data } = await http.post<CompanyDto>("/api/companies", payload);
  return mapCompany(data);
}

function mapCompany(dto: CompanyDto): Company {
  return {
    id: dto.id,
    ownerUsername: dto.ownerUsername,
    name: dto.companyName,
    industry: dto.industry ?? "Not specified",
    location: dto.location ?? "Not specified",
    size: dto.companySize ?? "Not specified",
    description: dto.description ?? "No company description yet.",
    website: dto.website ?? "",
    logoUrl: dto.logoUrl ?? undefined,
    status: dto.status
  };
}
