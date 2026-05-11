import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import NotificationBell from '../components/NotificationBell.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { to: '/dashboard', label: 'Discover', icon: 'explore' },
  { to: '/my-clubs', label: 'My Clubs', icon: 'groups' },
  { to: '/events', label: 'Events', icon: 'event' },
  { to: '/profile', label: 'Profile', icon: 'person' }
];

function NavItem({ to, label, icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      end={to === '/dashboard'}
      className={({ isActive }) =>
        `flex items-center gap-4 rounded-full px-4 py-3 text-label-lg transition-all duration-150 active:scale-[0.98] ${
          isActive
            ? 'bg-primary-container text-on-primary-container font-semibold'
            : 'text-on-surface-variant hover:bg-surface-container-high'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className="material-symbols-outlined"
            style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            {icon}
          </span>
          {label}
        </>
      )}
    </NavLink>
  );
}

function BottomNavItem({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      end={to === '/dashboard'}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-full transition-all duration-150 active:scale-95 ${
          isActive
            ? 'bg-primary-container text-on-primary-container'
            : 'text-on-surface-variant'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className="material-symbols-outlined text-[22px]"
            style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            {icon}
          </span>
          <span className="text-[10px] font-semibold leading-tight">{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function AppLayout() {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function submitSearch(event) {
    event.preventDefault();
    navigate(`/discover${query ? `?q=${encodeURIComponent(query)}` : ''}`);
  }

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-background font-sans antialiased">
      {/* Desktop Side Nav */}
      <nav className="hidden lg:flex flex-col w-64 flex-shrink-0 h-screen bg-surface-container-low border-r border-outline-variant overflow-y-auto">
        <div className="flex flex-col h-full p-4 gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3 px-2 pt-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm flex-shrink-0">
              A
            </div>
            <div>
              <h1 className="text-headline-sm font-bold text-primary leading-tight">APUCircle</h1>
              <p className="text-label-md text-on-surface-variant">Student Infrastructure</p>
            </div>
          </div>

          {/* Main Nav */}
          <div className="flex-1 flex flex-col gap-1">
            {navItems.map((item) => (
              <NavItem key={item.to} to={item.to} label={item.label} icon={item.icon} />
            ))}
          </div>

          {/* Secondary Nav + User */}
          <div className="flex flex-col gap-1 mt-auto">
            <NavItem to="/apply-leader" label="Apply Leader" icon="workspace_premium" />
            <NavItem to="/notifications" label="Notifications" icon="notifications" />
            <div className="border-t border-outline-variant my-2" />
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-surface-container">
              <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-xs font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-label-lg text-on-surface font-semibold truncate">{user?.fullName}</p>
              </div>
              <button
                onClick={logout}
                className="text-on-surface-variant hover:text-primary transition-colors"
                title="Logout"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Top Bar */}
        <header className="lg:hidden flex-shrink-0 bg-surface/90 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-4 py-3 z-40">
          <h1 className="text-headline-sm font-bold text-primary">APUCircle</h1>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <Link to="/profile" className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 md:px-12 py-8 pb-28 lg:pb-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-outline-variant rounded-t-xl shadow-lg">
        <div className="flex justify-around items-center px-2 py-2">
          {navItems.map((item) => (
            <BottomNavItem key={item.to} to={item.to} label={item.label} icon={item.icon} />
          ))}
          <BottomNavItem to="/apply-leader" label="Leader" icon="workspace_premium" />
        </div>
      </nav>
    </div>
  );
}
