
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
          setIsAdmin(session.user?.email === 'admin@example.com' || 
                    session.user?.user_metadata?.role === 'admin');
        }
      } catch (error) {
        console.error('Error in auth check:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSession();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user as User);
        setIsAdmin(session.user?.email === 'admin@example.com' || 
                  session.user?.user_metadata?.role === 'admin');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAdmin(false);
        // Redirect to landing page on sign out
        navigate('/');
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
        setIsAdmin(data.user.email === 'admin@example.com' || 
                  data.user.user_metadata?.role === 'admin');
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
    if (email !== 'admin@example.com') {
      toast({
        title: "Admin login failed",
        description: "Invalid admin email",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // First check if admin user exists
      const { data: existingUser, error: checkError } = await supabase.auth.admin.getUserByEmail(email);
      
      if (checkError && !existingUser) {
        // Admin doesn't exist, let's create them
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
          email: 'admin@example.com',
          password: password,
          options: {
            data: {
              role: 'admin',
              department: 'admin',
            }
          }
        });
        
        if (signupError) throw signupError;
        
        if (signupData.user) {
          // After signup, try login
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: 'admin@example.com',
            password: password
          });
          
          if (loginError) throw loginError;
          
          if (loginData.user) {
            setUser(loginData.user as User);
            setIsAdmin(true);
            toast({
              title: "Admin account created & logged in",
              description: "Welcome to admin dashboard!",
            });
            navigate('/admin');
          }
        }
      } else {
        // Admin exists, try to login
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: 'admin@example.com',
          password: password
        });
        
        if (loginError) throw loginError;
        
        if (loginData.user) {
          setUser(loginData.user as User);
          setIsAdmin(true);
          toast({
            title: "Admin login successful",
            description: "Welcome back, Admin!",
          });
          navigate('/admin');
        }
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
