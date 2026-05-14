import type { UserRole } from "../types/auth";

export function formatRole(role: UserRole): string {
  if (role === "candidate") {
    return "Candidate";
  }
  if (role === "employer") {
    return "Employer";
  }
  if (role === "admin") {
    return "Admin";
  }
  return "Guest";
}

export function roleToBackend(role: UserRole): string {
  if (role === "candidate") {
    return "ROLE_CANDIDATE";
  }
  if (role === "employer") {
    return "ROLE_EMPLOYER";
  }
  if (role === "admin") {
    return "ROLE_ADMIN";
  }
  return "ROLE_CANDIDATE";
}

export function classNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}
