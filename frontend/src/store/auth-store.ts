import { create } from "zustand";
import type { AuthSession, AuthUser, UserRole } from "../types/auth";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  login: (session: AuthSession) => void;
  logout: () => void;
  setDemoRole: (role: UserRole) => void;
}

const savedSession = loadSession();

export const authStore = create<AuthState>((set) => ({
  token: savedSession?.token ?? null,
  user: savedSession?.user ?? null,
  login: (session) => {
    saveSession(session);
    set({ token: session.token, user: session.user });
  },
  logout: () => {
    window.localStorage.removeItem("jobplus-auth");
    set({ token: null, user: null });
  },
  setDemoRole: (role) => {
    const nextUser: AuthUser = {
      id: 1,
      name: role === "employer" ? "Nadia Mensah" : role === "admin" ? "Platform Admin" : "Amina Yusuf",
      email: `${role}@jobplus.app`,
      role,
      title: role === "candidate" ? "Backend Developer" : undefined,
      company: role === "employer" ? "JobPlus Labs" : undefined
    };
    const nextSession = {
      token: `${role}-demo-token`,
      user: nextUser
    };
    saveSession(nextSession);
    set({ token: nextSession.token, user: nextUser });
  }
}));

function loadSession(): AuthSession | null {
  const raw = window.localStorage.getItem("jobplus-auth");
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

function saveSession(session: AuthSession): void {
  window.localStorage.setItem("jobplus-auth", JSON.stringify(session));
}
