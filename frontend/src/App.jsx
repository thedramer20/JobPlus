import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast/Toast';
import Navbar from './components/common/Navbar/Navbar';
import Footer from './components/common/Footer/Footer';
import { BottomTabBar } from './components/common/BottomTabBar/BottomTabBar';

// Pages (lazy loaded for performance)
const Landing    = React.lazy(() => import('./pages/Landing/Landing'));
const Login      = React.lazy(() => import('./pages/Auth/Login'));
const Register   = React.lazy(() => import('./pages/Auth/Register'));
const Jobs       = React.lazy(() => import('./pages/Jobs/Jobs'));
const JobDetail  = React.lazy(() => import('./pages/Jobs/JobDetail'));
const Profile    = React.lazy(() => import('./pages/Profile/Profile'));
const Companies  = React.lazy(() => import('./pages/Companies/Companies'));
const CompanyProfile = React.lazy(() => import('./pages/CompanyProfile/CompanyProfile'));
const Network    = React.lazy(() => import('./pages/Network/Network'));
const Messages   = React.lazy(() => import('./pages/Messages/Messages'));
const Notifs     = React.lazy(() => import('./pages/Notifications/Notifications'));
const Settings   = React.lazy(() => import('./pages/Settings/Settings'));
const Admin      = React.lazy(() => import('./pages/admin/Admin'));
const NotFound   = React.lazy(() => import('./pages/NotFound/NotFound'));

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #f7faff 0%, #f4f7fb 100%)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#2563eb' }}>Loading...</div>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Admin Route wrapper
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'ADMIN') return <Navigate to="/" replace />;
  return children;
};

// Main App Component with loading state
const AppInner = () => {
  const { user, loading, signOut } = useAuth();

  // Show loading screen while auth is being checked
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #f7faff 0%, #f4f7fb 100%)',
        color: '#0f172a',
        fontFamily: '"DM Sans", "Segoe UI", sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '0.82rem',
            fontWeight: '800',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#2563eb',
            marginBottom: '0.7rem'
          }}>
            JobPlus
          </div>
          <h1 style={{ margin: '0.7rem 0 0.4rem', fontSize: '2rem' }}>Loading the application...</h1>
          <p style={{ margin: '0', color: '#526072' }}>Preparing your workspace and product experience.</p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <Navbar user={user} onSignOut={signOut} />
      <main style={{ paddingTop: 'var(--nav-height)' }}>
        <React.Suspense fallback={<div className="jp-page-loader" />}>
          <Routes>
            <Route path="/"              element={<Landing />} />
            <Route path="/login"         element={<Login />} />
            <Route path="/register"      element={<Register />} />
            <Route path="/jobs"          element={<Jobs />} />
            <Route path="/jobs/:id"      element={<JobDetail />} />
            <Route path="/companies"     element={<Companies />} />
            <Route path="/companies/:id" element={<CompanyProfile />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/network"       element={<ProtectedRoute><Network /></ProtectedRoute>} />
            <Route path="/messages"      element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifs /></ProtectedRoute>} />
            <Route path="/settings"      element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/admin/*"       element={<AdminRoute><Admin /></AdminRoute>} />
            <Route path="*"              element={<NotFound />} />
          </Routes>
        </React.Suspense>
      </main>
      <Footer />
      <BottomTabBar user={user} />
    </ToastProvider>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  </BrowserRouter>
);

export default App;