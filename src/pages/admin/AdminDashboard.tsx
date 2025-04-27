
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  FileText,
  CheckCircle2,
  XCircle,
  BarChart,
  User,
  Clock,
  CalendarDays,
  Info,
  Eye,
  FilePenLine,
  Trash2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';

interface UserProfile {
  id: string;
  email: string;
  department: string;
  created_at: string;
  last_sign_in_at: string;
}

interface Report {
  id: string;
  user_id: string;
  title: string;
  department: string;
  created_at: string;
  status: string;
  submitter_name?: string;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeReports: 0,
    approvedReports: 0,
    pendingReports: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch users
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*');
        
        if (userError) throw userError;
        
        // Fetch user emails from auth.users through an API call or edge function
        // For demo, we'll use a workaround
        const users = userData || [];
        
        // Fetch reports
        const { data: reportData, error: reportError } = await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (reportError) throw reportError;
        
        const reports = reportData || [];
        
        // Calculate stats
        const stats = {
          totalUsers: users.length,
          activeReports: reports.length,
          approvedReports: reports.filter(r => r.status === 'approved').length,
          pendingReports: reports.filter(r => r.status === 'pending').length
        };
        
        setUsers(users);
        setReports(reports);
        setStats(stats);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load admin dashboard data',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  const handleReportAction = async (reportId: string, action: 'approve' | 'reject' | 'delete') => {
    try {
      if (action === 'delete') {
        const { error } = await supabase
          .from('reports')
          .delete()
          .eq('id', reportId);
          
        if (error) throw error;
        
        setReports(reports.filter(r => r.id !== reportId));
        toast({
          title: 'Report deleted',
          description: 'The report has been deleted successfully',
        });
        return;
      }
      
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      
      const { error } = await supabase
        .from('reports')
        .update({ status: newStatus })
        .eq('id', reportId);
        
      if (error) throw error;
      
      // Update local state
      setReports(reports.map(r => 
        r.id === reportId ? { ...r, status: newStatus } : r
      ));
      
      // Update stats
      setStats({
        ...stats,
        approvedReports: action === 'approve' 
          ? stats.approvedReports + 1 
          : stats.approvedReports,
        pendingReports: stats.pendingReports - 1
      });
      
      toast({
        title: `Report ${newStatus}`,
        description: `The report has been ${newStatus} successfully`,
      });
    } catch (error) {
      console.error(`Error ${action}ing report:`, error);
      toast({
        title: 'Action failed',
        description: `Failed to ${action} the report`,
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-600">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-600">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400 mb-8">Manage users and reports across all departments</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 border-blue-800/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg font-medium text-blue-400">
                <Users className="mr-2 h-5 w-5" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
              <p className="text-xs text-blue-300/70 mt-1">Faculty members from all departments</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-900/30 to-green-800/10 border-green-800/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg font-medium text-green-400">
                <FileText className="mr-2 h-5 w-5" />
                Active Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.activeReports}</div>
              <p className="text-xs text-green-300/70 mt-1">Total submitted reports</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/10 border-purple-800/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg font-medium text-purple-400">
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Approved Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.approvedReports}</div>
              <p className="text-xs text-purple-300/70 mt-1">Reports marked as approved</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/10 border-yellow-800/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg font-medium text-yellow-400">
                <Clock className="mr-2 h-5 w-5" />
                Pending Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.pendingReports}</div>
              <p className="text-xs text-yellow-300/70 mt-1">Reports awaiting review</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <User className="mr-2 h-5 w-5" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length > 0 ? (
                      users.slice(0, 5).map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.department?.replace(/_/g, ' ')}</TableCell>
                          <TableCell>{format(new Date(user.created_at), 'MMM d, yyyy')}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-gray-400">
                          <Info className="h-5 w-5 mx-auto mb-2" />
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Users
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <BarChart className="mr-2 h-5 w-5" />
                Recent Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.length > 0 ? (
                      reports.slice(0, 5).map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium truncate max-w-[150px]">
                            {report.title}
                          </TableCell>
                          <TableCell>{report.department?.replace(/_/g, ' ')}</TableCell>
                          <TableCell>{getStatusBadge(report.status)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <FilePenLine className="h-4 w-4 mr-1" />
                                  Actions
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40 bg-gray-900 border-gray-800">
                                <DropdownMenuItem 
                                  className="text-green-500 focus:text-green-500"
                                  onClick={() => handleReportAction(report.id, 'approve')}
                                  disabled={report.status === 'approved'}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-500 focus:text-red-500"
                                  onClick={() => handleReportAction(report.id, 'reject')}
                                  disabled={report.status === 'rejected'}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-gray-300 focus:text-gray-300"
                                  onClick={() => handleReportAction(report.id, 'delete')}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-gray-400">
                          <Info className="h-5 w-5 mx-auto mb-2" />
                          No reports found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Reports
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <CalendarDays className="mr-2 h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6 border-l border-gray-800 space-y-6 py-2">
              {loading ? (
                <div className="flex justify-center p-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
                </div>
              ) : reports.length > 0 ? (
                reports.slice(0, 5).map((report, index) => (
                  <div key={report.id} className="relative">
                    <div className="absolute -left-9 mt-1.5 h-4 w-4 rounded-full bg-blue-500"></div>
                    <div className="mb-1 text-sm font-semibold text-white">
                      Report {report.status === 'approved' ? 'Approved' : report.status === 'rejected' ? 'Rejected' : 'Submitted'}
                    </div>
                    <p className="text-sm text-gray-400">{report.title} from {report.department?.replace(/_/g, ' ')} department</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(report.created_at), 'MMM d, yyyy - h:mm a')}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Info className="h-5 w-5 mx-auto mb-2" />
                  No recent activity
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
