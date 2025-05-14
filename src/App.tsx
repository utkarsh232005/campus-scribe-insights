import React from 'react';
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "@/components/ui/sonner"
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Faculty from './pages/Faculty';
import Awards from './pages/Awards';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AdminDashboard from './pages/admin/AdminDashboardNew';
import UserManagement from './pages/admin/UserManagement';
import AuthCallback from './pages/AuthCallback';
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';
import FacultyProjectPage from './pages/FacultyProjectPage';
import ReportSubmission from './pages/ReportSubmission';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Reports from './pages/Reports';
import { useAuth } from './context/AuthContext';
import { ChartGrid } from '@/components/charts/ChartGrid';
import { ChartCard } from '@/components/charts/ChartCard';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { AreaChart } from '@/components/charts/AreaChart';
import { DonutChart } from '@/components/charts/DonutChart';

// Special component to handle logout
const LogoutRoute = () => {
  const { signOut } = useAuth();
  
  React.useEffect(() => {
    signOut();
  }, [signOut]);
  
  return <Navigate to="/" replace />;
};

// Wrap the LogoutRoute in AuthProvider
const LogoutRouteWithAuth = () => (
  <AuthProvider>
    <LogoutRoute />
  </AuthProvider>
);

const App = () => (
  <AuthProvider>
    <NotificationProvider>
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/logout" element={<LogoutRouteWithAuth />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/faculty"
          element={
            <PrivateRoute>
              <Faculty />
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <Reports />
            </PrivateRoute>
          }
        />
        <Route
          path="/submit-report"
          element={
            <PrivateRoute>
              <ReportSubmission />
            </PrivateRoute>
          }
        />
        <Route
          path="/awards"
          element={
            <PrivateRoute>
              <Awards />
            </PrivateRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <PrivateRoute>
              <Calendar />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </NotificationProvider>
  </AuthProvider>
);

export default App;
