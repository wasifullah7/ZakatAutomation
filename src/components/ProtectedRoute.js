import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import AppHeader from './common/AppHeader';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    if (user?.role === 'admin') {
      return <Navigate to="/dashboard/admin/dashboard" replace />;
    } else if (user?.role === 'donor') {
      return <Navigate to="/dashboard/donor/dashboard" replace />;
    } else if (user?.role === 'acceptor') {
      return <Navigate to="/dashboard/acceptor/dashboard" replace />;
    } else {
      return <Navigate to="/signin" replace />;
    }
  }

  return (
    <div className="app-wrapper">
      <AppHeader />
      <div className="app-container container-fluid py-4">
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedRoute; 