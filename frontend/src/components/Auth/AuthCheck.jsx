/**
 * AuthCheck Component
 * Checks authentication status and renders appropriate content
 */

import { useEffect } from 'react';
import useAuth from '../hooks/useAuth';

export const AuthCheck = ({
  children,
  fallback = null,
  onAuthenticatedOnly = false,
  onUnauthenticatedOnly = false,
  onLoad = null,
}) => {
  const { isAuthenticated, initializeAuth } = useAuth();

  useEffect(() => {
    // Initialize auth state from localStorage
    initializeAuth();

    if (onLoad) {
      onLoad();
    }
  }, [initializeAuth, onLoad]);

  // Show fallback while checking auth status
  if (!isAuthenticated && (onAuthenticatedOnly || onUnauthenticatedOnly)) {
    return fallback;
  }

  // Only show if authenticated and flag is set
  if (onAuthenticatedOnly && !isAuthenticated) {
    return fallback;
  }

  // Only show if unauthenticated and flag is set
  if (onUnauthenticatedOnly && isAuthenticated) {
    return fallback;
  }

  return children;
};

export default AuthCheck;
