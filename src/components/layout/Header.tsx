import React from 'react';
import { Link } from 'react-router-dom';
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

interface HeaderProps {
  user: {
    name: string;
    role: string;
    avatar?: string;
  };
}

const Header = ({ user }: HeaderProps) => {
  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-end px-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        
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
            <DropdownMenuItem className="text-gray-200 focus:bg-gray-700 focus:text-gray-100">
              <Link to="/logout" className="w-full">Logout</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
