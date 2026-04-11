import { useState, type CSSProperties } from "react";

type ReactionType = "like";

interface PostEngagementBarProps {
  likes?: number;
  comments?: number;
  userReaction?: ReactionType | null;
  onLikeClick?: () => void;
  onCommentSubmit?: (content: string) => void;
  commentsOpen?: boolean;
  onCommentToggle?: (nextOpen: boolean) => void;
  onShareClick?: () => void;
  isBusy?: boolean;
}

function formatCount(value: number): string {
  return value.toLocaleString("en-US");
}

export default function PostEngagementBar({
  likes = 0,
  comments = 0,
  userReaction = null,
  onLikeClick,
  onCommentSubmit,
  commentsOpen,
  onCommentToggle,
  onShareClick,
  isBusy = false
}: PostEngagementBarProps) {
  const [internalCommentOpen, setInternalCommentOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const commentOpen = commentsOpen ?? internalCommentOpen;

  const toggleComment = () => {
    const next = !commentOpen;
    if (typeof commentsOpen === "boolean") {
      onCommentToggle?.(next);
      return;
    }
    setInternalCommentOpen(next);
    onCommentToggle?.(next);
  };

  const handleCommentSubmit = () => {
    const content = draft.trim();
    if (!content) {
      return;
    }
    onCommentSubmit?.(content);
    setDraft("");
    if (typeof commentsOpen === "boolean") {
      onCommentToggle?.(false);
    } else {
      setInternalCommentOpen(false);
      onCommentToggle?.(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.summaryRow}>
        <div style={styles.leftSummary}>
          <span style={styles.summaryText}>{formatCount(likes)} likes</span>
        </div>
        <button type="button" onClick={toggleComment} style={styles.commentsLink}>
          {formatCount(comments)} comments
        </button>
      </div>

      <div style={styles.divider} />

      <div style={styles.actionRow}>
        <button
          type="button"
          onClick={onLikeClick}
          disabled={isBusy}
          style={{ ...styles.actionButton, ...(userReaction ? styles.actionButtonActive : {}) }}
        >
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
          </svg>
          <span>Like</span>
        </button>
        <button type="button" onClick={toggleComment} disabled={isBusy} style={styles.actionButton}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>Comment</span>
        </button>
        <button type="button" onClick={onShareClick} disabled={isBusy} style={styles.actionButton}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          <span>Share</span>
        </button>
      </div>

      {commentOpen ? (
        <div style={styles.composer}>
          <textarea
            style={styles.composerInput}
            placeholder="Write a comment..."
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          <div style={styles.composerActions}>
            <button type="button" style={styles.secondaryButton} onClick={toggleComment}>
              Cancel
            </button>
            <button type="button" style={styles.primaryButton} disabled={isBusy || !draft.trim()} onClick={handleCommentSubmit}>
              Post
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    width: "100%",
    background: "#ffffff",
    padding: "0 0 2px 0"
  },
  summaryRow: {
    minHeight: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "0 12px 8px 12px"
  },
  leftSummary: {
    display: "flex",
    alignItems: "center",
    minWidth: 0
  },
  summaryText: {
    fontSize: 14,
    color: "#666666",
    fontWeight: 400,
    whiteSpace: "nowrap"
  },
  commentsLink: {
    background: "transparent",
    border: "none",
    padding: 0,
    margin: 0,
    cursor: "pointer",
    fontSize: 14,
    color: "#666666",
    fontWeight: 400,
    whiteSpace: "nowrap"
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    margin: "0 12px"
  },
  actionRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    alignItems: "center",
    padding: "4px 8px 0 8px"
  },
  actionButton: {
    height: 40,
    background: "transparent",
    border: "none",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: "pointer",
    color: "#666666",
    fontSize: 14,
    fontWeight: 600,
    transition: "background-color 0.18s ease, color 0.18s ease"
  },
  actionButtonActive: {
    color: "#0a66c2"
  },
  composer: {
    padding: "8px 12px 6px"
  },
  composerInput: {
    width: "100%",
    minHeight: 74,
    borderRadius: 10,
    border: "1px solid #d1d5db",
    padding: "10px 12px",
    resize: "vertical",
    outline: "none",
    fontSize: 14,
    color: "#111827",
    background: "#ffffff"
  },
  composerActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 8
  },
  secondaryButton: {
    border: "1px solid #d1d5db",
    borderRadius: 999,
    padding: "6px 12px",
    background: "#ffffff",
    color: "#4b5563",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600
  },
  primaryButton: {
    border: "1px solid #0a66c2",
    borderRadius: 999,
    padding: "6px 12px",
    background: "#0a66c2",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600
  }
};
