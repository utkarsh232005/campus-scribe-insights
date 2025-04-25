import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, BarChart3, FileText, BookOpen, DollarSign } from 'lucide-react';
import ReportChart from '@/components/dashboard/ReportChart';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

// Type definition for report data
interface Report {
  id: string;
  title: string;
  department: string;
  user_id: string;
  created_at: string;
  status: string;
  publication_count: number;
  conference_count: number;
  project_count: number;
  funding_amount: number;
  submitter_name?: string;
}

const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [userDepartment, setUserDepartment] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    totalReports: 0,
    totalPublications: 0,
    totalProjects: 0,
    totalFunding: 0
  });
  const [departmentData, setDepartmentData] = useState<any[]>([]);
  const [yearlyData, setYearlyData] = useState<any[]>([]);

  // Fetch reports and user data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Get current user and their department
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: userData } = await supabase
            .from('profiles')
            .select('department')
            .eq('id', user.id)
            .single();
          
          if (userData) {
            setUserDepartment(userData.department);
          }
        }
        
        // Fetch all reports
        const { data: reportsData, error } = await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // For each report, get the submitter's name
        if (reportsData) {
          const reportsWithSubmitters = await Promise.all(
            reportsData.map(async (report) => {
              const { data: userData, error: userError } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', report.user_id)
                .single();
              
              // Check for error or missing data before accessing name
              const submitterName = (userError || !userData) 
                ? 'Unknown' 
                : userData || 'Unknown';

              return {
                ...report,
                submitter_name: submitterName,
              };
            })
          );
          
          setReports(reportsWithSubmitters);
          
          // Calculate statistics
          const stats = {
            totalReports: reportsWithSubmitters.length,
            totalPublications: reportsWithSubmitters.reduce((sum, r) => sum + (r.publication_count || 0), 0),
            totalProjects: reportsWithSubmitters.reduce((sum, r) => sum + (r.project_count || 0), 0),
            totalFunding: reportsWithSubmitters.reduce((sum, r) => sum + (r.funding_amount || 0), 0)
          };
          setStatistics(stats);
          
          // Prepare data for department chart
          const depData = Object.entries(
            reportsWithSubmitters.reduce((acc, report) => {
              const dept = report.department || 'Unknown';
              if (!acc[dept]) {
                acc[dept] = {
                  name: dept.substring(0, 4).toUpperCase(),
                  publications: 0,
                  conferences: 0,
                  projects: 0,
                  funding: 0
                };
              }
              acc[dept].publications += report.publication_count || 0;
              acc[dept].conferences += report.conference_count || 0;
              acc[dept].projects += report.project_count || 0;
              acc[dept].funding += Math.round((report.funding_amount || 0) / 10000); // Convert to 10K units
              return acc;
            }, {} as Record<string, any>)
          ).map(([_, value]) => value);
          
          setDepartmentData(depData);
          
          // For now, use mock data for yearly chart since we don't have historical data
          setYearlyData([
            { name: "2019", publications: 120, conferences: 45, projects: 18, funding: 65 },
            { name: "2020", publications: 135, conferences: 40, projects: 20, funding: 75 },
            { name: "2021", publications: 115, conferences: 38, projects: 25, funding: 80 },
            { name: "2022", publications: 160, conferences: 50, projects: 30, funding: 95 },
            { name: "2023", publications: 195, conferences: 60, projects: 33, funding: 105 },
          ]);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>;
    }
  };

  // Format department name for display (e.g., "computer_science" -> "Computer Science")
  const formatDepartmentName = (department: string) => {
    if (!department) return 'Unknown';
    return department
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Filter reports by department if user is not an admin
  const filteredReports = userDepartment === 'admin' 
    ? reports 
    : reports.filter(report => report.department === userDepartment);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <div className="flex items-center text-sm text-gray-500">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span>Reports</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalReports}</div>
            <p className="text-xs text-gray-500">Latest count as of today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Publications</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalPublications}</div>
            <p className="text-xs text-gray-500">Total across all departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalProjects}</div>
            <p className="text-xs text-gray-500">Total across all departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(statistics.totalFunding / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-gray-500">Total across all departments</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ReportChart
          title="Department Performance"
          type="bar"
          data={departmentData}
          dataKeys={[
            { key: 'publications', color: '#3366FF', name: 'Publications' },
            { key: 'projects', color: '#36D399', name: 'Projects' }
          ]}
        />
        <ReportChart
          title="Yearly Comparison"
          type="line"
          data={yearlyData}
          dataKeys={[
            { key: 'publications', color: '#3366FF', name: 'Publications' },
            { key: 'funding', color: '#FF8A00', name: 'Funding ($10K)' }
          ]}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{userDepartment !== 'admin' ? `${userDepartment} Department Reports` : 'All Department Reports'}</CardTitle>
          <CardDescription>
            View and manage {userDepartment !== 'admin' ? 'your department\'s' : 'all'} submitted annual reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.id.substring(0, 8)}</TableCell>
                      <TableCell>{report.title}</TableCell>
                      <TableCell>{formatDepartmentName(report.department)}</TableCell>
                      <TableCell>{report.submitter_name}</TableCell>
                      <TableCell>{format(new Date(report.created_at), 'yyyy-MM-dd')}</TableCell>
                      <TableCell>{getStatusBadge(report.status || 'pending')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No reports found for {userDepartment} department.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Reports;
