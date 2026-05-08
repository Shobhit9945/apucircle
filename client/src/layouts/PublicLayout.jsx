import { Link, NavLink, Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-mist">
      <header className="sticky top-0 z-30 border-b border-line bg-white">
        <div className="h-1 bg-apu-crimson" />
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="group flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center bg-apu-crimson text-sm font-black text-white">
              APU
            </span>
            <span>
              <span className="block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Student Life</span>
              <span className="block font-heading text-xl font-black text-navy">APUCircle</span>
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <NavLink to="/clubs" className="px-3 py-2 text-sm font-bold text-graphite hover:text-apu-crimson">
              Clubs
            </NavLink>
            <NavLink to="/login" className="px-3 py-2 text-sm font-bold text-graphite hover:text-apu-crimson">
              Login
            </NavLink>
            <Link to="/register" className="focus-ring bg-apu-crimson px-4 py-2 text-sm font-bold text-white hover:bg-crimson-dark">
              Register
            </Link>
          </div>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
