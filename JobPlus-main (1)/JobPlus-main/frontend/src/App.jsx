import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar/Navbar';
import Footer from './components/common/Footer/Footer';

// Pages (lazy loaded for performance)
const Home       = React.lazy(() => import('./pages/Home/Home'));
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
const Admin      = React.lazy(() => import('./pages/Admin/Admin'));
const NotFound   = React.lazy(() => import('./pages/NotFound/NotFound'));

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="jp-loading-screen"><div className="jp-spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Admin Route wrapper
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'ADMIN') return <Navigate to="/" replace />;
  return children;
};

const AppInner = () => {
  const { user, signOut } = useAuth();
  return (
    <>
      <Navbar user={user} onSignOut={signOut} />
      <main style={{ paddingTop: 'var(--nav-height)' }}>
        <React.Suspense fallback={<div className="jp-page-loader" />}>
          <Routes>
            <Route path="/"              element={<Home />} />
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
    </>
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