
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

// Updated schema for signup to accept any email format
const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  department: z.string({ required_error: "Department is required" }),
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
  const [activeTab, setActiveTab] = useState<string>(adminRequired ? "admin" : "faculty");
  
  // Use separate forms for login and signup
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit", // Only validate on submit, not onChange
  });

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
        
        if (!signupData.department) {
          toast({
            title: "Error",
            description: "Department is required for signup",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        console.log("Signing up with department:", signupData.department);
        
        // Register new user with department in metadata
        const { error } = await supabase.auth.signUp({
          email: signupData.email,
          password: signupData.password,
          options: {
            data: {
              department: signupData.department
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
            // Remove the reference to setAdminSubmitted and just set the tab
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
                              <Input placeholder="faculty@college.edu" {...field} className="pl-10 bg-gray-800/50 border-gray-700 text-white transition-all" />
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
                              <Input type="password" {...field} className="pl-10 bg-gray-800/50 border-gray-700 text-white transition-all" />
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
                              <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white transition-all">
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
                              <Input placeholder="faculty@college.edu" {...field} className="pl-10 bg-gray-800/50 border-gray-700 text-white transition-all" />
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
                              <Input type="password" {...field} className="pl-10 bg-gray-800/50 border-gray-700 text-white transition-all" />
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
                            <Input placeholder="admin@example.com" {...field} className="pl-10 bg-gray-800/50 border-gray-700 text-white transition-all" />
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
                            <Input type="password" {...field} className="pl-10 bg-gray-800/50 border-gray-700 text-white transition-all" />
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
