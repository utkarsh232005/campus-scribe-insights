
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import ActivityList from '@/components/dashboard/ActivityList';
import ReportChart from '@/components/dashboard/ReportChart';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Users, FileText, DollarSign, Award, GraduationCap, BookOpen, BarChart3, LineChart, PieChart, TrendingUp, CalendarDays, Presentation, Lightbulb } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('publications');
  
  // Faculty data
  const facultyData = [{
    id: "F001",
    name: "Dr. Smith",
    publications: 24,
    percentile: "95%",
    year: 2023,
    avatar: "/placeholder.svg"
  }, {
    id: "F002",
    name: "Dr. Johnson",
    publications: 18,
    percentile: "87%",
    year: 2023,
    avatar: "/placeholder.svg"
  }, {
    id: "F003",
    name: "Dr. Williams",
    publications: 15,
    percentile: "82%",
    year: 2023,
    avatar: "/placeholder.svg"
  }];
  
  // Activities data
  const activitiesData = [{
    id: 1,
    title: "Research Paper Published",
    description: "Dr. Johnson published a new paper in Nature",
    icon: <FileText size={16} />,
    iconColor: "bg-blue-500/20",
    date: "Today"
  }, {
    id: 2,
    title: "Faculty Meeting",
    description: "Monthly department meeting scheduled",
    icon: <Users size={16} />,
    iconColor: "bg-green-500/20",
    date: "Tomorrow"
  }, {
    id: 3,
    title: "Grant Approved",
    description: "$250,000 research grant approved",
    icon: <DollarSign size={16} />,
    iconColor: "bg-yellow-500/20",
    date: "3 days ago"
  }, {
    id: 4,
    title: "New Research Project",
    description: "AI Ethics Initiative launched",
    icon: <Lightbulb size={16} />,
    iconColor: "bg-purple-500/20",
    date: "1 week ago"
  }];
  
  // Publication data - monthly trend
  const publicationTrendData = [{
    name: "Jan",
    journals: 10,
    conferences: 5
  }, {
    name: "Feb",
    journals: 15,
    conferences: 8
  }, {
    name: "Mar",
    journals: 12,
    conferences: 7
  }, {
    name: "Apr",
    journals: 18,
    conferences: 10
  }, {
    name: "May",
    journals: 20,
    conferences: 12
  }, {
    name: "Jun",
    journals: 22,
    conferences: 15
  }, {
    name: "Jul",
    journals: 24,
    conferences: 18
  }, {
    name: "Aug",
    journals: 21,
    conferences: 16
  }, {
    name: "Sep",
    journals: 25,
    conferences: 19
  }, {
    name: "Oct",
    journals: 28,
    conferences: 20
  }, {
    name: "Nov",
    journals: 30,
    conferences: 22
  }, {
    name: "Dec",
    journals: 32,
    conferences: 25
  }];
  
  const publicationTrendKeys = [{
    key: "journals",
    color: "#4f46e5",
    name: "Journal Papers"
  }, {
    key: "conferences",
    color: "#06b6d4",
    name: "Conference Papers"
  }];

  // Student enrollment data
  const studentEnrollmentData = [
    {
      name: "2020",
      engineering: 120,
      arts: 80,
      science: 100,
      business: 90,
      medicine: 70
    },
    {
      name: "2021",
      engineering: 150,
      arts: 90,
      science: 120,
      business: 110,
      medicine: 85
    },
    {
      name: "2022",
      engineering: 180,
      arts: 100,
      science: 145,
      business: 130,
      medicine: 100
    },
    {
      name: "2023",
      engineering: 210,
      arts: 110,
      science: 160,
      business: 150,
      medicine: 120
    },
    {
      name: "2024",
      engineering: 240,
      arts: 130,
      science: 180,
      business: 170,
      medicine: 140
    }
  ];

  const studentEnrollmentKeys = [
    { key: "engineering", color: "#4f46e5", name: "Engineering" },
    { key: "arts", color: "#ec4899", name: "Arts" },
    { key: "science", color: "#06b6d4", name: "Science" },
    { key: "business", color: "#f59e0b", name: "Business" },
    { key: "medicine", color: "#10b981", name: "Medicine" }
  ];
  
  // Department performance data
  const departmentPerformanceData = [
    { name: "Computer Science", value: 85, fill: "#4f46e5" },
    { name: "Mathematics", value: 75, fill: "#06b6d4" },
    { name: "Physics", value: 65, fill: "#10b981" },
    { name: "Electrical Engineering", value: 80, fill: "#f59e0b" },
    { name: "Mechanical Engineering", value: 70, fill: "#ec4899" }
  ];
  
  const departmentPerformanceKeys = [
    { key: "value", color: "#4f46e5", name: "Performance Score" }
  ];
  
  // Research focus distribution
  const researchFocusData = [
    { name: "AI & Machine Learning", value: 35 },
    { name: "Quantum Computing", value: 20 },
    { name: "Renewable Energy", value: 15 },
    { name: "Biotechnology", value: 10 },
    { name: "Robotics", value: 12 },
    { name: "Others", value: 8 }
  ];
  
  const researchFocusKeys = [
    { key: "value", color: "#4f46e5", name: "Research Focus" },
  ];
  
  // Research funding by source
  const fundingSourceData = [
    { name: "Government", value: 45 },
    { name: "Corporate", value: 30 },
    { name: "Non-profit", value: 15 },
    { name: "University", value: 10 }
  ];
  
  const fundingSourceKeys = [
    { key: "value", color: "#10b981", name: "Funding Source" }
  ];
  
  // Faculty skills radar chart data
  const facultySkillsData = [
    { name: "Research", value: 90 },
    { name: "Teaching", value: 85 },
    { name: "Grant Writing", value: 75 },
    { name: "Industry Collaboration", value: 70 },
    { name: "Community Outreach", value: 65 },
    { name: "Administration", value: 60 }
  ];
  
  const facultySkillsKeys = [
    { key: "value", color: "#4f46e5", name: "Faculty Competency" }
  ];
  
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-zinc-50"
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
        {[{
          title: "Faculty Members",
          value: "42",
          icon: <Users className="h-4 w-4 text-white" />,
          iconBg: "bg-blue-600"
        }, {
          title: "Publications",
          value: "256",
          icon: <FileText className="h-4 w-4 text-white" />,
          iconBg: "bg-green-600"
        }, {
          title: "Research Grants",
          value: "$3.2M",
          icon: <DollarSign className="h-4 w-4 text-white" />,
          iconBg: "bg-yellow-600"
        }, {
          title: "Awards",
          value: "38",
          icon: <Award className="h-4 w-4 text-white" />,
          iconBg: "bg-purple-600"
        }].map((card, index) => (
          <motion.div 
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <StatCard 
              title={card.title} 
              value={card.value} 
              icon={card.icon} 
              iconBg={card.iconBg} 
            />
          </motion.div>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-800">
            <TabsTrigger value="publications" className="data-[state=active]:bg-blue-600/20">
              <BookOpen className="w-4 h-4 mr-2" />
              Publications
            </TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-purple-600/20">
              <GraduationCap className="w-4 h-4 mr-2" />
              Enrollment
            </TabsTrigger>
            <TabsTrigger value="research" className="data-[state=active]:bg-green-600/20">
              <Lightbulb className="w-4 h-4 mr-2" />
              Research
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="publications" className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-zinc-50 flex items-center">
                  <LineChart className="h-5 w-5 mr-2 text-blue-500" />
                  Publication Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ReportChart 
                  title="" 
                  type="area" 
                  data={publicationTrendData} 
                  dataKeys={publicationTrendKeys} 
                  gradient={true}
                  height={240}
                />
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-zinc-50 flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-purple-500" />
                  Research Focus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ReportChart 
                  title="" 
                  type="pie" 
                  data={researchFocusData} 
                  dataKeys={researchFocusKeys}
                  gradient={true}
                  height={240}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-zinc-50 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-green-500" />
                Department Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReportChart 
                title="" 
                type="bar" 
                data={departmentPerformanceData} 
                dataKeys={departmentPerformanceKeys}
                gradient={true}
                height={240}
              />
            </CardContent>
          </Card>
        </motion.div>
      </TabsContent>
      
      <TabsContent value="students" className="mt-0">
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-zinc-50 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                Student Enrollment Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReportChart 
                title="" 
                type="line" 
                data={studentEnrollmentData} 
                dataKeys={studentEnrollmentKeys}
                height={300}
              />
            </CardContent>
          </Card>
        </motion.div>
      </TabsContent>
      
      <TabsContent value="research" className="mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-zinc-50 flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-yellow-500" />
                  Funding Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ReportChart 
                  title="" 
                  type="pie" 
                  data={fundingSourceData} 
                  dataKeys={fundingSourceKeys}
                  gradient={true}
                  height={240}
                />
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-zinc-50 flex items-center">
                  <Presentation className="h-5 w-5 mr-2 text-blue-500" />
                  Faculty Skills Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ReportChart 
                  title="" 
                  type="radar" 
                  data={facultySkillsData} 
                  dataKeys={facultySkillsKeys}
                  height={240}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
          </TabsContent>
          
          <TabsContent value="students" className="mt-6">
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-zinc-50 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                    Student Enrollment Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ReportChart 
                    title="" 
                    type="line" 
                    data={studentEnrollmentData} 
                    dataKeys={studentEnrollmentKeys}
                    height={300}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="research" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-full"
              >
                <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-zinc-50 flex items-center">
                      <PieChart className="h-5 w-5 mr-2 text-yellow-500" />
                      Funding Sources
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center overflow-hidden">
                    <div className="w-full max-w-xs mx-auto">
                      <ReportChart 
                        title="" 
                        type="pie" 
                        data={fundingSourceData} 
                        dataKeys={fundingSourceKeys}
                        gradient={true}
                        height={220}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-zinc-50 flex items-center">
                      <Presentation className="h-5 w-5 mr-2 text-blue-500" />
                      Faculty Skills Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ReportChart 
                      title="" 
                      type="radar" 
                      data={facultySkillsData} 
                      dataKeys={facultySkillsKeys}
                      height={240}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-zinc-50 flex items-center">
              <CalendarDays className="h-5 w-5 mr-2 text-blue-500" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ActivityList title="" activities={activitiesData} />
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
