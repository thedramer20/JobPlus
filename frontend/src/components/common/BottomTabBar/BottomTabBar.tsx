import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, Users, MessageSquare, User } from 'lucide-react';
import './BottomTabBar.css';

const TABS = [
  { to: '/home',      icon: Home,         label: 'Home'    },
  { to: '/jobs',      icon: Briefcase,    label: 'Jobs'    },
  { to: '/network',   icon: Users,        label: 'Network' },
  { to: '/messages',  icon: MessageSquare,label: 'Messages'},
  { to: '/profile',   icon: User,         label: 'Profile' },
];

export const BottomTabBar = ({ user }: { user: any }) => {
  const { pathname } = useLocation();
  if (!user) return null; // Only show when logged in

  return (
    <nav className="bottom-tab-bar" aria-label="Mobile navigation">
      {TABS.map(({ to, icon: Icon, label }) => {
        const active = pathname === to || pathname.startsWith(to);
        const dest = (to === '/profile' && user)
          ? `/profile/${user.username}`
          : to;
        return (
          <Link key={to} to={dest} className={`bottom-tab ${active ? 'bottom-tab--active' : ''}`}>
            <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
