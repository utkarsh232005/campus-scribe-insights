import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { 
  Eye, 
  Download, 
  BarChart3, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon, 
  FileText, 
  BookOpen, 
  DollarSign, 
  Calendar,
  TrendingUp 
} from 'lucide-react';
import ReportChart from '@/components/dashboard/ReportChart';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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
                : userData.full_name || 'Unknown';

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
            totalFunding: reportsWithSubmitters.reduce((sum, r) => sum + (r.funding_amount || 0), 0) / 1000 // Display in thousands
          };
          setStatistics(stats);
          
          // Prepare data for department chart
          const depData = Object.entries(
            reportsWithSubmitters.reduce((acc: Record<string, {publications: number}>, report) => {
              const dept = report.department || 'Unknown';
              if (!acc[dept]) {
                acc[dept] = { publications: 0 };
              }
              acc[dept].publications += report.publication_count || 0;
              return acc;
            }, {})
          ).map(([name, data]) => ({
            name: formatDepartmentName(name),
            publications: data.publications
          }));
          
          setDepartmentData(depData);
          
          // Prepare data for yearly trend chart - grouped by year
          const yearData = reportsWithSubmitters.reduce((acc: Record<string, {publications: number}>, report) => {
            const year = new Date(report.created_at).getFullYear().toString();
            if (!acc[year]) {
              acc[year] = { publications: 0 };
            }
            acc[year].publications += report.publication_count || 0;
            return acc;
          }, {});
          
          // Convert to array and sort by year
          const yearlyTrendData = Object.entries(yearData)
            .map(([name, data]) => ({
              name,
              publications: data.publications
            }))
            .sort((a, b) => Number(a.name) - Number(b.name));
          
          setYearlyData(yearlyTrendData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching report data:', error);
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Get status badge with appropriate color
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-600/20 text-green-500 hover:bg-green-600/30 border-0">{status}</Badge>;
      case 'pending':
        return <Badge className="bg-amber-600/20 text-amber-500 hover:bg-amber-600/30 border-0">{status}</Badge>;
      case 'rejected':
        return <Badge className="bg-red-600/20 text-red-500 hover:bg-red-600/30 border-0">{status}</Badge>;
      default:
        return <Badge className="bg-gray-600/20 text-gray-400 hover:bg-gray-600/30 border-0">{status}</Badge>;
    }
  };

  // Format department name for display (e.g., "computer_science" -> "Computer Science")
  const formatDepartmentName = (department: string) => {
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
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-2xl font-bold mb-1 text-zinc-50"
              >
                Faculty Reports
              </motion.h1>
              <p className="text-gray-500">View and manage department reports.</p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <FileText className="h-4 w-4 mr-2" />
                New Report
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <Card className="relative overflow-hidden border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-gray-700 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardDescription className="text-gray-500">Total Publications</CardDescription>
                      <div className="text-3xl font-bold mt-2 text-zinc-50">{statistics.totalPublications}</div>
                      <div className="text-sm text-green-500 mt-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                        </svg>
                        +12% from last period
                      </div>
                    </div>
                    <div className="h-12 w-12 bg-violet-600/20 rounded-xl flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-violet-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Card className="relative overflow-hidden border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-gray-700 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardDescription className="text-gray-500">Total Projects</CardDescription>
                      <div className="text-3xl font-bold mt-2 text-zinc-50">{statistics.totalProjects}</div>
                      <div className="text-sm text-green-500 mt-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                        </svg>
                        +5% from last period
                      </div>
                    </div>
                    <div className="h-12 w-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <Card className="relative overflow-hidden border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-gray-700 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardDescription className="text-gray-500">Total Funding</CardDescription>
                      <div className="text-3xl font-bold mt-2 text-zinc-50">${statistics.totalFunding.toLocaleString()}K</div>
                      <div className="text-sm text-green-500 mt-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                        </svg>
                        +18% from last period
                      </div>
                    </div>
                    <div className="h-12 w-12 bg-green-600/20 rounded-xl flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Enhanced visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-gray-700 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-zinc-50 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                  Publications by Department
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ReportChart 
                  title=""
                  type="bar"
                  data={departmentData}
                  dataKeys={[{ key: 'publications', color: '#4f46e5', name: 'Publications' }]}
                  gradient={true}
                  height={260}
                />
              </CardContent>
            </Card>
            
            <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-gray-700 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-zinc-50 flex items-center">
                  <LineChartIcon className="h-5 w-5 mr-2 text-green-500" />
                  Yearly Publication Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ReportChart 
                  title=""
                  type="area"
                  data={yearlyData}
                  dataKeys={[{ key: 'publications', color: '#06b6d4', name: 'Publications' }]}
                  gradient={true}
                  height={260}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-gray-700 transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-zinc-50 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-violet-500" />
                    Report Submissions Over Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ReportChart 
                    title=""
                    type="line"
                    data={[
                      { name: 'Jan', reports: 12 },
                      { name: 'Feb', reports: 15 },
                      { name: 'Mar', reports: 18 },
                      { name: 'Apr', reports: 14 },
                      { name: 'May', reports: 22 },
                      { name: 'Jun', reports: 28 },
                      { name: 'Jul', reports: 30 },
                      { name: 'Aug', reports: 25 },
                      { name: 'Sep', reports: 32 },
                      { name: 'Oct', reports: 35 },
                      { name: 'Nov', reports: 40 },
                      { name: 'Dec', reports: 38 }
                    ]}
                    dataKeys={[{ key: 'reports', color: '#ec4899', name: 'Report Submissions' }]}
                    height={240}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-gray-700 transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-zinc-50 flex items-center">
                    <PieChartIcon className="h-5 w-5 mr-2 text-yellow-500" />
                    Report Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ReportChart 
                    title=""
                    type="pie"
                    data={[
                      { name: 'Approved', value: 65 },
                      { name: 'Pending', value: 25 },
                      { name: 'Rejected', value: 10 }
                    ]}
                    dataKeys={[{ key: 'value', color: '#4f46e5', name: 'Status' }]}
                    gradient={true}
                    height={240}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="flex flex-col items-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 mb-4"></div>
                <p className="text-gray-500">Loading reports...</p>
              </div>
            </div>
          ) : (
            <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-gray-700 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-zinc-50 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-500" />
                  Faculty Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-gray-800 bg-gray-800/50">
                        <TableHead className="py-3 text-gray-400 font-medium text-sm">ID</TableHead>
                        <TableHead className="py-3 text-gray-400 font-medium text-sm">Title</TableHead>
                        <TableHead className="py-3 text-gray-400 font-medium text-sm">Department</TableHead>
                        <TableHead className="py-3 text-gray-400 font-medium text-sm">Submitted By</TableHead>
                        <TableHead className="py-3 text-gray-400 font-medium text-sm">Date</TableHead>
                        <TableHead className="py-3 text-gray-400 font-medium text-sm">Status</TableHead>
                        <TableHead className="py-3 text-gray-400 font-medium text-sm text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.length > 0 ? (
                        filteredReports.map((report, index) => (
                          <TableRow 
                            key={report.id}
                            className="group/row hover:bg-gray-800/50 transition-all duration-200 border-b border-gray-800/50"
                          >
                            <TableCell className="font-medium text-gray-400">{report.id.substring(0, 8)}</TableCell>
                            <TableCell className="text-white">{report.title}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-700 transition-colors">
                                {formatDepartmentName(report.department)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-white">{report.submitter_name}</TableCell>
                            <TableCell className="text-gray-400">{format(new Date(report.created_at), 'yyyy-MM-dd')}</TableCell>
                            <TableCell>{getStatusBadge(report.status || 'pending')}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className={cn(
                                    "bg-gray-800/60 border border-gray-700",
                                    "hover:bg-gray-700 hover:border-blue-500/30",
                                    "text-gray-400 hover:text-white",
                                    "transition-all duration-200"
                                  )}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className={cn(
                                    "bg-gray-800/60 border border-gray-700",
                                    "hover:bg-gray-700 hover:border-blue-500/30",
                                    "text-gray-400 hover:text-white",
                                    "transition-all duration-200"
                                  )}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell 
                            colSpan={7} 
                            className="text-center py-12 text-gray-500"
                          >
                            <div className="flex flex-col items-center justify-center">
                              <FileText className="h-12 w-12 text-gray-600 mb-2" />
                              <p>No reports found for {userDepartment} department.</p>
                              <Button variant="outline" className="mt-4 border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-700 transition-colors">
                                Create New Report
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Reports;
