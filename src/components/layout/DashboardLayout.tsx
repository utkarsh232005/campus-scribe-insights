import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [user, setUser] = useState({
    name: "",
    role: "",
    avatar: "/placeholder.svg"
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          // Redirect to login if no session
          navigate('/login');
          return;
        }

        // Get user data
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError || !userData.user) {
          navigate('/login');
          return;
        }

        // Extract display name or use email as fallback
        const displayName = userData.user.user_metadata?.full_name || userData.user.email?.split('@')[0] || "User";
        
        // Set user data for Header component
        setUser({
          name: displayName,
          role: userData.user.user_metadata?.department ? 
            userData.user.user_metadata.department.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
            "Faculty Member",
          avatar: userData.user.user_metadata?.avatar_url || "/placeholder.svg"
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-black p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
