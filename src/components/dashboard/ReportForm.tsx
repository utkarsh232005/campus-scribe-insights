
import React, { useState, useEffect, useRef } from 'react';
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
import * as XLSX from 'xlsx';
import { Download, Upload } from 'lucide-react';

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
  const [importLoading, setImportLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addNotification } = useNotifications();
  
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
      
      // Also use notification helper to add a system-wide notification
      try {
        addNotification({
          title: 'Report Submitted',
          message: `A new report "${data.title}" has been submitted`,
          type: 'success',
        });
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

  // Function to download an Excel template
  const downloadExcelTemplate = () => {
    // Create template with sample data
    const templateData = [
      {
        'Report Title': 'Annual Academic Report 2024-25',
        'Academic Year': '2024-25',
        'Publications': '5',
        'Conferences': '2',
        'Projects': '3',
        'Funding Amount ($)': '75000',
        'Achievements & Contributions': 'Sample achievements and contributions text'
      }
    ];
    
    // Create worksheet and workbook
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report Template');
    
    // Generate Excel file and trigger download
    XLSX.writeFile(wb, 'report_template.xlsx');
    
    toast({
      title: "Template Downloaded",
      description: "Fill out the template and import it to quickly populate the form",
    });
  };

  // Function to handle Excel file import
  const handleImportExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setImportLoading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first worksheet
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        if (jsonData.length > 0) {
          const reportData = jsonData[0] as any;
          
          // Update form with data from Excel
          form.setValue('title', reportData['Report Title'] || '');
          form.setValue('academicYear', reportData['Academic Year'] || '');
          form.setValue('publicationCount', reportData['Publications'] || '');
          form.setValue('conferenceCount', reportData['Conferences'] || '');
          form.setValue('projectCount', reportData['Projects'] || '');
          form.setValue('fundingAmount', reportData['Funding Amount ($)'] || '');
          form.setValue('achievements', reportData['Achievements & Contributions'] || '');
          
          toast({
            title: "Data Imported",
            description: "Form has been populated with data from Excel file",
          });
        }
      } catch (error) {
        console.error('Error importing Excel file:', error);
        toast({
          title: "Import Failed",
          description: "There was an error importing the Excel file",
          variant: "destructive",
        });
      } finally {
        setImportLoading(false);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    
    reader.onerror = () => {
      setImportLoading(false);
      toast({
        title: "Import Failed",
        description: "There was an error reading the Excel file",
        variant: "destructive",
      });
    };
    
    reader.readAsArrayBuffer(file);
  };

  // Function to trigger file input click
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 backdrop-blur-lg rounded-xl shadow-xl border border-slate-800/60 p-8">
      <div className="absolute inset-0 bg-grid-slate-800/10 [mask-image:linear-gradient(0deg,rgba(0,0,0,0.7),rgba(0,0,0,0.5))]" />
      
      <div className="relative z-10 space-y-8">
        <div className="pb-4 border-b border-slate-700/50">
          <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-300 mb-2">
            Faculty Report Details
          </h2>
          <p className="text-sm text-slate-400">
            Document your academic contributions and achievements for the reporting period
          </p>
        </div>
        
        {/* Excel Import/Export Section */}
        <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-lg mb-2">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-slate-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-base font-medium text-slate-300">Excel Import/Export</h3>
            </div>
            
            <p className="text-sm text-slate-500 pl-7">
              Download the Excel template to fill out offline, then upload it to quickly populate the form.
            </p>
            
            <div className="flex items-center justify-between mt-2 pl-7 gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadExcelTemplate}
                className="flex-1 bg-slate-800/90 border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white shadow-md"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={triggerFileUpload}
                disabled={importLoading}
                className="flex-1 bg-slate-800/90 border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white shadow-md"
              >
                {importLoading ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Import from Excel
                  </>
                )}
              </Button>
              
              {/* Hidden file input for Excel upload */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportExcel}
                accept=".xlsx, .xls"
                className="hidden"
              />
            </div>
          </div>
        </div>
        
        {userDepartment && (
          <div className="p-4 bg-indigo-950/30 border border-indigo-700/30 rounded-lg mb-6">
            <div className="flex items-start">
              <div className="mr-3 mt-0.5 p-1.5 rounded-full bg-indigo-500/10">
                <svg className="h-4 w-4 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-indigo-300">
                  You are submitting this report as a member of the <span className="font-medium text-indigo-200">
                    {userDepartment.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span> department.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-slate-300 font-medium">Report Title</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="Annual Academic Report 2024-25" 
                        className="bg-slate-800/50 border-slate-700/50 pl-10 py-6 text-slate-200 placeholder:text-slate-500 focus-visible:ring-indigo-500"
                        {...field} 
                      />
                      <svg 
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" 
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-rose-400" />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="academicYear"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-slate-300 font-medium">Academic Year</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-800/50 border-slate-700/50 h-[50px] text-slate-200 focus:ring-indigo-500">
                          <div className="flex items-center">
                            <svg className="h-4 w-4 mr-2 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <SelectValue placeholder="Select academic year" />
                          </div>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-800 border border-indigo-500/30 shadow-lg shadow-indigo-500/10 text-slate-200 rounded-md">
                        <SelectItem 
                          value="2024-25" 
                          className="hover:bg-indigo-600/30 focus:bg-indigo-600/40 data-[highlighted]:bg-indigo-600/40 rounded-sm my-1 cursor-pointer transition-colors duration-150"
                        >
                          2024-25
                        </SelectItem>
                        <SelectItem 
                          value="2023-24" 
                          className="hover:bg-indigo-600/30 focus:bg-indigo-600/40 data-[highlighted]:bg-indigo-600/40 rounded-sm my-1 cursor-pointer transition-colors duration-150"
                        >
                          2023-24
                        </SelectItem>
                        <SelectItem 
                          value="2022-23" 
                          className="hover:bg-indigo-600/30 focus:bg-indigo-600/40 data-[highlighted]:bg-indigo-600/40 rounded-sm my-1 cursor-pointer transition-colors duration-150"
                        >
                          2022-23
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs text-rose-400" />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center">
                <svg className="h-4 w-4 mr-2 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Key Metrics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="publicationCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-slate-400">Publications</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type="number" 
                            placeholder="0" 
                            className="bg-slate-800/50 border-slate-700/50 pl-9 h-10 text-slate-200 [&::-webkit-inner-spin-button]:h-9 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:bg-slate-700/70 [&::-webkit-inner-spin-button]:border-l [&::-webkit-inner-spin-button]:border-slate-600/50 [&::-webkit-inner-spin-button]:hover:bg-indigo-700/30 [&::-webkit-inner-spin-button]:active:bg-indigo-800/50 [&::-webkit-inner-spin-button]:transition-colors"
                            {...field} 
                          />
                          <svg 
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" 
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-rose-400" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="conferenceCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-slate-400">Conferences</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type="number" 
                            placeholder="0" 
                            className="bg-slate-800/50 border-slate-700/50 pl-9 h-10 text-slate-200 [&::-webkit-inner-spin-button]:h-9 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:bg-slate-700/70 [&::-webkit-inner-spin-button]:border-l [&::-webkit-inner-spin-button]:border-slate-600/50 [&::-webkit-inner-spin-button]:hover:bg-indigo-700/30 [&::-webkit-inner-spin-button]:active:bg-indigo-800/50 [&::-webkit-inner-spin-button]:transition-colors"
                            {...field} 
                          />
                          <svg 
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" 
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-rose-400" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="projectCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-slate-400">Projects</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type="number" 
                            placeholder="0" 
                            className="bg-slate-800/50 border-slate-700/50 pl-9 h-10 text-slate-200 [&::-webkit-inner-spin-button]:h-9 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:bg-slate-700/70 [&::-webkit-inner-spin-button]:border-l [&::-webkit-inner-spin-button]:border-slate-600/50 [&::-webkit-inner-spin-button]:hover:bg-indigo-700/30 [&::-webkit-inner-spin-button]:active:bg-indigo-800/50 [&::-webkit-inner-spin-button]:transition-colors"
                            {...field} 
                          />
                          <svg 
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" 
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-rose-400" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="fundingAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-slate-400">Funding ($)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type="number" 
                            placeholder="0" 
                            className="bg-slate-800/50 border-slate-700/50 pl-9 h-10 text-slate-200 [&::-webkit-inner-spin-button]:h-9 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:bg-slate-700/70 [&::-webkit-inner-spin-button]:border-l [&::-webkit-inner-spin-button]:border-slate-600/50 [&::-webkit-inner-spin-button]:hover:bg-indigo-700/30 [&::-webkit-inner-spin-button]:active:bg-indigo-800/50 [&::-webkit-inner-spin-button]:transition-colors"
                            {...field} 
                          />
                          <svg 
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" 
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-rose-400" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="achievements"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-slate-300 font-medium">Achievements & Contributions</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea 
                        placeholder="Summarize your key achievements, research outcomes, and contributions..." 
                        className="min-h-[150px] bg-slate-800/50 border-slate-700/50 pl-10 pt-8 text-slate-200 placeholder:text-slate-500"
                        {...field} 
                      />
                      <svg 
                        className="absolute left-3 top-6 h-5 w-5 text-slate-500" 
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-slate-500">
                    Include details about publications, research projects, conferences, grants, and other notable achievements.
                  </FormDescription>
                  <FormMessage className="text-xs text-rose-400" />
                </FormItem>
              )}
            />
            
            <div className="pt-4 border-t border-slate-800/60 flex justify-end space-x-4">
              <Button 
                variant="outline" 
                type="button"
                className="px-5 py-2 h-auto text-sm text-slate-400 border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:text-slate-200"
              >
                <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Draft
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="px-5 py-2 h-auto text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Submit Report
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ReportForm;
