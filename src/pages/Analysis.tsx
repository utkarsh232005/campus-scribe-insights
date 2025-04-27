
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const Analysis = () => {
  const [departments, setDepartments] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDepartments = async () => {
      const { data: facultyData, error: facultyError } = await supabase
        .from('faculty')
        .select('department')
        .order('department');

      if (facultyError) {
        console.error('Error fetching departments:', facultyError);
        return;
      }

      // Get unique departments
      const uniqueDepartments = [...new Set(facultyData.map(item => item.department))];
      setDepartments(uniqueDepartments);
    };

    fetchDepartments();
  }, []);

  const generateReport = async (department: string, fileType: 'word' | 'excel') => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('department', department)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        toast({
          title: 'No Reports Found',
          description: `No reports found for the ${department} department.`,
          variant: 'destructive'
        });
        return;
      }

      // In a real-world scenario, you'd use a backend service for report generation
      // This is a placeholder implementation
      toast({
        title: 'Report Generated',
        description: `${fileType.toUpperCase()} report for ${department} department`,
        variant: 'default'
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate report',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="p-6 bg-black min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6">Department Report Generation</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => (
          <Card key={department} className="bg-gray-900 text-white">
            <CardHeader>
              <CardTitle className="capitalize">
                {department.replace('_', ' ')} Department
              </CardTitle>
            </CardHeader>
            <CardContent className="flex space-x-4">
              <Button 
                onClick={() => generateReport(department, 'word')}
                variant="outline" 
                className="text-white border-white hover:bg-white hover:text-black"
              >
                <Download className="mr-2 h-4 w-4" /> Word Report
              </Button>
              <Button 
                onClick={() => generateReport(department, 'excel')}
                variant="outline" 
                className="text-white border-white hover:bg-white hover:text-black"
              >
                <Download className="mr-2 h-4 w-4" /> Excel Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Analysis;
