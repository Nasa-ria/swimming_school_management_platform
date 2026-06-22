import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Flexible Guard for Role-Based Access Control.
 * @param {Array} allowedRoles - e.g. ['admin', 'instructor']
 */
export default function RoleGuard({ children, allowedRoles }) {
  const { user, isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;

  // 1. Not logged in -> Redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Logged in but wrong role -> Redirect to unauthorized
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. Authorized -> Render content
  return children;
}
