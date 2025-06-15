import React from 'react';
import './_metronic/assets/sass/style.scss';
import './_metronic/assets/sass/plugins.scss';
import './_metronic/assets/sass/style.react.scss';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import TermsAndConditions from './pages/TermsAndConditions/TermsAndConditions';
import './styles/icons.css';
import './styles/dashboard.css';
import './App.css';
import {ThemeModeProvider} from './_metronic/partials/layout/theme-mode/ThemeModeProvider';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './components/dashboard/AdminDashboard';
import DonorDashboard from './components/dashboard/DonorDashboard';
import AcceptorDashboard from './components/dashboard/AcceptorDashboard';
import DonorProfile from './pages/profile/DonorProfile';
import AcceptorProfile from './pages/profile/AcceptorProfile';
import DashboardLayout from './components/dashboard/DashboardLayout';

// Component to handle role-based redirects
const RoleBasedRedirect = () => {
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

  // Redirect to role-specific dashboard
  switch (user.role) {
    case 'admin':
      return <Navigate to="/dashboard/admin" replace />;
    case 'donor':
      return <Navigate to="/dashboard/donor" replace />;
    case 'acceptor':
      return <Navigate to="/dashboard/acceptor" replace />;
    default:
      return <Navigate to="/signin" replace />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ThemeModeProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            
            {/* Protected routes with role-based access */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<RoleBasedRedirect />} />
              <Route path="/dashboard/admin" element={
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              } />
              <Route path="/dashboard/donor" element={
                <DashboardLayout>
                  <DonorDashboard />
                </DashboardLayout>
              } />
              <Route path="/dashboard/acceptor" element={
                <DashboardLayout>
                  <AcceptorDashboard />
                </DashboardLayout>
              } />
              <Route path="/profile/donor" element={
                <DashboardLayout>
                  <DonorProfile />
                </DashboardLayout>
              } />
              <Route path="/profile/acceptor" element={
                <DashboardLayout>
                  <AcceptorProfile />
                </DashboardLayout>
              } />
            </Route>

            {/* Redirect /login to /signin */}
            <Route path="/login" element={<Navigate to="/signin" replace />} />
            
            {/* Default route */}
            <Route path="/" element={<RoleBasedRedirect />} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ThemeModeProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
