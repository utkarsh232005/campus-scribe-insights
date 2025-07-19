
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from '@/context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  user: {
    name: string;
    role: string;
    avatar?: string;
  };
  isAdmin?: boolean;
}

const Header = ({ user, isAdmin = false }: HeaderProps) => {
  const notificationContext = useNotifications();
  const notifications = notificationContext?.notifications || [];
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const navigate = useNavigate();

  // Effect to check for new notifications
  useEffect(() => {
    if (notifications.length > 0) {
      setHasNewNotifications(true);
      
      // Reset the notification indicator after 5 seconds
      const timer = setTimeout(() => {
        setHasNewNotifications(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  const handleLogout = () => {
    navigate('/logout');
  };

  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-end px-6">
      <div className="flex items-center space-x-4">
        <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-300" />
              <AnimatePresence>
                {(notifications.length > 0 || hasNewNotifications) && (
                  <motion.span 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                  />
                )}
              </AnimatePresence>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 bg-gray-800 border-gray-700 text-gray-100" align="end">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700" />
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-400">No notifications</div>
            ) : (
              <div className="max-h-[70vh] overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="p-4 border-b border-gray-700 last:border-b-0">
                    <div>
                      <p>{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5 text-gray-300" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700 text-gray-100" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-gray-400">
                  {user.role}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem className="text-gray-200 focus:bg-gray-700 focus:text-gray-100">
              <Link to="/profile" className="w-full">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-200 focus:bg-gray-700 focus:text-gray-100">
              <Link to="/settings" className="w-full">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem 
              className="text-gray-200 focus:bg-gray-700 focus:text-gray-100 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
