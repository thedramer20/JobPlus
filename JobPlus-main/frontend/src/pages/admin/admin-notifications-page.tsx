import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listAdminNotificationsData, markNotificationAsRead } from "../../services/admin-service";

export function AdminNotificationsPage() {
  const queryClient = useQueryClient();
  const { data: notifications = [] } = useQuery({
    queryKey: ["admin", "notifications"],
    queryFn: listAdminNotificationsData
  });

  const markReadMutation = useMutation({
    mutationFn: (id: number) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
    }
  });

  return (
    <section className="surface" style={{ padding: "1.2rem" }}>
      <div className="space-between">
        <div>
          <h2 style={{ margin: 0 }}>Messages / Notifications</h2>
          <p className="helper">Monitor alerts and jump to related moderation tasks.</p>
        </div>
        <span className="pill">{notifications.filter((item) => !item.isRead).length} unread</span>
      </div>
      <div className="stack" style={{ marginTop: "1rem" }}>
        {notifications.map((item) => (
          <article key={item.id} className="card">
            <div className="space-between">
              <div className="stack" style={{ gap: "0.3rem" }}>
                <strong>{item.message}</strong>
                <span className="helper">{new Date(item.createdAt).toLocaleString()}</span>
              </div>
              <div className="row">
                <span className="tag">{item.type}</span>
                {!item.isRead ? (
                  <button className="btn btn-secondary" onClick={() => markReadMutation.mutate(item.id)}>
                    Mark read
                  </button>
                ) : (
                  <span className="status status-success">Read</span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

