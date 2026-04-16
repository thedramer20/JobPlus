export type UiPersonalityMode = "minimal" | "professional" | "dynamic";
export type UiIntent = "jobs" | "messages" | "network" | "profile" | "general";
export type DaySegment = "morning" | "afternoon" | "evening" | "night";

interface UiBehaviorState {
  pageViews: Record<string, number>;
  interactions: Record<UiIntent, number>;
  lastRoute?: string;
  lastUpdatedAt: string;
}

const STORAGE_KEY = "jobplus-ui-intelligence-v1";

const emptyState: UiBehaviorState = {
  pageViews: {},
  interactions: {
    jobs: 0,
    messages: 0,
    network: 0,
    profile: 0,
    general: 0
  },
  lastUpdatedAt: new Date().toISOString()
};

export interface UiInsights {
  dominantIntent: UiIntent;
  daySegment: DaySegment;
  totalInteractions: number;
  actionBias: {
    jobs: number;
    messages: number;
    network: number;
    profile: number;
  };
}

export interface NextActionItem {
  id: string;
  title: string;
  description: string;
  href: string;
  relevance: number;
}

export function recordPageView(pathname: string): void {
  if (!pathname) return;
  const state = readState();
  state.pageViews[pathname] = (state.pageViews[pathname] ?? 0) + 1;
  state.lastRoute = pathname;
  state.lastUpdatedAt = new Date().toISOString();

  const inferredIntent = inferIntentFromPath(pathname);
  state.interactions[inferredIntent] = (state.interactions[inferredIntent] ?? 0) + 1;
  writeState(state);
}

export function recordIntentInteraction(intent: UiIntent, weight = 1): void {
  const state = readState();
  state.interactions[intent] = Math.max(0, (state.interactions[intent] ?? 0) + weight);
  state.lastUpdatedAt = new Date().toISOString();
  writeState(state);
}

export function getUiInsights(): UiInsights {
  const state = readState();
  const actionBias = {
    jobs: state.interactions.jobs ?? 0,
    messages: state.interactions.messages ?? 0,
    network: state.interactions.network ?? 0,
    profile: state.interactions.profile ?? 0
  };

  const ranked = Object.entries({
    jobs: actionBias.jobs,
    messages: actionBias.messages,
    network: actionBias.network,
    profile: actionBias.profile,
    general: state.interactions.general ?? 0
  }).sort((a, b) => b[1] - a[1]);

  const dominantIntent = (ranked[0]?.[0] as UiIntent | undefined) ?? "general";

  return {
    dominantIntent,
    daySegment: getDaySegment(),
    totalInteractions: Object.values(state.interactions).reduce((sum, current) => sum + current, 0),
    actionBias
  };
}

export function buildNextActions(role: string | undefined): NextActionItem[] {
  const insights = getUiInsights();

  const baseActions: NextActionItem[] = [
    {
      id: "action-jobs",
      title: "Apply to a matching role",
      description: "High-fit openings are waiting in your jobs pipeline.",
      href: "/jobs",
      relevance: 72 + insights.actionBias.jobs
    },
    {
      id: "action-messages",
      title: "Follow up with recruiters",
      description: "Keep response velocity high with proactive messaging.",
      href: role === "employer" ? "/employer/messages" : "/app/messages",
      relevance: 66 + insights.actionBias.messages
    },
    {
      id: "action-profile",
      title: "Upgrade your profile quality",
      description: "Sharper profile signals improve your opportunity score.",
      href: role === "admin" ? "/admin/profile" : "/app/profile",
      relevance: 64 + insights.actionBias.profile
    }
  ];

  const sorted = [...baseActions].sort((left, right) => right.relevance - left.relevance);
  return sorted.slice(0, 3);
}

export function getOpportunityRadar(): Array<{ label: string; value: number }> {
  const insights = getUiInsights();
  const jobsBias = Math.min(100, 42 + insights.actionBias.jobs * 3);
  const networkBias = Math.min(100, 38 + insights.actionBias.network * 3);
  const profileBias = Math.min(100, 44 + insights.actionBias.profile * 2);
  const momentum = Math.min(100, 30 + Math.floor(insights.totalInteractions * 1.6));

  return [
    { label: "Role Match Momentum", value: jobsBias },
    { label: "Network Signal Strength", value: networkBias },
    { label: "Profile Attractiveness", value: profileBias },
    { label: "Opportunity Velocity", value: momentum }
  ];
}

function inferIntentFromPath(pathname: string): UiIntent {
  const path = pathname.toLowerCase();
  if (path.includes("job")) return "jobs";
  if (path.includes("message")) return "messages";
  if (path.includes("network") || path.includes("company")) return "network";
  if (path.includes("profile") || path.includes("setting")) return "profile";
  return "general";
}

function getDaySegment(): DaySegment {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 22) return "evening";
  return "night";
}

function readState(): UiBehaviorState {
  if (typeof window === "undefined") return { ...emptyState };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...emptyState };
    const parsed = JSON.parse(raw) as UiBehaviorState;
    return {
      ...emptyState,
      ...parsed,
      interactions: {
        ...emptyState.interactions,
        ...(parsed.interactions ?? {})
      },
      pageViews: parsed.pageViews ?? {}
    };
  } catch {
    return { ...emptyState };
  }
}

function writeState(state: UiBehaviorState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage failures to keep UI stable.
  }
}
