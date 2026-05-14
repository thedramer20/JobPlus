import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listAdminSupportTicketsData } from "../../services/admin-service";

export function AdminSupportPage() {
  const { data: tickets = [] } = useQuery({ queryKey: ["admin", "support-tickets"], queryFn: listAdminSupportTicketsData });
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    return tickets.filter((ticket) => {
      const normalized = query.toLowerCase();
      const matchesQuery =
        ticket.subject.toLowerCase().includes(normalized) ||
        ticket.requester.toLowerCase().includes(normalized) ||
        ticket.assignedTo.toLowerCase().includes(normalized);
      const matchesPriority = priority === "all" || ticket.priority === priority;
      const matchesStatus = status === "all" || ticket.status === status;
      return matchesQuery && matchesPriority && matchesStatus;
    });
  }, [tickets, query, priority, status]);

  return (
    <section className="surface jp-admin-section">
      <div className="space-between">
        <div>
          <h2 style={{ margin: 0 }}>Support & Escalation Center</h2>
          <p className="helper">Resolve user and recruiter tickets with SLA-aware workflows.</p>
        </div>
        <div className="row" style={{ flexWrap: "wrap" }}>
          <button className="btn btn-secondary">Assign Bulk</button>
          <button className="btn btn-primary">Create Ticket</button>
        </div>
      </div>

      <div className="row jp-admin-filter-row">
        <input className="input" placeholder="Search ticket, requester, owner..." value={query} onChange={(event) => setQuery(event.target.value)} />
        <select className="select" value={priority} onChange={(event) => setPriority(event.target.value)}>
          <option value="all">All priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select className="select" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In progress</option>
          <option value="waiting">Waiting</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <table className="table" style={{ marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Requester</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Assigned</th>
            <th>SLA</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((ticket) => (
            <tr key={ticket.id}>
              <td>
                <strong>{ticket.subject}</strong>
                <div className="helper">#{ticket.id}</div>
              </td>
              <td>
                {ticket.requester}
                <div className="helper">{ticket.requesterRole}</div>
              </td>
              <td><span className="tag">{ticket.category}</span></td>
              <td><span className={`status ${ticket.priority === "critical" ? "status-danger" : ticket.priority === "high" ? "status-warning" : "status-info"}`}>{ticket.priority}</span></td>
              <td><span className="tag">{ticket.status}</span></td>
              <td>{ticket.assignedTo}</td>
              <td><strong style={{ color: ticket.slaHoursLeft < 8 ? "var(--danger)" : "inherit" }}>{ticket.slaHoursLeft}h</strong></td>
              <td>
                <div className="row">
                  <button className="btn btn-secondary">Open</button>
                  <button className="btn btn-secondary">Escalate</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
