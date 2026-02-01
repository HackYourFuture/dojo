import { Navigate } from 'react-router-dom';

import { ReactNode } from 'react';
import { useAuth } from '../auth/hooks/useAuth';
// Checks the current user's state from the useAuth Hook and redirects them to the homescreen if they are not authenticated:
export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }
  return children;
};
