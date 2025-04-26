import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import ReportChart from '@/components/dashboard/ReportChart';
import ActivityList from '@/components/dashboard/ActivityList';
import StarFaculty from '@/components/dashboard/StarFaculty';
import { Users, Award, BookOpen, DollarSign, Trophy, Pencil, FileText, Award as AwardIcon } from 'lucide-react';
const Index = () => {
  // Mock data for statistics
  const stats = [{
    title: 'Faculty',
    value: '75+',
    icon: <Users className="h-6 w-6 text-blue-600" />,
    iconBg: 'bg-blue-100'
  }, {
    title: 'Publications',
    value: '520+',
    icon: <BookOpen className="h-6 w-6 text-green-600" />,
    iconBg: 'bg-green-100'
  }, {
    title: 'Awards',
    value: '50+',
    icon: <Award className="h-6 w-6 text-yellow-600" />,
    iconBg: 'bg-yellow-100'
  }, {
    title: 'Funding',
    value: '$1.2M',
    icon: <DollarSign className="h-6 w-6 text-red-600" />,
    iconBg: 'bg-red-100'
  }];

  // Mock data for line chart
  const lineChartData = [{
    name: 'Jan',
    faculty: 45,
    student: 25
  }, {
    name: 'Feb',
    faculty: 52,
    student: 30
  }, {
    name: 'Mar',
    faculty: 60,
    student: 35
  }, {
    name: 'Apr',
    faculty: 55,
    student: 32
  }, {
    name: 'May',
    faculty: 48,
    student: 35
  }, {
    name: 'Jun',
    faculty: 42,
    student: 50
  }, {
    name: 'Jul',
    faculty: 35,
    student: 25
  }];

  // Mock data for bar chart
  const barChartData = [{
    name: 'CS',
    girls: 400,
    boys: 300
  }, {
    name: 'EE',
    girls: 500,
    boys: 600
  }, {
    name: 'ME',
    girls: 450,
    boys: 350
  }, {
    name: 'CE',
    girls: 300,
    boys: 250
  }, {
    name: 'BT',
    girls: 450,
    boys: 350
  }, {
    name: 'CH',
    girls: 500,
    boys: 400
  }, {
    name: 'PH',
    girls: 250,
    boys: 300
  }, {
    name: 'MA',
    girls: 350,
    boys: 400
  }, {
    name: 'HS',
    girls: 550,
    boys: 450
  }];

  // Mock data for activities
  const activities = [{
    id: 1,
    title: "1st place in 'Chess'",
    description: "John Doe won 1st place in 'Chess'",
    icon: <Trophy className="h-4 w-4 text-yellow-600" />,
    iconColor: "bg-yellow-100",
    date: "1 day ago"
  }, {
    id: 2,
    title: "Participated in 'Carrom'",
    description: "Justin Lee participated in 'Carrom'",
    icon: <Pencil className="h-4 w-4 text-blue-600" />,
    iconColor: "bg-blue-100",
    date: "2 hours ago"
  }, {
    id: 3,
    title: "Internation conference in 'St.John School'",
    description: "Justin Leentended internation conference in 'St.John School'",
    icon: <FileText className="h-4 w-4 text-green-600" />,
    iconColor: "bg-green-100",
    date: "2 week ago"
  }, {
    id: 4,
    title: "Won 1st place in 'Chess'",
    description: "John Doe won 1st place in 'Chess'",
    icon: <AwardIcon className="h-4 w-4 text-purple-600" />,
    iconColor: "bg-purple-100",
    date: "3 day ago"
  }];

  // Mock data for star faculty
  const starFaculty = [{
    id: "PRE2209",
    name: "John Smith",
    publications: 1185,
    percentile: "98%",
    year: 2019
  }, {
    id: "PRE1245",
    name: "Julie Hoskins",
    publications: 1195,
    percentile: "99.5%",
    year: 2018
  }, {
    id: "PRE1625",
    name: "Pennington Joy",
    publications: 1196,
    percentile: "99.6%",
    year: 2017
  }, {
    id: "PRE2516",
    name: "Millie Marsden",
    publications: 1187,
    percentile: "98.2%",
    year: 2016
  }, {
    id: "PRE2209",
    name: "John Smith",
    publications: 1185,
    percentile: "98%",
    year: 2015
  }];
  return <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-50">Welcome Admin!</h1>
          <div className="flex items-center text-sm text-gray-500">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span>Admin</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => <StatCard key={index} title={stat.title} value={stat.value} icon={stat.icon} iconBg={stat.iconBg} />)}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ReportChart title="Overview" type="line" data={lineChartData} dataKeys={[{
        key: 'faculty',
        color: '#3366FF',
        name: 'Teacher'
      }, {
        key: 'student',
        color: '#36D399',
        name: 'Student'
      }]} />
        <ReportChart title="Number of Students" type="bar" data={barChartData} dataKeys={[{
        key: 'girls',
        color: '#36D399',
        name: 'Girls'
      }, {
        key: 'boys',
        color: '#3366FF',
        name: 'Boys'
      }]} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-transparent">
        <StarFaculty title="Star Faculty" faculty={starFaculty} />
        <ActivityList title="Faculty Activity" activities={activities} />
      </div>
    </DashboardLayout>;
};
export default Index;