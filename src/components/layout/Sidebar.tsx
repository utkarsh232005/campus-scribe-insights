import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Award,
  FileText,
  Calendar,
  Settings,
  ChevronDown,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Building,
  BarChart3,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
}

interface SidebarSubmenuProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  children: React.ReactNode;
}

const SidebarItem = ({ to, icon, label, active, onClick }: SidebarItemProps) => (
  <Link
    to={to}
    className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
      active
        ? 'bg-gray-800 text-white font-medium'
        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
    }`}
    onClick={onClick}
  >
    <span className="mr-3 text-lg">{icon}</span>
    <span>{label}</span>
  </Link>
);

const SidebarSubmenu = ({ icon, label, active, children }: SidebarSubmenuProps) => {
  const [isOpen, setIsOpen] = useState(active);

  return (
    <div className="mb-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm transition-colors ${
          active
            ? 'bg-gray-800 text-white font-medium'
            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
        }`}
      >
        <div className="flex items-center">
          <span className="mr-3 text-lg">{icon}</span>
          <span>{label}</span>
        </div>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {isOpen && <div className="ml-6 mt-1 space-y-1">{children}</div>}
    </div>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeMobileMenu = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isActiveGroup = (paths: string[]) => {
    return paths.some(path => location.pathname.startsWith(path));
  };

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <button
          className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`${
          isMobile
            ? `fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out ${
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
              }`
            : 'w-64 min-w-64'
        } bg-gray-900 border-r border-gray-800 overflow-y-auto sidebar-scrollbar`}
      >
        <div className="p-4">
          <div className="flex items-center mb-8">
            <GraduationCap className="h-8 w-8 text-blue-500" />
            <h1 className="ml-2 text-xl font-bold text-white">Faculty Portal</h1>
          </div>

          <nav className="space-y-1">
            <SidebarItem
              to="/"
              icon={<LayoutDashboard />}
              label="Dashboard"
              active={isActive('/')}
              onClick={closeMobileMenu}
            />

            <SidebarItem
              to="/faculty"
              icon={<Users />}
              label="Faculty"
              active={isActive('/faculty')}
              onClick={closeMobileMenu}
            />

            <SidebarItem
              to="/awards"
              icon={<Award />}
              label="Awards"
              active={isActive('/awards')}
              onClick={closeMobileMenu}
            />

            <SidebarItem
              to="/reports"
              icon={<FileText />}
              label="Reports"
              active={isActive('/reports')}
              onClick={closeMobileMenu}
            />

            <SidebarItem
              to="/events"
              icon={<Calendar />}
              label="Events"
              active={isActive('/events')}
              onClick={closeMobileMenu}
            />

            <SidebarSubmenu
              icon={<BookOpen />}
              label="Academics"
              active={isActiveGroup(['/courses', '/programs', '/research'])}
            >
              <SidebarItem
                to="/courses"
                icon={<ChevronRight size={16} />}
                label="Courses"
                active={isActive('/courses')}
                onClick={closeMobileMenu}
              />
              <SidebarItem
                to="/programs"
                icon={<ChevronRight size={16} />}
                label="Programs"
                active={isActive('/programs')}
                onClick={closeMobileMenu}
              />
              <SidebarItem
                to="/research"
                icon={<ChevronRight size={16} />}
                label="Research"
                active={isActive('/research')}
                onClick={closeMobileMenu}
              />
            </SidebarSubmenu>

            <SidebarItem
              to="/departments"
              icon={<Building />}
              label="Departments"
              active={isActive('/departments')}
              onClick={closeMobileMenu}
            />

            {isAdmin && (
              <>
                <div className="pt-4 pb-2">
                  <div className="px-3">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Admin
                    </h3>
                  </div>
                </div>

                <SidebarItem
                  to="/admin/dashboard"
                  icon={<BarChart3 />}
                  label="Admin Dashboard"
                  active={isActive('/admin/dashboard')}
                  onClick={closeMobileMenu}
                />

                <SidebarItem
                  to="/admin/users"
                  icon={<ShieldCheck />}
                  label="User Management"
                  active={isActive('/admin/users')}
                  onClick={closeMobileMenu}
                />

                <SidebarItem
                  to="/admin/settings"
                  icon={<Settings />}
                  label="System Settings"
                  active={isActive('/admin/settings')}
                  onClick={closeMobileMenu}
                />
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeMobileMenu}
        />
      )}
    </>
  );
};

export default Sidebar;
