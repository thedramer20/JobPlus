import { Search, Briefcase, Building2 } from 'lucide-react';
import './EmptyState.css';

type EmptyStateType = 'jobs' | 'companies' | 'search' | 'notifications' | 'messages';

const CONFIGS = {
  jobs:          { icon: Briefcase, title: 'No jobs found',       sub: 'Try different keywords or filters.' },
  companies:     { icon: Building2, title: 'No companies yet',    sub: 'Check back soon.' },
  search:        { icon: Search,    title: 'No results',          sub: 'Try a different search term.' },
  notifications: { icon: null,      title: 'All caught up!',      sub: 'No new notifications.' },
  messages:      { icon: null,      title: 'No conversations yet',sub: 'Start networking to get messages.' },
};

export const EmptyState = ({
  type,
  onAction,
  actionLabel
}: {
  type: EmptyStateType;
  onAction?: () => void;
  actionLabel?: string;
}) => {
  const { icon: Icon, title, sub } = CONFIGS[type];
  return (
    <div className="empty-state">
      {Icon && (
        <div className="empty-state__icon">
          <Icon size={32} />
        </div>
      )}
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__sub">{sub}</p>
      {onAction && actionLabel && (
        <button className="empty-state__btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};
