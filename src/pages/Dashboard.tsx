
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import ActivityList from '@/components/dashboard/ActivityList';
import StarFaculty from '@/components/dashboard/StarFaculty';
import ReportChart from '@/components/dashboard/ReportChart';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Users, FileText, DollarSign, Award } from 'lucide-react';

const Dashboard = () => {
  // Mock data for components
  const facultyData = [
    { id: "F001", name: "Dr. Smith", publications: 24, percentile: "95%", year: 2023, avatar: "/placeholder.svg" },
    { id: "F002", name: "Dr. Johnson", publications: 18, percentile: "87%", year: 2023, avatar: "/placeholder.svg" },
    { id: "F003", name: "Dr. Williams", publications: 15, percentile: "82%", year: 2023, avatar: "/placeholder.svg" },
  ];

  const activitiesData = [
    { 
      id: 1, 
      title: "Research Paper Published", 
      description: "Dr. Johnson published a new paper in Nature", 
      icon: <FileText size={16} />, 
      iconColor: "bg-blue-500/20", 
      date: "Today" 
    },
    { 
      id: 2, 
      title: "Faculty Meeting", 
      description: "Monthly department meeting scheduled", 
      icon: <Users size={16} />, 
      iconColor: "bg-green-500/20", 
      date: "Tomorrow" 
    },
    { 
      id: 3, 
      title: "Grant Approved", 
      description: "$250,000 research grant approved", 
      icon: <DollarSign size={16} />, 
      iconColor: "bg-yellow-500/20", 
      date: "3 days ago" 
    },
  ];

  const chartData = [
    { name: "Jan", journals: 10, conferences: 5 },
    { name: "Feb", journals: 15, conferences: 8 },
    { name: "Mar", journals: 12, conferences: 7 },
    { name: "Apr", journals: 18, conferences: 10 },
    { name: "May", journals: 20, conferences: 12 },
    { name: "Jun", journals: 22, conferences: 15 },
  ];

  const chartDataKeys = [
    { key: "journals", color: "#4f46e5", name: "Journal Papers" },
    { key: "conferences", color: "#06b6d4", name: "Conference Papers" },
  ];

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <motion.h1 
            className="text-2xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Faculty Dashboard
          </motion.h1>
          <div className="flex items-center text-sm text-gray-500">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span>Dashboard</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Using the standard div with map approach for stat cards */}
        {[
          { title: "Faculty Members", value: "42", icon: <Users className="h-4 w-4 text-white" />, iconBg: "bg-blue-600" },
          { title: "Publications", value: "156", icon: <FileText className="h-4 w-4 text-white" />, iconBg: "bg-green-600" },
          { title: "Research Grants", value: "$2.4M", icon: <DollarSign className="h-4 w-4 text-white" />, iconBg: "bg-yellow-600" },
          { title: "Awards", value: "24", icon: <Award className="h-4 w-4 text-white" />, iconBg: "bg-purple-600" }
        ].map((card, index) => (
          <div key={card.title}>
            <StatCard 
              title={card.title}
              value={card.value}
              icon={card.icon}
              iconBg={card.iconBg}
            />
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Publication Analytics</h3>
              <ReportChart 
                title="Publication Trends"
                type="line"
                data={chartData}
                dataKeys={chartDataKeys}
              />
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <StarFaculty 
            title="Star Faculty Members"
            faculty={facultyData}
          />
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <ActivityList 
          title="Recent Activities"
          activities={activitiesData}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
