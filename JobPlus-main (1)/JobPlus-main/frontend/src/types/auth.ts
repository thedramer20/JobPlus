export type UserRole = "guest" | "candidate" | "employer" | "admin";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  title?: string;
  company?: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}
