/**
 * ProtectedRoute Component
 * Wrapper for routes that require authentication
 */

import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export const ProtectedRoute = ({
  children,
  requiredRole = null,
  redirectTo = '/login',
}) => {
  const { isAuthenticated, isAdmin } = useAuth();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check if user has required role
  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default ProtectedRoute;
