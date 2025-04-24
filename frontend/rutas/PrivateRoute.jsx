import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PrivateRoute({ children, allowedRoles }) {
  const { isLoggedIn, userType } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(userType)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

export default PrivateRoute;