import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/context/NotificationContext';
import ExcelReportHandler from './ExcelReportHandler';

const reportSchema = z.object({
  title: z.string().min(5, { message: "Report title must be at least 5 characters" }),
  academicYear: z.string().min(1, { message: "Please select an academic year" }),
  publicationCount: z.string().min(1, { message: "Please enter number of publications" }),
  conferenceCount: z.string().min(1, { message: "Please enter number of conferences" }),
  projectCount: z.string().min(1, { message: "Please enter number of projects" }),
  fundingAmount: z.string().min(1, { message: "Please enter funding amount" }),
  achievements: z.string().min(10, { message: "Please provide a summary of achievements" }),
});

type ReportFormValues = z.infer<typeof reportSchema>;

const ReportForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userDepartment, setUserDepartment] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { addNotification, notifyFacultyAction } = useNotifications();
  
  useEffect(() => {
    async function getUserDepartment() {
      try {
        // Get the current user's auth data
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast({
            title: "Authentication Error",
            description: "You need to be logged in to submit a report",
            variant: "destructive"
          });
          navigate('/login');
          return;
        }
        
        // First check if department is in the user metadata
        if (user.user_metadata?.department) {
          setUserDepartment(user.user_metadata.department);
          return;
        }
        
        // If not in metadata, try to get from profiles table
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('department')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error("Error fetching user profile:", error);
          return;
        }
        
        if (profile && profile.department) {
          setUserDepartment(profile.department);
        } else {
          // If department still not found, show warning
          toast({
            title: "Department Not Found",
            description: "Your department info is missing. Please contact an administrator.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    
    getUserDepartment();
  }, [toast, navigate]);
  
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: "",
      academicYear: "",
      publicationCount: "",
      conferenceCount: "",
      projectCount: "",
      fundingAmount: "",
      achievements: "",
    },
  });

  // Handle data imported from Excel
  const handleExcelDataImport = (data: ReportFormValues) => {
    // Set all form values at once with imported data
    form.reset(data);
  };

  async function onSubmit(data: ReportFormValues) {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to submit a report");
      }
      
      if (!userDepartment) {
        throw new Error("Department information is missing. Please contact an administrator.");
      }
      
      // Use the original department value for database storage
      console.log("Submitting report with user_id:", user.id, "department:", userDepartment);
      
      // Insert report
      const { data: report, error } = await supabase
        .from('reports')
        .insert({
          title: data.title,
          department: userDepartment, 
          academic_year: data.academicYear,
          publication_count: parseInt(data.publicationCount),
          conference_count: parseInt(data.conferenceCount),
          project_count: parseInt(data.projectCount),
          funding_amount: parseFloat(data.fundingAmount),
          achievements: data.achievements,
          user_id: user.id,
          status: 'pending'
        })
        .select();

      if (error) {
        console.error("Supabase error details:", error);
        throw new Error(`Failed to submit report: ${error.message}`);
      }

      console.log("Report submitted successfully:", report);
      
      // Format department name for display
      const dept = userDepartment.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');

      // Create notification directly in the database for immediate effect
      const { data: notificationData, error: notifError } = await supabase
        .from('notifications')
        .insert({
          message: `New report "${data.title}" submitted from ${dept} department`,
          type: 'info',
          created_at: new Date().toISOString()
          // No user_id makes this a broadcast
        })
        .select();
        
      if (notifError) {
        console.error("Error creating direct notification:", notifError);
      } else {
        console.log("Direct notification created:", notificationData);
      }
      
      // Also add user-specific notification
      const { error: userNotifError } = await supabase
        .from('notifications')
        .insert({
          message: `You have submitted report: "${data.title}"`,
          type: 'info',
          user_id: user.id,
          created_at: new Date().toISOString()
        });
        
      if (userNotifError) {
        console.error("Error creating user notification:", userNotifError);
      }
      
      // Also use the helper functions as a backup approach
      try {
        await notifyFacultyAction('submitted', 'report', data.title);
      } catch (err) {
        console.error("Error with notification helper:", err);
      }

      toast({
        title: "Success",
        description: "Your report has been submitted successfully",
      });

      // Navigate to reports page after successful submission
      setTimeout(() => {
        navigate('/reports');
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      console.error("Error submitting report:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-lg shadow p-6 border border-gray-800">
      <h2 className="text-xl font-bold mb-6">Annual Report Submission</h2>
      
      {userDepartment && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
          <p className="text-sm text-blue-400">
            You are submitting this report as a member of the <strong>
              {userDepartment.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </strong> department.
          </p>
        </div>
      )}
      
      <ExcelReportHandler onDataImported={handleExcelDataImport} />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Report Title</FormLabel>
                <FormControl>
                  <Input placeholder="Annual Academic Report 2024-25" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="academicYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Academic Year</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select academic year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="2024-25">2024-25</SelectItem>
                      <SelectItem value="2023-24">2023-24</SelectItem>
                      <SelectItem value="2022-23">2022-23</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FormField
              control={form.control}
              name="publicationCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publications</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="conferenceCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conferences</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="projectCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Projects</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="fundingAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funding ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="achievements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Achievements & Contributions</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Summarize your key achievements, research outcomes, and contributions..." 
                    className="h-32"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Include details about publications, research projects, conferences, grants, and other notable achievements.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-4">
            <Button variant="outline" type="button">Save Draft</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ReportForm;
