import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { recordIntentInteraction } from "../lib/ui-intelligence";
import { authStore } from "../store/auth-store";

type Conversation = {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  status: "online" | "away" | "offline";
  lastMessage: string;
  lastSeen: string;
  unread: number;
};

const conversationsSeed: Conversation[] = [
  {
    id: 1,
    name: "Nadia Mensah",
    role: "Engineering Manager",
    company: "JobPlus Labs",
    avatar: "NM",
    status: "online",
    lastMessage: "Can we schedule a technical interview this week?",
    lastSeen: "2m ago",
    unread: 2
  },
  {
    id: 2,
    name: "Ahmed Kareem",
    role: "Talent Partner",
    company: "NorthBridge",
    avatar: "AK",
    status: "away",
    lastMessage: "Thanks for applying. Please share your latest portfolio.",
    lastSeen: "1h ago",
    unread: 0
  },
  {
    id: 3,
    name: "Sophia Lin",
    role: "Recruiter",
    company: "Apex Fintech",
    avatar: "SL",
    status: "offline",
    lastMessage: "Your profile looks great for this backend role.",
    lastSeen: "Yesterday",
    unread: 1
  }
];

export function MessagesPage() {
  const { t } = useTranslation();
  const { user } = authStore();
  const [conversations] = useState(conversationsSeed);
  const [activeId, setActiveId] = useState(conversationsSeed[0]?.id ?? 0);
  const [draft, setDraft] = useState("");
  const [coachAdvice, setCoachAdvice] = useState("This reply is well timed; keep the tone concise and opportunity-focused.");
  const [timeline, setTimeline] = useState([t("messagesPage.seed.welcome"), t("messagesPage.seed.backendReady")]);

  const activeConversation = useMemo(
    () => conversations.find((item) => item.id === activeId) ?? conversations[0],
    [activeId, conversations]
  );

  const replyIntelligence = useMemo(
    () => estimateReplyChance(draft, activeConversation?.status ?? "offline"),
    [draft, activeConversation?.status]
  );

  const suggestions = useMemo(
    () => buildReplyBoostSuggestions(draft, activeConversation?.name ?? ""),
    [draft, activeConversation?.name]
  );

  function sendMessage() {
    if (!draft.trim()) {
      return;
    }
    recordIntentInteraction("messages", 2);
    setTimeline((current) => [...current, draft.trim()]);
    setDraft("");
  }

  if (!user) {
    return (
      <div className="surface jp-message-empty">
        <h2 style={{ marginTop: 0 }}>{t("common.messages")}</h2>
        <p className="helper">{t("messagesPage.loginRequired")}</p>
      </div>
    );
  }

  return (
    <section className="jp-messages-layout">
      <aside className="surface jp-messages-list jp-reveal-up">
        <div className="space-between" style={{ alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>{t("common.messages")}</h2>
          <span className="jp-message-count-pill" aria-label={`${conversations.length} conversations`}>
            {conversations.length}
          </span>
        </div>
        <div className="stack jp-reveal-stagger" style={{ gap: "0.6rem" }}>
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              onClick={() => {
                recordIntentInteraction("messages", 1);
                setActiveId(conversation.id);
              }}
              className={`jp-message-item jp-reveal ${conversation.id === activeId ? "is-active" : ""}`}
            >
              <span className="jp-message-avatar">{conversation.avatar}</span>
              <span className="jp-message-meta">
                <strong>{conversation.name}</strong>
                <small>{conversation.role} - {conversation.company}</small>
                <small>{conversation.lastMessage}</small>
              </span>
              <span className="jp-message-end">
                <small>{conversation.lastSeen}</small>
                {conversation.unread ? <span className="jp-message-unread">{conversation.unread}</span> : null}
              </span>
            </button>
          ))}
        </div>
      </aside>

      <article className="surface jp-messages-thread jp-reveal-up">
        <header className="space-between jp-reveal" style={{ alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0 }}>{activeConversation?.name}</h3>
            <div className="helper">
              {activeConversation?.role} - {activeConversation?.company} - {activeConversation?.status}
            </div>
          </div>
          <button className="btn btn-secondary" type="button">
            {t("messagesPage.viewProfile")}
          </button>
        </header>

        <div className="conversation-intel jp-reveal">
          <span className="metric positive">Reply readiness: high</span>
          <span className="metric">Estimated response: 12-18h</span>
          <span className="metric urgent">Best follow-up: set a clear next meeting request</span>
          <div className="helper" style={{ marginTop: "0.7rem" }}>
            {coachAdvice}
          </div>
        </div>

        <div className="jp-messages-timeline">
          {timeline.map((entry, index) => (
            <div key={`${entry}-${index}`} className={`jp-message-bubble ${index % 2 === 0 ? "is-them" : "is-me"}`}>
              {entry}
            </div>
          ))}
        </div>

        <div className="jp-messages-compose jp-reveal-up">
          <div className="surface jp-reply-intelligence">
            <div className="space-between" style={{ alignItems: "center" }}>
              <strong>Response Engine</strong>
              <span className="tag">{replyIntelligence.score}% reply chance</span>
            </div>
            <p className="helper" style={{ margin: "0.4rem 0 0.6rem" }}>
              {replyIntelligence.explanation}
            </p>
            <div className="row" style={{ gap: "0.45rem", flexWrap: "wrap" }}>
              {suggestions.map((suggestion) => (
                <button key={suggestion} type="button" className="btn btn-secondary" onClick={() => setDraft(suggestion)}>
                  Use suggestion
                </button>
              ))}
            </div>
          </div>
          <textarea
            className="textarea"
            placeholder={t("messagesPage.composePlaceholder")}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
              }
            }}
          />
          <div className="row" style={{ justifyContent: "flex-end" }}>
            <button className="btn btn-primary" type="button" onClick={sendMessage}>
              {t("messagesPage.send")}
            </button>
          </div>
        </div>
      </article>
    </section>
  );
}

function estimateReplyChance(message: string, status: "online" | "away" | "offline") {
  const length = message.trim().length;
  const statusBoost = status === "online" ? 16 : status === "away" ? 8 : 2;
  const brevityScore = length >= 45 && length <= 220 ? 28 : length > 0 ? 16 : 0;
  const clarityScore = /(\?|next|schedule|available|interview|time|role)/i.test(message) ? 22 : 8;
  const score = Math.min(95, Math.max(9, statusBoost + brevityScore + clarityScore + 24));

  if (!message.trim()) {
    return { score: 24, explanation: "Start with a concise message and clear ask to increase response velocity." };
  }
  if (length < 40) {
    return { score, explanation: "Add context and one clear ask. Very short messages get weaker reply rates." };
  }
  if (length > 260) {
    return { score, explanation: "Trim this down. Recruiters respond better to compact, direct outreach." };
  }
  return { score, explanation: "Good structure. You have a clear ask and strong timing profile for this contact." };
}

function buildReplyBoostSuggestions(current: string, name: string) {
  const safeName = name || "there";
  if (current.trim()) {
    return [
      `Hi ${safeName}, quick follow-up on the role. I can share a concise project summary if useful.`,
      `Hi ${safeName}, would a 15-minute chat this week be possible? I believe my profile aligns with the role scope.`
    ];
  }
  return [
    `Hi ${safeName}, I'm interested in this role and can share a short impact summary relevant to your team.`,
    `Hi ${safeName}, thanks for connecting. Could we schedule a quick call about the role requirements this week?`
  ];
}
