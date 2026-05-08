import { Menu, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import NotificationBell from '../components/NotificationBell.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { to: '/dashboard', label: 'Discover' },
  { to: '/my-clubs', label: 'My Clubs' },
  { to: '/events', label: 'Events' },
  { to: '/profile', label: 'Profile' }
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function submitSearch(event) {
    event.preventDefault();
    navigate(`/discover${query ? `?q=${encodeURIComponent(query)}` : ''}`);
    setOpen(false);
  }

  const nav = (
    <>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `border-b-2 px-2 py-2 text-sm font-bold ${
              isActive ? 'border-apu-crimson text-apu-crimson' : 'border-transparent text-graphite hover:text-apu-crimson'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
      <NavLink
        to="/apply-leader"
        onClick={() => setOpen(false)}
        className={({ isActive }) =>
          `border-b-2 px-2 py-2 text-sm font-bold ${
            isActive ? 'border-apu-crimson text-apu-crimson' : 'border-transparent text-graphite hover:text-apu-crimson'
          }`
        }
      >
        Apply Leader
      </NavLink>
    </>
  );

  return (
    <div className="min-h-screen bg-mist">
      <header className="sticky top-0 z-40 border-b border-line bg-white">
        <div className="h-1 bg-apu-crimson" />
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/dashboard" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center bg-apu-crimson text-sm font-black text-white">APU</span>
            <span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Student Life</span>
              <span className="block font-heading text-lg font-black leading-none text-navy">APUCircle</span>
            </span>
          </Link>
          <form onSubmit={submitSearch} className="ml-auto hidden min-w-0 flex-1 max-w-md items-center gap-2 border border-line bg-mist px-3 py-2 md:flex">
            <Search size={18} className="text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search clubs, interests, events"
              className="w-full bg-transparent text-sm outline-none"
            />
          </form>
          <nav className="hidden items-center gap-1 lg:flex">{nav}</nav>
          <NotificationBell />
          <button onClick={logout} className="hidden border border-line px-3 py-2 text-sm font-bold text-graphite hover:border-apu-crimson hover:text-apu-crimson lg:block">
            Logout
          </button>
          <button onClick={() => setOpen((value) => !value)} className="focus-ring p-2 text-navy lg:hidden" aria-label="Toggle navigation">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {open ? (
          <div className="border-t border-line bg-white px-4 py-3 lg:hidden">
            <form onSubmit={submitSearch} className="mb-3 flex items-center gap-2 border border-line bg-mist px-3 py-2">
              <Search size={18} className="text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search clubs"
                className="w-full bg-transparent text-sm outline-none"
              />
            </form>
            <nav className="grid gap-1">{nav}</nav>
            <button onClick={logout} className="mt-2 w-full border border-line px-3 py-2 text-left text-sm font-bold text-graphite">
              Logout
            </button>
          </div>
        ) : null}
      </header>
      <main>
        <div className="page-shell">
          <div className="mb-6 border-l-4 border-apu-crimson bg-white px-4 py-3 text-sm text-slate-600">
            Signed in as <span className="font-semibold text-navy">{user?.fullName}</span>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
