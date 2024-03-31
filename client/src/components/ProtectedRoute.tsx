import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Checks the current user's state from the useAuth Hook and redirects them to the homescreen if they are not authenticated:
export const ProtectedRoute = ({ children }:any) => {
  const { user } = useAuth();
  if (!user) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }
  return children;
};
