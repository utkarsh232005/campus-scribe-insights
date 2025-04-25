
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
    <div className="flex h-screen bg-black">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-black p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
