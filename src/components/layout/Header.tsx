
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from '@/context/NotificationContext';
import { format } from 'date-fns';

interface HeaderProps {
  user: {
    name: string;
    role: string;
    avatar?: string;
  };
  isAdmin?: boolean;
}

const Header = ({ user, isAdmin = false }: HeaderProps) => {
  const { notifications } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/logout');
  };

  // Count unread notifications
  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-end px-6">
      <div className="flex items-center space-x-4">
        <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 bg-gray-800 border-gray-700 text-gray-100 max-h-[400px] overflow-y-auto" align="end">
            <DropdownMenuLabel className="flex justify-between items-center">
              <span>Notifications</span>
              <Badge variant="outline" className="bg-gray-700/50 text-xs">
                {notifications.length} total
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700" />
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-400">No notifications</div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className={`p-3 border-l-2 ${
                  notification.type === 'error' ? 'border-red-500 bg-red-900/10' : 
                  notification.type === 'success' ? 'border-green-500 bg-green-900/10' : 
                  'border-blue-500 bg-blue-900/10'
                } ${notification.read ? 'opacity-70' : ''}`}>
                  <div className="w-full">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium">{notification.message}</p>
                      <Badge variant="outline" className="text-xs ml-2 whitespace-nowrap">{
                        notification.created_at ? format(new Date(notification.created_at), 'HH:mm') : ''
                      }</Badge>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {notification.created_at ? format(new Date(notification.created_at), 'MMM d, yyyy') : ''}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))
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
