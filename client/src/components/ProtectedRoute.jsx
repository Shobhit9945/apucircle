import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ staffOnly = false, studentOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-mist">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-apuBlue border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={staffOnly ? '/staff/login' : '/login'} replace state={{ from: location }} />;
  }

  if (staffOnly && user.role !== 'staff') return <Navigate to="/dashboard" replace />;
  if (studentOnly && user.role === 'staff') return <Navigate to="/staff/dashboard" replace />;

  return <Outlet />;
}
