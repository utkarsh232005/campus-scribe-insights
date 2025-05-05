
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AuthCallback from "./pages/AuthCallback";
import Reports from "./pages/Reports";
import ReportSubmission from "./pages/ReportSubmission";
import Calendar from "./pages/Calendar";
import Analytics from "./pages/Analytics";
import Departments from "./pages/Departments";
import NotFound from "./pages/NotFound";
import Faculty from "./pages/Faculty";
import Awards from "./pages/Awards";
import Analysis from "./pages/Analysis";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import PrivateRoute from "./components/auth/PrivateRoute";
import AdminRoute from "./components/auth/AdminRoute";
import Profile from "./pages/Profile";
import FacultyProjectPage from "./pages/FacultyProjectPage";
import { useAuth } from './context/AuthContext';

const queryClient = new QueryClient();

// Special component to handle logout
const LogoutRoute = () => {
  const { signOut } = useAuth();
  
  React.useEffect(() => {
    signOut();
  }, [signOut]);
  
  return <Navigate to="/" replace />;
};

const AppWithProviders = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={<PrivateRoute><Index /></PrivateRoute>} />
              <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
              <Route path="/submit-report" element={<PrivateRoute><ReportSubmission /></PrivateRoute>} />
              <Route path="/calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />
              <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
              <Route path="/departments" element={<PrivateRoute><Departments /></PrivateRoute>} />
              <Route path="/faculty" element={<PrivateRoute><Faculty /></PrivateRoute>} />
              <Route path="/awards" element={<PrivateRoute><Awards /></PrivateRoute>} />
              <Route path="/analysis" element={<PrivateRoute><Analysis /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/faculty-projects" element={<PrivateRoute><FacultyProjectPage /></PrivateRoute>} />
              
              {/* Admin routes */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
              
              {/* This route triggers logout functionality */}
              <Route path="/logout" element={<LogoutRoute />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default AppWithProviders;
