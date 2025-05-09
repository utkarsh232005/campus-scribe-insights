
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import useNotificationTrigger from '@/hooks/useNotificationTrigger';

const FacultyProjectPage = () => {
  const [facultyProjects, setFacultyProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Use notification trigger for 'reports' table
  useNotificationTrigger({ tableName: 'reports', itemType: 'report' });
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setFacultyProjects(data || []);
      } catch (error) {
        console.error('Error fetching faculty projects:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch faculty projects',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('reports-channel')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'reports' },
        (payload) => {
          console.log('New report submitted:', payload);
          // Update the local state with new data
          setFacultyProjects(prev => [payload.new, ...prev]);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Faculty Projects & Reports</h1>
          <Button variant="outline" onClick={() => window.location.href = '/submit-report'}>
            Submit New Report
          </Button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : facultyProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facultyProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <div className="text-sm text-gray-500">
                      {project.department.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')} Department
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">
                      <span className="font-medium">Academic Year:</span> {project.academic_year}
                    </p>
                    <p className="text-sm mb-2">
                      <span className="font-medium">Publications:</span> {project.publication_count}
                    </p>
                    <p className="text-sm mb-2">
                      <span className="font-medium">Funding:</span> ${project.funding_amount}
                    </p>
                    {project.achievements && (
                      <p className="text-sm mt-4 line-clamp-3">
                        {project.achievements}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No faculty projects found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FacultyProjectPage;
