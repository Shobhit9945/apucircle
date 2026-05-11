import { Link, NavLink, Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-outline-variant">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm">
              A
            </div>
            <div>
              <p className="text-label-md text-on-surface-variant leading-tight">Student Life</p>
              <p className="text-headline-sm font-bold text-primary leading-tight">APUCircle</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <NavLink
              to="/clubs"
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-label-lg transition-colors ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`
              }
            >
              Clubs
            </NavLink>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-label-lg transition-colors ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`
              }
            >
              Login
            </NavLink>
            <Link
              to="/register"
              className="bg-primary text-on-primary px-5 py-2 rounded-full text-label-lg hover:bg-primary-container transition-colors shadow-sm"
            >
              Register
            </Link>
          </div>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
