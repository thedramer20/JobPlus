import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { NotificationsSkeleton } from "../components/shared/content-skeletons";
import { EmptyState } from "../components/shared/empty-state";
import { listNotifications } from "../services/meta-service";
import type { Notification } from "../types/meta";

type GroupedNotifications = Record<string, Notification[]>;
const GROUP_KEYS = ["Applications", "Messages", "Profile Activity", "Hiring Updates", "System"] as const;

export function NotificationsPage() {
  const { t } = useTranslation();
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: listNotifications,
    placeholderData: (previous) => previous
  });

  const grouped = useMemo(() => {
    const result: GroupedNotifications = {};
    notifications.forEach((notification) => {
      const key = mapCategory(notification.type);
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(notification);
    });
    return result;
  }, [notifications]);

  const orderedGroups = useMemo(
    () => GROUP_KEYS.filter((key) => grouped[key]?.length),
    [grouped]
  );

  return (
    <div className="stack">
      <div className="space-between" style={{ alignItems: "center" }}>
        <div>
          <div className="eyebrow">{t("common.notifications")}</div>
          <h2 className="headline" style={{ fontSize: "2rem", margin: "0.35rem 0 0" }}>
            {t("notificationsPage.title")}
          </h2>
        </div>
        <span className="pill">{t("notificationsPage.total", { count: notifications.length })}</span>
      </div>

      {isLoading ? <NotificationsSkeleton /> : null}

      {!isLoading && notifications.length === 0 ? (
        <EmptyState title={t("notificationsPage.emptyTitle")} description={t("notificationsPage.emptyDesc")} />
      ) : null}

      {!isLoading
        ? orderedGroups.map((group) => (
            <section key={group} className="surface jp-notification-group">
              <div className="space-between" style={{ alignItems: "center" }}>
                <h3 style={{ margin: 0 }}>{translateGroup(group, t)}</h3>
                <span className="helper">{grouped[group].length}</span>
              </div>
              <div className="stack" style={{ gap: "0.7rem", marginTop: "0.85rem" }}>
                {grouped[group].map((notification) => (
                  <article
                    key={notification.id}
                    className={`jp-notification-card ${notification.isRead ? "is-read" : "is-unread"}`}
                  >
                    <div className="space-between" style={{ alignItems: "center" }}>
                      <strong>{notification.type}</strong>
                      <span className="helper">{notification.createdAt.slice(0, 10)}</span>
                    </div>
                    <p className="helper" style={{ margin: "0.35rem 0 0" }}>
                      {notification.message}
                    </p>
                    {!notification.isRead ? <span className="jp-notification-unread-dot">{t("notificationsPage.unread")}</span> : null}
                  </article>
                ))}
              </div>
            </section>
          ))
        : null}
    </div>
  );
}

function mapCategory(type: string): string {
  const normalized = type.toLowerCase();
  if (normalized.includes("message")) return "Messages";
  if (normalized.includes("application")) return "Applications";
  if (normalized.includes("profile") || normalized.includes("connection")) return "Profile Activity";
  if (normalized.includes("job") || normalized.includes("company") || normalized.includes("hiring")) return "Hiring Updates";
  return "System";
}

function translateGroup(group: string, t: (key: string) => string): string {
  switch (group) {
    case "Applications":
      return t("notificationsPage.groups.applications");
    case "Messages":
      return t("notificationsPage.groups.messages");
    case "Profile Activity":
      return t("notificationsPage.groups.profile");
    case "Hiring Updates":
      return t("notificationsPage.groups.hiring");
    default:
      return t("notificationsPage.groups.system");
  }
}
