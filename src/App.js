import React, { useState, useMemo, createContext } from 'react';
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
import ApplicationHistoryPage from './pages/admin/ApplicationHistoryPage';
import ZakatCalculatorPage from './pages/ZakatCalculatorPage';
import ApprovedAcceptorsPage from './pages/admin/ApprovedAcceptorsPage';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

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
  const [mode, setMode] = useState('light'); // Default to light mode

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
        typography: {
          fontFamily: '"Manrope", sans-serif',
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
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
                path="/admin/application-history"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <ApplicationHistoryPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/approved-acceptors"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <ApprovedAcceptorsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/zakat-calculator"
                element={
                  <ProtectedRoute roles={['admin', 'donor', 'acceptor']}>
                    <ZakatCalculatorPage />
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
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App; 