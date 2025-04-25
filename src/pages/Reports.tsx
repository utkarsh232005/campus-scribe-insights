
import React from 'react';
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

const Reports = () => {
  // Mock data for reports
  const reports = [
    {
      id: "REP-2024-001",
      title: "Computer Science Department Annual Report",
      department: "Computer Science",
      submittedBy: "Dr. Alan Turing",
      submittedOn: "2024-04-15",
      status: "approved",
      publications: 45,
      conferences: 12,
      projects: 8,
      funding: 250000
    },
    {
      id: "REP-2024-002",
      title: "Electrical Engineering Department Annual Report",
      department: "Electrical Engineering",
      submittedBy: "Dr. Nikola Tesla",
      submittedOn: "2024-04-12",
      status: "pending",
      publications: 38,
      conferences: 15,
      projects: 10,
      funding: 320000
    },
    {
      id: "REP-2024-003",
      title: "Physics Department Annual Report",
      department: "Physics",
      submittedBy: "Dr. Richard Feynman",
      submittedOn: "2024-04-10",
      status: "approved",
      publications: 52,
      conferences: 18,
      projects: 5,
      funding: 180000
    },
    {
      id: "REP-2024-004",
      title: "Mathematics Department Annual Report",
      department: "Mathematics",
      submittedBy: "Dr. John Nash",
      submittedOn: "2024-04-08",
      status: "rejected",
      publications: 28,
      conferences: 6,
      projects: 3,
      funding: 90000
    },
    {
      id: "REP-2024-005",
      title: "Mechanical Engineering Department Annual Report",
      department: "Mechanical Engineering",
      submittedBy: "Dr. Robert Brown",
      submittedOn: "2024-04-05",
      status: "approved",
      publications: 32,
      conferences: 9,
      projects: 7,
      funding: 210000
    },
  ];

  // Data for department performance chart
  const departmentData = [
    { 
      name: "CS", 
      publications: 45, 
      conferences: 12, 
      projects: 8, 
      funding: 25 
    },
    { 
      name: "EE", 
      publications: 38, 
      conferences: 15, 
      projects: 10, 
      funding: 32 
    },
    { 
      name: "PHYS", 
      publications: 52, 
      conferences: 18, 
      projects: 5, 
      funding: 18 
    },
    { 
      name: "MATH", 
      publications: 28, 
      conferences: 6, 
      projects: 3, 
      funding: 9 
    },
    { 
      name: "MECH", 
      publications: 32, 
      conferences: 9, 
      projects: 7, 
      funding: 21 
    },
  ];

  // Data for yearly comparison chart
  const yearlyData = [
    { name: "2019", publications: 120, conferences: 45, projects: 18, funding: 65 },
    { name: "2020", publications: 135, conferences: 40, projects: 20, funding: 75 },
    { name: "2021", publications: 115, conferences: 38, projects: 25, funding: 80 },
    { name: "2022", publications: 160, conferences: 50, projects: 30, funding: 95 },
    { name: "2023", publications: 195, conferences: 60, projects: 33, funding: 105 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

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
            <div className="text-2xl font-bold">152</div>
            <p className="text-xs text-gray-500">+12% from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Publications</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">520</div>
            <p className="text-xs text-gray-500">+8% from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85</div>
            <p className="text-xs text-gray-500">+15% from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.5M</div>
            <p className="text-xs text-gray-500">+22% from last year</p>
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
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>
            View and manage all submitted annual reports
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>{report.department}</TableCell>
                  <TableCell>{report.submittedBy}</TableCell>
                  <TableCell>{report.submittedOn}</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Reports;
