
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { 
  BarChart, 
  FileText, 
  Calendar, 
  Users, 
  Settings, 
  Home, 
  ChevronRight,
  LogOut,
  PieChart,
  Award,
  School
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: Home,
      path: '/',
      active: location.pathname === '/',
    },
    {
      title: 'Reports',
      icon: FileText,
      path: '/reports',
      active: location.pathname === '/reports',
    },
    {
      title: 'Submit Report',
      icon: BarChart,
      path: '/submit-report',
      active: location.pathname === '/submit-report',
    },
    {
      title: 'Calendar',
      icon: Calendar,
      path: '/calendar',
      active: location.pathname === '/calendar',
    },
    {
      title: 'Faculty',
      icon: Users,
      path: '/faculty',
      active: location.pathname === '/faculty',
    },
    {
      title: 'Departments',
      icon: School,
      path: '/departments',
      active: location.pathname === '/departments',
    },
    {
      title: 'Awards',
      icon: Award,
      path: '/awards',
      active: location.pathname === '/awards',
    },
    {
      title: 'Analytics',
      icon: PieChart,
      path: '/analytics',
      active: location.pathname === '/analytics',
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/settings',
      active: location.pathname === '/settings',
    }
  ];

  return (
    <div className={cn(
      "h-screen bg-white shadow-md flex flex-col transition-all duration-300 border-r relative",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="p-4 flex items-center justify-between border-b">
        <Link to="/" className={cn(
          "flex items-center",
          collapsed ? "justify-center" : "justify-start"
        )}>
          <School className="text-college-blue h-8 w-8" />
          {!collapsed && (
            <span className="ml-2 text-xl font-bold text-college-blue">COLLEGE REPORT</span>
          )}
        </Link>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
        >
          <ChevronRight className={cn(
            "h-5 w-5 text-gray-500 transition-transform",
            collapsed ? "rotate-180" : ""
          )} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-2">
          {!collapsed && <p className="text-xs font-semibold text-gray-400 mb-2">MAIN MENU</p>}
          <nav>
            <ul>
              {menuItems.map((item, index) => (
                <li key={index} className="mb-1">
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center py-3 px-3 rounded-md transition-colors",
                      collapsed ? "justify-center" : "justify-start",
                      item.active 
                        ? "bg-college-blue text-white" 
                        : "text-gray-700 hover:bg-college-lightblue hover:text-college-blue"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5",
                      collapsed ? "mr-0" : "mr-3"
                    )} />
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="p-4 border-t">
        <Link
          to="/logout"
          className={cn(
            "flex items-center py-2 px-3 rounded-md text-red-500 hover:bg-red-50 transition-colors",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          <LogOut className={cn(
            "h-5 w-5",
            collapsed ? "mr-0" : "mr-3"
          )} />
          {!collapsed && <span>Logout</span>}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
