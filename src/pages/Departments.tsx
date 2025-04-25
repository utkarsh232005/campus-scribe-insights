
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { School } from 'lucide-react';

const Departments = () => {
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Departments</h1>
          <div className="flex items-center text-sm text-gray-400">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span>Departments</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Department List</h2>
        <p className="text-gray-400">Department management interface is under development.</p>
      </div>
    </DashboardLayout>
  );
};

export default Departments;
