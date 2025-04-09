import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './AuthorizeView';

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const user = useContext(UserContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />; // create a 403 or unauthorized page if you like
  }

  return <>{children}</>;
};

export default ProtectedRoute;
