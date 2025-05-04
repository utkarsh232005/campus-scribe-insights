
import React, { useState } from 'react';
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
import { School, LockKeyhole, Mail, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

// Schema for signup validation
const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  department: z.string().min(1, { message: "Department is required" })
});

type SignupFormValues = z.infer<typeof signupSchema>;

const SignUp = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  
  // Form for email/password signup
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      department: "",
    },
    mode: "onSubmit",
  });

  async function onSubmit(data: SignupFormValues) {
    setIsLoading(true);
    
    try {
      // Register new user with department in metadata
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            department: data.department
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created",
        description: "Check your email for a confirmation link",
      });
      
      navigate('/login');
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignUp() {
    if (!selectedDepartment) {
      toast({
        title: "Department required",
        description: "Please select your department before signing up with Google",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            // Pass department as a query parameter to capture after OAuth
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/auth/callback?department=${selectedDepartment}`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Google signup error:", error);
      toast({
        title: "Google signup failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          className="flex justify-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <School className="h-12 w-12 text-blue-500" />
        </motion.div>
        <motion.h2 
          className="mt-6 text-center text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Create Your Account
        </motion.h2>
        <motion.p 
          className="mt-2 text-center text-sm text-gray-400"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Join the faculty portal today
        </motion.p>
      </div>

      <motion.div 
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="bg-gray-900/50 backdrop-blur-lg py-8 px-4 shadow-xl shadow-blue-500/5 sm:rounded-lg sm:px-10 border border-gray-800">
          <div className="space-y-6">
            {/* Department Selection - Required for both regular and Google signup */}
            <div>
              <label htmlFor="department-select" className="block text-sm font-medium text-gray-300 mb-1">
                Department (Required)
              </label>
              <Select 
                onValueChange={(value) => setSelectedDepartment(value)}
                value={selectedDepartment}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select your department" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="computer_science" className="text-white hover:bg-gray-700">Computer Science</SelectItem>
                  <SelectItem value="electrical_engineering" className="text-white hover:bg-gray-700">Electrical Engineering</SelectItem>
                  <SelectItem value="mechanical_engineering" className="text-white hover:bg-gray-700">Mechanical Engineering</SelectItem>
                  <SelectItem value="civil_engineering" className="text-white hover:bg-gray-700">Civil Engineering</SelectItem>
                  <SelectItem value="physics" className="text-white hover:bg-gray-700">Physics</SelectItem>
                  <SelectItem value="mathematics" className="text-white hover:bg-gray-700">Mathematics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Google Sign-up Button */}
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700 transition-all"
              onClick={handleGoogleSignUp}
              disabled={isLoading || !selectedDepartment}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="text-red-400">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign up with Google
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-gray-900/50 text-gray-400">or sign up with email</span>
              </div>
            </div>

            {/* Email/Password Signup Form */}
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(onSubmit)} className="space-y-6">
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

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
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

            <div className="mt-4 text-center">
              <Link 
                to="/login" 
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
