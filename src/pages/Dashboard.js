import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import DonorDashboard from '../components/dashboard/DonorDashboard';
import AcceptorDashboard from '../components/dashboard/AcceptorDashboard';
import AppHeader from '../components/common/AppHeader';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="app-wrapper">
      <AppHeader />
      <div className="app-container container-fluid">
        {user.role === 'admin' && <AdminDashboard />}
        {user.role === 'donor' && <DonorDashboard />}
        {user.role === 'acceptor' && <AcceptorDashboard />}
      </div>
    </div>
  );
};

export default Dashboard; 