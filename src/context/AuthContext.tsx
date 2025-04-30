
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
  
  // Check if a user is admin by looking for their email in the admin_users table
  const checkIfUserIsAdmin = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();
      
      return !error && data !== null;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };
  
  useEffect(() => {
    const fetchUserSession = async () => {
      setLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error);
          return;
        }

        if (session) {
          setUser(session.user as User);
          
          // Check if user is admin
          const userIsAdmin = await checkIfUserIsAdmin(session.user.email || '');
          setIsAdmin(userIsAdmin);
          
          console.log('Session found:', session.user);
          console.log('User metadata:', session.user.user_metadata);
          console.log('Is admin:', userIsAdmin);
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
        
        // Check admin status on sign in
        const userEmail = session.user?.email || '';
        const userIsAdmin = await checkIfUserIsAdmin(userEmail);
        setIsAdmin(userIsAdmin);
        
        console.log('Signed in user:', session.user);
        console.log('User metadata:', session.user.user_metadata);
        console.log('Is admin:', userIsAdmin);
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
        
        // Check admin status
        const userIsAdmin = await checkIfUserIsAdmin(data.user.email || '');
        setIsAdmin(userIsAdmin);
        
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
      // First check if the email is in admin_users table
      const { data: adminData, error: adminCheckError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();
      
      if (adminCheckError || !adminData) {
        toast({
          title: "Admin access denied",
          description: "This email is not registered as an admin",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      // Try regular sign in for admin
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
      
      if (data.user) {
        // User is admin
        setUser(data.user as User);
        setIsAdmin(true);
        
        toast({
          title: "Admin login successful",
          description: "Welcome, Admin!",
        });
        navigate('/admin');
      }
    } catch (error: any) {
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
