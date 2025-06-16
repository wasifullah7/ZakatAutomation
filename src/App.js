import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import AdminDashboard from './components/dashboard/AdminDashboard';
import DonorDashboard from './components/dashboard/DonorDashboard';
import AcceptorDashboard from './components/dashboard/AcceptorDashboard';
import DonorProfile from './pages/profile/DonorProfile';
import AcceptorProfile from './pages/profile/AcceptorProfile';
import TermsAndConditions from './pages/TermsAndConditions/TermsAndConditions';
import DonorApplicationsPage from './pages/admin/DonorApplicationsPage';
import AcceptorApplicationsPage from './pages/admin/AcceptorApplicationsPage';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedRoute = ({ children, roles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // A simple loading state, or you can use a proper LoadingSpinner component
  }

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
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
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
            path="/admin/donor-applications"
            element={
              <ProtectedRoute roles={['admin']}>
                <DonorApplicationsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/acceptor-applications"
            element={
              <ProtectedRoute roles={['admin']}>
                <AcceptorApplicationsPage />
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
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 