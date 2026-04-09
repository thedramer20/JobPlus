import { useQuery } from "@tanstack/react-query";
import { EmptyState } from "../components/shared/empty-state";
import { listNotifications } from "../services/meta-service";

export function NotificationsPage() {
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: listNotifications
  });

  return (
    <div className="stack">
      <div>
        <div className="eyebrow">Notifications</div>
        <h2 className="headline" style={{ fontSize: "2rem", margin: "0.35rem 0 0" }}>Stay updated on everything that matters.</h2>
      </div>
      {isLoading ? <div className="surface" style={{ padding: "1.3rem" }}>Loading notifications...</div> : null}
      {!isLoading && notifications.length === 0 ? (
        <EmptyState title="No notifications yet" description="Application updates and hiring activity will appear here." />
      ) : null}
      {!isLoading ? notifications.map((notification) => (
        <div key={notification.id} className="card stack">
          <div className="space-between">
            <strong>{notification.type}</strong>
            <span className="helper">{notification.createdAt.slice(0, 10)}</span>
          </div>
          <div className="helper">{notification.message}</div>
        </div>
      )) : null}
    </div>
  );
}
