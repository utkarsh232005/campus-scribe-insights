
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Log the authentication state for debugging
    console.log("AdminRoute - Auth state:", { user, isAdmin, loading });
  }, [user, isAdmin, loading]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-2 animate-pulse">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm text-gray-400">Checking admin permissions...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page with a return path
    return <Navigate to="/login" state={{ from: location, adminRequired: true }} replace />;
  }

  if (!isAdmin) {
    // User is logged in but not an admin - show improved access denied UI
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-4 max-w-md text-center p-8 bg-gray-900 rounded-lg border border-red-900/20 shadow-lg shadow-red-900/10 animate-fade-in">
          <ShieldAlert className="h-16 w-16 text-red-500 animate-pulse" />
          <h1 className="text-2xl font-bold text-red-50">Admin Access Denied</h1>
          <p className="text-gray-300 mb-2">This email is not registered as an active admin</p>
          <p className="text-sm text-gray-400 mb-4">If you believe this is an error, please contact the system administrator to verify your admin account is active.</p>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button 
              onClick={() => window.history.back()} 
              className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors flex-1 text-gray-200"
            >
              Go Back
            </button>
            <button 
              onClick={() => window.location.href = "/login"} 
              className="px-4 py-3 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex-1"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
