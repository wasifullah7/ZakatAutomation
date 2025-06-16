import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import AdminDashboard from './components/dashboard/AdminDashboard';
import DonorDashboard from './components/dashboard/DonorDashboard';
import AcceptorDashboard from './components/dashboard/AcceptorDashboard';
import DonorProfile from './pages/profile/DonorProfile';
import AcceptorProfile from './pages/profile/AcceptorProfile';
import TermsAndConditions from './pages/TermsAndConditions/TermsAndConditions';
import './App.css';

const ProtectedRoute = ({ children, roles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

const RoleBasedRedirect = () => {
  const { user } = useAuth();
  
  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" />;
  } else if (user?.role === 'donor') {
    return <Navigate to="/donor/dashboard" />;
  } else if (user?.role === 'acceptor') {
    return <Navigate to="/acceptor/dashboard" />;
  }
  
  return <Navigate to="/signin" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          
          <Route path="/" element={<RoleBasedRedirect />} />
          <Route path="/dashboard" element={<RoleBasedRedirect />} />
          
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/donor/dashboard"
            element={
              <ProtectedRoute roles={['donor']}>
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/acceptor/dashboard"
            element={
              <ProtectedRoute roles={['acceptor']}>
                <AcceptorDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/donor/profile"
            element={
              <ProtectedRoute roles={['donor']}>
                <DonorProfile />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/acceptor/profile"
            element={
              <ProtectedRoute roles={['acceptor']}>
                <AcceptorProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 