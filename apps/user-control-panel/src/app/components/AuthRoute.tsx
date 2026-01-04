import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ReactNode } from 'react';

interface AuthRouteProps {
  children: ReactNode;
}

/**
 * Component that redirects authenticated users to /dashboard
 * and shows the auth form for unauthenticated users
 */
export function AuthRoute({ children }: AuthRouteProps) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
