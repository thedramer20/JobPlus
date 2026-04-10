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
    removeSession();
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
  const raw = readSession();
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
  try {
    window.localStorage.setItem("jobplus-auth", JSON.stringify(session));
  } catch {
    // Ignore storage failures so auth state can still exist in memory.
  }
}

function readSession(): string | null {
  try {
    return window.localStorage.getItem("jobplus-auth");
  } catch {
    return null;
  }
}

function removeSession(): void {
  try {
    window.localStorage.removeItem("jobplus-auth");
  } catch {
    // Ignore storage failures so logout still clears in-memory state.
  }
}
