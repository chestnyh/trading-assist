import { Navigate } from 'react-router-dom';

/**
 * Component that redirects to /sign-in page
 */
export function RedirectToSignIn() {
  return <Navigate to="/sign-in" replace />;
}
