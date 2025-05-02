
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: string;
  email: string;
  user_metadata: {
    department?: string;
    role?: string;
  };
}

interface AdminUser {
  email: string;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Enhanced function to check if a user is admin with better error handling
  const checkIfUserIsAdmin = async (email: string): Promise<boolean> => {
    try {
      console.log("Checking admin status for:", email);
      
      // Validate email
      if (!email || typeof email !== 'string' || email.trim() === '') {
        console.error('Cannot check admin status: invalid email format');
        return false;
      }
      
      // Normalize the email (trim and lowercase)
      const normalizedEmail = email.trim().toLowerCase();
      
      // Direct SQL query using RPC function to avoid RLS issues
      const { data, error } = await supabase
        .rpc('get_admin_status', { admin_email: normalizedEmail });
      
      if (error) {
        console.error('Error checking admin status via RPC:', error);
        
        // Fallback to direct query if RPC fails
        const { data: adminData, error: adminQueryError } = await supabase
          .from('admin_users')
          .select('email, is_active')
          .eq('email', normalizedEmail)
          .single();
        
        if (adminQueryError) {
          if (adminQueryError.code === 'PGRST116') {
            // No matching record found
            console.log('No admin record found for email:', normalizedEmail);
            return false;
          }
          console.error('Admin query error:', adminQueryError);
          return false;
        }
        
        return Boolean(adminData && adminData.is_active === true);
      }
      
      // RPC function should return a boolean indicating admin status
      console.log("Admin check result:", data);
      return Boolean(data);
      
    } catch (error) {
      console.error('Unexpected error in admin check:', error);
      return false;
    }
  };
  
  useEffect(() => {
    const fetchUserSession = async () => {
      setLoading(true);
      try {
        // Get current session and handle accordingly
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error);
          return;
        }

        if (session) {
          setUser(session.user as User);
          
          // Check admin status with a delay to avoid recursion issues
          const userEmail = session.user.email || '';
          console.log("Checking admin status on session load for:", userEmail);
          
          setTimeout(async () => {
            try {
              const userIsAdmin = await checkIfUserIsAdmin(userEmail);
              setIsAdmin(userIsAdmin);
              console.log('User admin status:', userIsAdmin);
            } catch (adminError) {
              console.error('Admin check error:', adminError);
              setIsAdmin(false);
            }
          }, 100);
          
          console.log('Session found:', session.user);
          console.log('User metadata:', session.user.user_metadata);
        }
      } catch (error) {
        console.error('Error in auth check:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSession();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user as User);
        
        // Check admin status with a delay to avoid recursion issues
        const userEmail = session.user?.email || '';
        
        // Use setTimeout to prevent recursive RLS policy issues
        setTimeout(async () => {
          try {
            const userIsAdmin = await checkIfUserIsAdmin(userEmail);
            setIsAdmin(userIsAdmin);
            console.log('Is admin:', userIsAdmin);
          } catch (adminError) {
            console.error('Admin check error:', adminError);
            setIsAdmin(false);
          }
        }, 100);
        
        console.log('Signed in user:', session.user);
        console.log('User metadata:', session.user.user_metadata);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAdmin(false);
        // Redirect to landing page on sign out
        navigate('/');
      } else if (event === 'USER_UPDATED') {
        // Handle user updates
        setUser(session?.user as User);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;
      
      if (data.user) {
        setUser(data.user as User);
        
        // Check admin status but don't block the login process
        setTimeout(async () => {
          try {
            const userIsAdmin = await checkIfUserIsAdmin(data.user.email || '');
            setIsAdmin(userIsAdmin);
          } catch (adminError) {
            console.error('Admin check error during sign in:', adminError);
            setIsAdmin(false);
          }
        }, 100);
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      if (!email || !password) {
        toast({
          title: "Admin login failed",
          description: "Email and password are required",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      // First try to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: "Admin login failed",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      if (!data.user) {
        toast({
          title: "Admin login failed",
          description: "User account not found",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      // Now check if user is an admin - with proper error handling
      try {
        const isAdminUser = await checkIfUserIsAdmin(email);
        
        if (!isAdminUser) {
          // If not admin, sign out immediately and show error
          await supabase.auth.signOut();
          setUser(null);
          setIsAdmin(false);
          
          toast({
            title: "Admin access denied",
            description: "This email is not registered as an active admin",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        // User is admin - complete the login process
        setUser(data.user as User);
        setIsAdmin(true);
        
        toast({
          title: "Admin login successful",
          description: "Welcome, Admin!",
        });
        navigate('/admin');
      } catch (adminCheckError) {
        console.error("Admin check error:", adminCheckError);
        await supabase.auth.signOut();
        setUser(null);
        setIsAdmin(false);
        
        toast({
          title: "Admin verification failed",
          description: "There was an error verifying your admin status. Please try again later.",
          variant: "destructive",
        });
      }
      
    } catch (error: any) {
      console.error("Admin login error:", error);
      toast({
        title: "Admin login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
      toast({
        title: "Logged out",
        description: "You've been successfully signed out.",
      });
      // Redirect to landing page after logout
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signIn, signOut, adminLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
