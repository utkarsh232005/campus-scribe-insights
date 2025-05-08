
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import ActivityList from '@/components/dashboard/ActivityList';
import StarFaculty from '@/components/dashboard/StarFaculty';
import ReportChart from '@/components/dashboard/ReportChart';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'motion';

const Dashboard = () => {
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
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <StatCard 
            title="Faculty Members"
            value="42"
            change="+3"
            trend="up"
            icon="users"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <StatCard 
            title="Publications"
            value="156"
            change="+12"
            trend="up"
            icon="file-text"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <StatCard 
            title="Research Grants"
            value="$2.4M"
            change="+$320K"
            trend="up"
            icon="dollar-sign"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <StatCard 
            title="Awards"
            value="24"
            change="+2"
            trend="up"
            icon="award"
          />
        </motion.div>
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
              <ReportChart />
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <StarFaculty />
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <ActivityList />
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
