
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
  Award,
  School,
  PieChart,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

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
      title: 'Awards',
      icon: Award,
      path: '/awards',
      active: location.pathname === '/awards',
    },
    {
      title: 'Departments',
      icon: School,
      path: '/departments',
      active: location.pathname === '/departments',
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
    <div 
      className={cn(
        "h-screen bg-gray-900 shadow-lg flex flex-col transition-all duration-300 border-r border-gray-800 relative",
        isHovered ? "w-64" : "w-20"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn(
        "p-4 flex items-center justify-between border-b border-gray-800",
        isHovered ? "justify-between" : "justify-center"
      )}>
        <Link to="/" className="flex items-center">
          <School className="text-blue-500 h-8 w-8" />
          {isHovered && (
            <span className="ml-2 text-xl font-bold text-white">COLLEGE REPORT</span>
          )}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-2">
          {isHovered && <p className="text-xs font-semibold text-gray-500 mb-2">MAIN MENU</p>}
          <nav>
            <ul>
              {menuItems.map((item, index) => (
                <li key={index} className="mb-1">
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center py-3 px-3 rounded-md transition-colors",
                      isHovered ? "justify-start" : "justify-center",
                      item.active 
                        ? "bg-blue-600 text-white" 
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5",
                      isHovered ? "mr-3" : "mr-0"
                    )} />
                    {isHovered && <span>{item.title}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-gray-800">
        <Link
          to="/logout"
          className={cn(
            "flex items-center py-2 px-3 rounded-md text-red-500 hover:bg-gray-800 transition-colors",
            isHovered ? "justify-start" : "justify-center"
          )}
        >
          <LogOut className={cn(
            "h-5 w-5",
            isHovered ? "mr-3" : "mr-0"
          )} />
          {isHovered && <span>Logout</span>}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
