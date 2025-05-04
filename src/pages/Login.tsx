
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { School, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Updated schema to accept any email format for faculty
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Updated schema for signup to accept any email format with no validation
const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  department: z.string().min(1, { message: "Department is required" }),
});

const adminLoginSchema = z.object({
  email: z.string().email({ message: "Please enter admin email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" })
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;
type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

const Login = () => {
  const { user, loading, signIn, adminLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  const adminRequired = (location.state as any)?.adminRequired || false;
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("faculty");
  
  // Use separate forms for login and signup
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit", // Only validate on submit, not onChange
  });

  // Modified signup form with department
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      department: "",
    },
    mode: "onSubmit", // Only validate on submit, not onChange
  });

  const adminForm = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit", // Only validate on submit, not onChange
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  async function onFacultySubmit(data: LoginFormValues | SignupFormValues) {
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        // This is a SignupFormValues with department
        const signupData = data as SignupFormValues;
        
        // Register new user with department in metadata
        const { error } = await supabase.auth.signUp({
          email: signupData.email,
          password: signupData.password,
          options: {
            data: {
              department: signupData.department || 'Not specified'
            }
          }
        });
        
        if (error) throw error;
        
        toast({
          title: "Account created",
          description: "Check your email for a confirmation link",
        });
        
      } else {
        // For login
        await signIn(data.email, data.password);
      }
    } catch (error: any) {
      console.error("Signup/Login error:", error);
      toast({
        title: isSignUp ? "Sign up failed" : "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onAdminSubmit(data: AdminLoginFormValues) {
    setIsLoading(true);
    
    try {
      if (!data.email || !data.password) {
        toast({
          title: "Admin login failed",
          description: "Email and password are required",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      await adminLogin(data.email, data.password);
    } catch (error: any) {
      toast({
        title: "Admin login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard'
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Google login error:", error);
      toast({
        title: "Google login failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }

  // If user is already logged in and has finished loading, redirect them
  if (user && !loading) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fade-in">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <School className="h-12 w-12 text-blue-500 animate-bounce-in" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
          Annual Report Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Access your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-900/50 backdrop-blur-lg py-8 px-4 shadow-xl shadow-blue-500/5 sm:rounded-lg sm:px-10 border border-gray-800 animate-scale-in">
          <Tabs defaultValue="faculty" value={activeTab} onValueChange={(val) => {
            setActiveTab(val);
          }} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="faculty" className="transition-all duration-300">
                <Mail className="mr-2 h-4 w-4" />
                Faculty
              </TabsTrigger>
              <TabsTrigger value="admin" className="transition-all duration-300">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Admin
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="faculty" className="space-y-4 mt-0">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 bg-gray-800/50 border-gray-700 hover:bg-gray-700 transition-all"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="text-red-400">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign in with Google
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-gray-900/50 text-gray-400">or continue with email</span>
                </div>
              </div>

              {isSignUp ? (
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onFacultySubmit)} className="space-y-6">
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Email address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                              <Input 
                                placeholder="faculty@college.edu" 
                                {...field} 
                                className="pl-10 bg-gray-800 border-gray-700 text-white" 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <LockKeyhole className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                              <Input 
                                type="password" 
                                {...field} 
                                className="pl-10 bg-gray-800 border-gray-700 text-white" 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  
                    <FormField
                      control={signupForm.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Department</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                <SelectValue placeholder="Select your department" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="computer_science" className="text-white hover:bg-gray-700">Computer Science</SelectItem>
                              <SelectItem value="electrical_engineering" className="text-white hover:bg-gray-700">Electrical Engineering</SelectItem>
                              <SelectItem value="mechanical_engineering" className="text-white hover:bg-gray-700">Mechanical Engineering</SelectItem>
                              <SelectItem value="civil_engineering" className="text-white hover:bg-gray-700">Civil Engineering</SelectItem>
                              <SelectItem value="physics" className="text-white hover:bg-gray-700">Physics</SelectItem>
                              <SelectItem value="mathematics" className="text-white hover:bg-gray-700">Mathematics</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center justify-between">
                      <Button
                        type="button"
                        variant="link"
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        onClick={() => {
                          setIsSignUp(false);
                          loginForm.reset();
                        }}
                      >
                        Already have an account? Sign in
                      </Button>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-white"></span>
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onFacultySubmit)} className="space-y-6">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Email address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                              <Input 
                                placeholder="faculty@college.edu" 
                                {...field} 
                                className="pl-10 bg-gray-800 border-gray-700 text-white" 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <LockKeyhole className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                              <Input 
                                type="password" 
                                {...field} 
                                className="pl-10 bg-gray-800 border-gray-700 text-white" 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center justify-between">
                      <Button
                        type="button"
                        variant="link"
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        onClick={() => {
                          setIsSignUp(true);
                          signupForm.reset();
                        }}
                      >
                        Need an account? Sign up
                      </Button>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-white"></span>
                          Signing in...
                        </>
                      ) : (
                        'Sign in'
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </TabsContent>
            
            <TabsContent value="admin" className="space-y-4 mt-0">
              <Form {...adminForm}>
                <form onSubmit={adminForm.handleSubmit(onAdminSubmit)} className="space-y-6">
                  <FormField
                    control={adminForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Admin Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                            <Input 
                              placeholder="admin@example.com" 
                              {...field} 
                              className="pl-10 bg-gray-800 border-gray-700 text-white" 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={adminForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Admin Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <LockKeyhole className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                            <Input 
                              type="password" 
                              {...field} 
                              className="pl-10 bg-gray-800 border-gray-700 text-white" 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-gray-400 mt-1">Enter your admin credentials</p>
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-700 transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-white"></span>
                        Signing in as Admin...
                      </>
                    ) : (
                      'Admin Sign in'
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Login;
