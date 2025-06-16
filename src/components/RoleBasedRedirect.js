import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';

const RoleBasedRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Or a loading spinner, but typically handled by App.js already
  }

  if (!user) {
    // If no user, redirect to signin
    return <Navigate to="/signin" replace />;
  }

  // Redirect based on user role
  switch (user.role) {
    case 'admin':
      return <Navigate to="/dashboard/admin/dashboard" replace />;
    case 'donor':
      return <Navigate to="/dashboard/donor/dashboard" replace />;
    case 'acceptor':
      return <Navigate to="/dashboard/acceptor/dashboard" replace />;
    default:
      // Fallback for unexpected roles
      return <Navigate to="/signin" replace />;
  }
};

export default RoleBasedRedirect; 