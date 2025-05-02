import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Sidebar as UISidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { motion } from "framer-motion";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signOut();
  };

  // Hide scrollbar with direct CSS
  const hideScrollbarStyle = {
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  };

  // Add ::-webkit-scrollbar style to document
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .sidebar-content::-webkit-scrollbar { 
        display: none !important; 
      }
    `;
    document.head.append(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <Home className="h-5 w-5 shrink-0 text-gray-400" />,
      active: location.pathname === '/' || location.pathname === '/dashboard',
    },
    {
      label: 'Reports',
      href: '/reports',
      icon: <FileText className="h-5 w-5 shrink-0 text-gray-400" />,
      active: location.pathname === '/reports',
    },
    {
      label: 'Submit Report',
      href: '/submit-report',
      icon: <BarChart className="h-5 w-5 shrink-0 text-gray-400" />,
      active: location.pathname === '/submit-report',
    },
    {
      label: 'Calendar',
      href: '/calendar',
      icon: <Calendar className="h-5 w-5 shrink-0 text-gray-400" />,
      active: location.pathname === '/calendar',
    },
    {
      label: 'Faculty',
      href: '/faculty',
      icon: <Users className="h-5 w-5 shrink-0 text-gray-400" />,
      active: location.pathname === '/faculty',
    },
    {
      label: 'Awards',
      href: '/awards',
      icon: <Award className="h-5 w-5 shrink-0 text-gray-400" />,
      active: location.pathname === '/awards',
    },
    {
      label: 'Departments',
      href: '/departments',
      icon: <School className="h-5 w-5 shrink-0 text-gray-400" />,
      active: location.pathname === '/departments',
    },
    {
      label: 'Analytics',
      href: '/analytics',
      icon: <PieChart className="h-5 w-5 shrink-0 text-gray-400" />,
      active: location.pathname === '/analytics',
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: <Settings className="h-5 w-5 shrink-0 text-gray-400" />,
      active: location.pathname === '/settings',
    }
  ];

  const links = menuItems.map(item => ({
    label: item.label,
    href: item.href,
    icon: React.cloneElement(item.icon as React.ReactElement, {
      className: cn(
        "h-5 w-5 shrink-0",
        item.active ? "text-blue-400" : "text-gray-400 group-hover/sidebar:text-gray-200"
      )
    })
  }));

  return (
    <UISidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10 sidebar-content" style={hideScrollbarStyle}>
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink 
                key={idx} 
                link={link}
                className={location.pathname === link.href ? "bg-blue-500/20 text-blue-400" : ""}
              />
            ))}
          </div>
        </div>
        <div className="border-t border-gray-800/40 pt-4 mt-4">
          <SidebarLink
            link={{
              label: "Profile",
              href: "/profile",
              icon: <User className="h-5 w-5 shrink-0 text-gray-400 group-hover/sidebar:text-gray-200" />
            }}
            className="mb-2"
          />
          <SidebarLink
            link={{
              label: "Logout",
              href: "#",
              icon: <LogOut className="h-5 w-5 shrink-0 text-red-400 group-hover/sidebar:text-red-300" />
            }}
            onClick={handleLogout}
            className="text-red-400 hover:bg-red-500/10"
          />
        </div>
      </SidebarBody>
    </UISidebar>
  );
};

export const Logo = () => {
  return (
    <Link to="/dashboard" className="relative z-20 flex items-center space-x-2 py-3 text-sm font-normal">
      <div className="h-6 w-6 shrink-0 rounded-md bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-white text-base"
      >
        Campus Insights
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link to="/dashboard" className="relative z-20 flex items-center justify-center space-x-2 py-3 text-sm font-normal">
      <div className="h-6 w-6 shrink-0 rounded-md bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20" />
    </Link>
  );
};

export default Sidebar;
