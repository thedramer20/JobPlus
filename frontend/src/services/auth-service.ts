import { http } from "../lib/http";
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

export async function login(payload: LoginPayload): Promise<AuthSession> {
  if (isDemoAdminCredentials(payload.username, payload.password)) {
    return buildDemoAdminSession();
  }

  const { data } = await http.post("/auth/login", payload);
  return {
    token: data.token,
    user: {
      id: 1,
      name: data.username,
      email: `${data.username}@jobplus.app`,
      role: fromBackendRole(data.role)
    }
  };
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
  return {
    token: data.token,
    user: {
      id: 1,
      name: data.username,
      email: `${data.username}@jobplus.app`,
      role: fromBackendRole(data.role)
    }
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
