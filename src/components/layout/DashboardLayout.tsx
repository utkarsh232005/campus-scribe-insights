
import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user: authUser } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  const [user, setUser] = useState({
    name: "",
    role: "",
    avatar: "/placeholder.svg"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First check if admin is logged in (using our custom admin authentication)
        const isAdminLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
        
        if (isAdminLoggedIn) {
          setUser({
            name: "Admin User",
            role: "Administrator",
            avatar: "/placeholder.svg"
          });
          setLoading(false);
          return;
        }
        
        // Get user data from Supabase if not admin
        if (authUser?.email) {
          // Extract display name or use email as fallback
          const displayName = authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || "User";
          
          // Set user data for Header component
          setUser({
            name: displayName,
            role: authUser.user_metadata?.department ? 
              authUser.user_metadata.department.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
              "Faculty Member",
            avatar: authUser.user_metadata?.avatar_url || "/placeholder.svg"
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authUser]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen bg-gradient-to-b ${isAdminRoute ? 'from-gray-900 to-purple-950/20' : 'from-gray-900 to-gray-950'}`}>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header user={user} isAdmin={isAdminRoute} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
            <div className={`backdrop-blur-sm rounded-xl border shadow-lg p-6 ${
              isAdminRoute ? 'bg-purple-900/5 border-purple-800/30' : 'bg-gray-900/30 border-gray-800/30'
            }`}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
