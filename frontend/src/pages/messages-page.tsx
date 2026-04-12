import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const [timeline, setTimeline] = useState<string[]>([
    t("messagesPage.seed.welcome"),
    t("messagesPage.seed.backendReady")
  ]);

  const activeConversation = useMemo(
    () => conversations.find((item) => item.id === activeId) ?? conversations[0],
    [activeId, conversations]
  );

  function sendMessage() {
    if (!draft.trim()) {
      return;
    }
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
      <aside className="surface jp-messages-list">
        <div className="space-between" style={{ alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>{t("common.messages")}</h2>
          <span className="pill">{conversations.length}</span>
        </div>
        <div className="stack" style={{ gap: "0.6rem" }}>
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              onClick={() => setActiveId(conversation.id)}
              className={`jp-message-item ${conversation.id === activeId ? "is-active" : ""}`}
            >
              <span className="jp-message-avatar">{conversation.avatar}</span>
              <span className="jp-message-meta">
                <strong>{conversation.name}</strong>
                <small>{conversation.role} • {conversation.company}</small>
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

      <article className="surface jp-messages-thread">
        <header className="space-between" style={{ alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0 }}>{activeConversation?.name}</h3>
            <div className="helper">
              {activeConversation?.role} • {activeConversation?.company} • {activeConversation?.status}
            </div>
          </div>
          <button className="btn btn-secondary" type="button">
            {t("messagesPage.viewProfile")}
          </button>
        </header>

        <div className="jp-messages-timeline">
          {timeline.map((entry, index) => (
            <div
              key={`${entry}-${index}`}
              className={`jp-message-bubble ${index % 2 === 0 ? "is-them" : "is-me"}`}
            >
              {entry}
            </div>
          ))}
        </div>

        <div className="jp-messages-compose">
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
