
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const user = {
    name: "Ryan Taylor",
    role: "Administrator",
    avatar: "/lovable-uploads/5451083e-aaa3-48cd-a5b3-719f0e1c7ef2.png"
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
        <footer className="bg-white py-4 px-6 border-t text-center">
          <p className="text-sm text-gray-500">COPYRIGHT © {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
