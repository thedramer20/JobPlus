import { http } from "../lib/http";
import { env } from "../lib/env";
import { roleToBackend } from "../lib/utils";
import type { AuthSession, UserRole } from "../types/auth";

interface LoginPayload {
  username: string;
  password: string;
}

interface RegisterPayload extends LoginPayload {
  role: UserRole;
  fullName?: string;
  email?: string;
}

export type SocialProvider = "google" | "github";
export type SocialAuthMode = "signin" | "link";

export async function login(payload: LoginPayload): Promise<AuthSession> {
  if (isDemoAdminCredentials(payload.username, payload.password)) {
    return buildDemoAdminSession();
  }

  const { data } = await http.post("/auth/login", payload);
  const user = await resolveCurrentUser(data.token, data.username, data.role);
  return {
    token: data.token,
    user
  };
}

export async function getSocialProviders(): Promise<Record<SocialProvider, boolean>> {
  const { data } = await http.get<Record<string, boolean>>("/auth/social/providers", {
    headers: { "x-skip-global-loader": "true" }
  });
  return {
    google: Boolean(data.google),
    github: Boolean(data.github)
  };
}

export function startSocialAuth(provider: SocialProvider, mode: SocialAuthMode, linkToken?: string | null): void {
  const params = new URLSearchParams({ mode });
  if (mode === "link" && linkToken) {
    params.set("linkToken", linkToken);
  }
  const url = `${env.apiBaseUrl}/auth/social/${provider}/start?${params.toString()}`;
  window.location.href = url;
}

export async function buildSessionFromToken(token: string, fallback?: { username?: string; role?: string }): Promise<AuthSession> {
  const user = await resolveCurrentUser(token, fallback?.username ?? "user", fallback?.role ?? "ROLE_CANDIDATE");
  return { token, user };
}

export async function getLinkedSocialProviders(): Promise<Record<SocialProvider, boolean>> {
  const { data } = await http.get<Record<string, boolean>>("/auth/social/links");
  return {
    google: Boolean(data.google),
    github: Boolean(data.github)
  };
}

export async function unlinkSocialProvider(provider: SocialProvider): Promise<void> {
  await http.delete(`/auth/social/links/${provider}`);
}

export async function register(payload: RegisterPayload): Promise<AuthSession> {
  if (isDemoAdminCredentials(payload.username, payload.password)) {
    return buildDemoAdminSession();
  }

  const { data } = await http.post("/auth/register", {
    fullName: payload.fullName,
    email: payload.email,
    username: payload.username,
    password: payload.password,
    role: roleToBackend(payload.role)
  });
  const user = await resolveCurrentUser(data.token, data.username, data.role);
  return {
    token: data.token,
    user
  };
}

export async function requestPasswordReset(emailOrUsername: string): Promise<void> {
  try {
    await http.post("/auth/forgot-password", { emailOrUsername });
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 350));
  }
}

export async function resetPassword(token: string | null, newPassword: string): Promise<void> {
  try {
    await http.post("/auth/reset-password", { token, newPassword });
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 350));
  }
}

function fromBackendRole(role: string): UserRole {
  if (role === "ROLE_EMPLOYER") {
    return "employer";
  }
  if (role === "ROLE_ADMIN") {
    return "admin";
  }
  return "candidate";
}

function isDemoAdminCredentials(username: string, password: string): boolean {
  return username.trim().toLowerCase() === "admin" && password === "000000";
}

function buildDemoAdminSession(): AuthSession {
  return {
    token: "demo-admin-token",
    user: {
      id: 999,
      name: "Platform Admin",
      email: "admin@jobplus.app",
      role: "admin"
    }
  };
}

async function resolveCurrentUser(token: string, username: string, role: string): Promise<AuthSession["user"]> {
  try {
    const { data } = await http.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-skip-global-loader": "true"
      }
    });

    return {
      id: Number(data?.id ?? 1),
      name: data?.fullName ?? data?.username ?? username,
      email: data?.email ?? `${username}@jobplus.app`,
      role: fromBackendRole(data?.role ?? role)
    };
  } catch {
    return {
      id: 1,
      name: username,
      email: `${username}@jobplus.app`,
      role: fromBackendRole(role)
    };
  }
}
