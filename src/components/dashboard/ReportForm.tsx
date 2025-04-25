import React from 'react';
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
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

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
  const [userDepartment, setUserDepartment] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    async function getUserDepartment() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('department')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUserDepartment(profile.department);
        }
      }
    }
    getUserDepartment();
  }, []);
  
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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || !userDepartment) {
        throw new Error("You must be logged in to submit a report");
      }

      const { error } = await supabase.from('reports').insert({
        title: data.title,
        department: userDepartment,
        academic_year: data.academicYear,
        publication_count: parseInt(data.publicationCount),
        conference_count: parseInt(data.conferenceCount),
        project_count: parseInt(data.projectCount),
        funding_amount: parseFloat(data.fundingAmount),
        achievements: data.achievements,
        user_id: user.id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your report has been submitted successfully",
      });

      navigate('/reports');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6">Annual Report Submission</h2>
      
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
            <Button type="submit">Submit Report</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ReportForm;
