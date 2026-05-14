// src/components/common/Navbar/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Briefcase, Building2, Users, Search, MessageSquare, Bell, ChevronDown, User, Settings, LogOut, Bookmark } from 'lucide-react';
import Logo from '../Logo/Logo';
import './Navbar.css';

const NAV_ITEMS = [
  { label: 'Home',      icon: Home,      path: '/'          },
  { label: 'Feed',      icon: Compass,   path: '/feed'      },
  { label: 'Jobs',      icon: Briefcase, path: '/jobs'      },
  { label: 'Companies', icon: Building2, path: '/companies' },
  { label: 'Network',   icon: Users,     path: '/network'   },
];

const Navbar = ({ user, onSignOut }) => {
  const location = useLocation();
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifCount = 4;   // Replace with real count from store/API
  const msgCount   = 2;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAvatarOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav className="jp-nav" role="navigation" aria-label="Main navigation">
      <div className="jp-nav__inner">

        {/* LEFT — Logo */}
        <div className="jp-nav__left">
          <Logo size="md" />
        </div>

        {/* CENTER — Nav Links */}
        <div className="jp-nav__center">
          {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
            const isActive = location.pathname === path ||
              (path !== '/' && location.pathname.startsWith(path));
            return (
              <Link
                key={path}
                to={path}
                className={`jp-nav__item ${isActive ? 'jp-nav__item--active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="jp-nav__item-icon" strokeWidth={isActive ? 2.2 : 1.8} />
                <span className="jp-nav__item-label">{label}</span>
              </Link>
            );
          })}
        </div>

        {/* RIGHT — Actions */}
        <div className="jp-nav__right">

          {/* Search */}
          <button
            className="jp-nav__icon-btn"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
          >
            <Search size={18} strokeWidth={1.8} />
          </button>

          {/* Messages */}
          <Link to="/messages" className="jp-nav__icon-btn jp-nav__icon-btn--badge" aria-label={`Messages — ${msgCount} unread`}>
            <MessageSquare size={18} strokeWidth={1.8} />
            {msgCount > 0 && (
              <span className="jp-nav__badge" aria-hidden="true">
                {msgCount > 9 ? '9+' : msgCount}
              </span>
            )}
          </Link>

          {/* Notifications */}
          <Link to="/notifications" className="jp-nav__icon-btn jp-nav__icon-btn--badge" aria-label={`Notifications — ${notifCount} new`}>
            <Bell size={18} strokeWidth={1.8} />
            {notifCount > 0 && (
              <span className="jp-nav__badge jp-nav__badge--pulse" aria-hidden="true">
                {notifCount > 9 ? '9+' : notifCount}
              </span>
            )}
          </Link>

          {/* Divider */}
          <span className="jp-nav__divider" aria-hidden="true" />

          {/* Auth — logged out */}
          {!user && (
            <>
              <Link to="/login" className="jp-nav__btn jp-nav__btn--ghost">Sign in</Link>
              <Link to="/register" className="jp-nav__btn jp-nav__btn--primary">Sign up</Link>
            </>
          )}

          {/* Auth — logged in */}
          {user && (
            <div className="jp-nav__avatar-wrap" ref={dropdownRef}>
              <button
                className={`jp-nav__avatar ${avatarOpen ? 'jp-nav__avatar--open' : ''}`}
                onClick={() => setAvatarOpen(v => !v)}
                aria-expanded={avatarOpen}
                aria-haspopup="true"
                aria-label="Open user menu"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <span className="jp-nav__avatar-initials">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </button>

              {/* Dropdown */}
              {avatarOpen && (
                <div className="jp-nav__dropdown" role="menu" aria-label="User menu">
                  <div className="jp-nav__dropdown-header">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                  <div className="jp-nav__dropdown-divider" />
                  <Link
                    to={`/profile/${user.username ?? user.name?.toLowerCase().replace(/\s+/g, '-') ?? 'profile'}`}
                    className="jp-nav__dropdown-item"
                    role="menuitem"
                    onClick={() => setAvatarOpen(false)}
                  >
                    <User size={15} /> My Profile
                  </Link>
                  <Link to="/saved-jobs" className="jp-nav__dropdown-item" role="menuitem" onClick={() => setAvatarOpen(false)}>
                    <Bookmark size={15} /> Saved Jobs
                  </Link>
                  <Link to="/settings" className="jp-nav__dropdown-item" role="menuitem" onClick={() => setAvatarOpen(false)}>
                    <Settings size={15} /> Settings
                  </Link>
                  <div className="jp-nav__dropdown-divider" />
                  <button className="jp-nav__dropdown-item jp-nav__dropdown-item--danger" role="menuitem" onClick={() => { onSignOut(); setAvatarOpen(false); }}>
                    <LogOut size={15} /> Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;