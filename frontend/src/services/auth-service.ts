import { http } from "../lib/http";
import { roleToBackend } from "../lib/utils";
import type { AuthSession, UserRole } from "../types/auth";

interface LoginPayload {
  username: string;
  password: string;
}

interface RegisterPayload extends LoginPayload {
  role: UserRole;
}

export async function login(payload: LoginPayload): Promise<AuthSession> {
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
  const { data } = await http.post("/auth/register", {
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

function fromBackendRole(role: string): UserRole {
  if (role === "ROLE_EMPLOYER") {
    return "employer";
  }
  if (role === "ROLE_ADMIN") {
    return "admin";
  }
  return "candidate";
}
