import { Building2, LayoutDashboard, Megaphone, Users, ClipboardList } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const items = [
  { to: '/staff/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/staff/clubs', label: 'Clubs', icon: Building2 },
  { to: '/staff/users', label: 'Users', icon: Users },
  { to: '/staff/applications', label: 'Applications', icon: ClipboardList },
  { to: '/staff/announcements', label: 'Announcements', icon: Megaphone }
];

export default function StaffLayout() {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-mist lg:flex">
      <aside className="border-r border-black bg-black text-white lg:fixed lg:inset-y-0 lg:w-72">
        <div className="h-1 bg-apu-crimson" />
        <div className="flex items-center justify-between px-5 py-4 lg:block">
          <Link to="/staff/dashboard" className="block">
            <span className="block text-xs font-bold uppercase tracking-[0.18em] text-white/55">APUCircle</span>
            <span className="font-heading text-xl font-black">Staff Portal</span>
          </Link>
          <button onClick={logout} className="border border-white/20 px-3 py-2 text-sm font-bold hover:border-apu-crimson hover:text-white lg:mt-6 lg:w-full">
            Logout
          </button>
        </div>
        <nav className="grid gap-1 px-3 pb-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 border-l-2 px-3 py-2 text-sm font-bold ${
                    isActive ? 'border-apu-crimson bg-white text-navy' : 'border-transparent text-white/75 hover:border-apu-crimson hover:text-white'
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <main className="min-w-0 flex-1 lg:pl-72">
        <div className="border-b border-line bg-white px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-sm text-slate-500">Staff portal</p>
          <h1 className="font-heading text-2xl font-semibold text-navy">{user?.fullName || 'University Staff'}</h1>
        </div>
        <div className="page-shell">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
