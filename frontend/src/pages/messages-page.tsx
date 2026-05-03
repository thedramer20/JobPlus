import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
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
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="jp-messages-layout"
      style={{
        background: "var(--bg-base, #0A0A0F)",
        minHeight: "100vh"
      }}
    >
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="surface jp-messages-list jp-reveal-up glass-card"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          padding: "24px"
        }}
      >
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-between"
          style={{ alignItems: "center", marginBottom: "24px" }}
        >
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{
              fontFamily: "var(--font-display, Syne, sans-serif)",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--text-primary, #F0F0FF)",
              margin: 0
            }}
          >{t("common.messages")}</motion.h2>
          <motion.span
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="jp-message-count-pill"
            aria-label={`${conversations.length} conversations`}
            style={{
              background: "rgba(108, 99, 255, 0.15)",
              color: "#22C55E",
              padding: "6px 16px",
              borderRadius: "999px",
              fontSize: "0.875rem",
              fontWeight: 600
            }}
          >{conversations.length}</motion.span>
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="stack jp-reveal-stagger"
          style={{ gap: "0.6rem" }}
        >
          {conversations.map((conversation, index) => (
            <motion.button
              key={conversation.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.9 + (index * 0.1),
                duration: 0.5,
                type: "spring",
                stiffness: 200,
                damping: 25
              }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => {
                recordIntentInteraction("messages", 1);
                setActiveId(conversation.id);
              }}
              className={`jp-message-item jp-reveal ${conversation.id === activeId ? "is-active" : ""}`}
              style={{
                background: conversation.id === activeId 
                  ? "rgba(108, 99, 255, 0.1)" 
                  : "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                border: conversation.id === activeId
                  ? "1px solid rgba(108, 99, 255, 0.3)"
                  : "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "16px",
                width: "100%",
                textAlign: "left"
              }}
            >
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1 + (index * 0.1), duration: 0.4 }}
                className="jp-message-avatar"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "var(--brand-gradient, linear-gradient(135deg, #6C63FF 0%, #3DCFEF 100%))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontSize: "1rem",
                  fontWeight: 600,
                  marginRight: "12px"
                }}
              >{conversation.avatar}</motion.span>
              <motion.span
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1 + (index * 0.1), duration: 0.4 }}
                className="jp-message-meta"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px"
                }}
              >
                <motion.strong
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2 + (index * 0.1), duration: 0.4 }}
                  style={{
                    color: "var(--text-primary, #F0F0FF)",
                    fontSize: "1rem",
                    fontWeight: 600
                  }}
                >{conversation.name}</motion.strong>
                <motion.small
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.3 + (index * 0.1), duration: 0.4 }}
                  style={{
                    color: "var(--text-secondary, #8888AA)",
                    fontSize: "0.875rem"
                  }}
                >{conversation.role} - {conversation.company}</motion.small>
                <motion.small
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.4 + (index * 0.1), duration: 0.4 }}
                  style={{
                    color: "var(--text-muted, #44445A)",
                    fontSize: "0.75rem"
                  }}
                >{conversation.lastMessage}</motion.small>
              </motion.span>
              <motion.span
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5 + (index * 0.1), duration: 0.4 }}
                className="jp-message-end"
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center"
                }}
              >
                <motion.small
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.6 + (index * 0.1), duration: 0.4 }}
                  style={{
                    color: "var(--text-secondary, #8888AA)",
                    fontSize: "0.75rem"
                  }}
                >{conversation.lastSeen}</motion.small>
                {conversation.unread ? (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.7 + (index * 0.1), duration: 0.4 }}
                    className="jp-message-unread"
                    style={{
                      background: "rgba(239, 68, 68, 0.15)",
                      color: "#EF4444",
                      padding: "4px 8px",
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                      fontWeight: 600
                    }}
                  >{conversation.unread}</motion.span>
                ) : null}
              </motion.span>
            </motion.button>
          ))}
        </motion.div>
      </motion.aside>

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
    </motion.section>
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
