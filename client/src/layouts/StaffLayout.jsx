import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const items = [
  { to: '/staff/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/staff/clubs', label: 'Clubs', icon: 'groups' },
  { to: '/staff/users', label: 'Users', icon: 'manage_accounts' },
  { to: '/staff/applications', label: 'Applications', icon: 'assignment' },
  { to: '/staff/announcements', label: 'Announcements', icon: 'campaign' }
];

export default function StaffLayout() {
  const { logout, user } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-background font-sans antialiased">
      {/* Staff Side Nav */}
      <nav className="hidden lg:flex flex-col w-64 flex-shrink-0 h-screen bg-surface-container-low border-r border-outline-variant overflow-y-auto">
        <div className="flex flex-col h-full p-4 gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3 px-2 pt-2">
            <span
              className="material-symbols-outlined text-primary text-[32px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              trip_origin
            </span>
            <div>
              <h1 className="text-headline-sm font-bold text-primary leading-tight">APUCircle</h1>
              <p className="text-label-md text-on-surface-variant">Admin Portal</p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex-1 flex flex-col gap-1">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-full px-4 py-3 text-label-lg transition-all duration-150 ${
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
                      {item.icon}
                    </span>
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* User + Logout */}
          <div className="mt-auto">
            <div className="border-t border-outline-variant mb-3" />
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-surface-container">
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                {user?.fullName?.[0]?.toUpperCase() || 'S'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-label-lg text-on-surface font-semibold truncate">{user?.fullName || 'Staff'}</p>
                <p className="text-label-md text-on-surface-variant">University Staff</p>
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
        {/* Mobile Header */}
        <header className="lg:hidden flex-shrink-0 bg-surface border-b border-outline-variant flex justify-between items-center px-4 py-3 z-40">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-primary text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              trip_origin
            </span>
            <h1 className="text-headline-sm font-bold text-primary">APUCircle Staff</h1>
          </div>
          <button
            onClick={logout}
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        </header>

        {/* Desktop Top Bar */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-surface border-b border-outline-variant">
          <h2 className="text-headline-sm text-on-surface font-semibold">Admin Oversight Portal</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
              <input
                className="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all w-56"
                placeholder="Search clubs, users..."
                type="text"
              />
            </div>
          </div>
        </header>

        {/* Mobile Nav Tabs */}
        <div className="lg:hidden flex overflow-x-auto gap-1 px-4 py-2 bg-surface border-b border-outline-variant hide-scrollbar">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-md transition-colors ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`
              }
            >
              <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 md:px-12 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
