
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const Profile = () => {
  const { user, isAdmin } = useAuth();
  
  // Format department string for display
  const formatDepartment = (department?: string) => {
    if (!department) return 'Not set';
    return department.replace(/_/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto transition-all duration-300 hover:shadow-lg animate-fade-in">
          <CardHeader className="border-b border-gray-800 pb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-primary/20">
                <AvatarImage src="/placeholder.svg" alt="Profile" />
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  Profile Information
                  {isAdmin ? (
                    <Badge className="bg-purple-900/30 text-purple-300 border-purple-800/30 ml-2">
                      <Shield className="h-3 w-3 mr-1" />
                      Admin
                    </Badge>
                  ) : (
                    <Badge className="bg-blue-900/30 text-blue-300 border-blue-800/30 ml-2">
                      <User className="h-3 w-3 mr-1" />
                      Faculty
                    </Badge>
                  )}
                </h2>
                <p className="text-gray-400">{user?.email}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-lg bg-gray-900/50 p-2 rounded-md border border-gray-800">{user?.email}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Department</label>
                <p className="text-lg bg-gray-900/50 p-2 rounded-md border border-gray-800">
                  {formatDepartment(user?.user_metadata?.department)}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Role</label>
                <p className="text-lg bg-gray-900/50 p-2 rounded-md border border-gray-800 flex items-center">
                  {isAdmin ? (
                    <>
                      <Shield className="h-4 w-4 mr-2 text-purple-400" />
                      Administrator
                    </>
                  ) : (
                    <>
                      <User className="h-4 w-4 mr-2 text-blue-400" />
                      Faculty
                    </>
                  )}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Account Created</label>
                <p className="text-lg bg-gray-900/50 p-2 rounded-md border border-gray-800">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        `}
      </style>
    </DashboardLayout>
  );
};

export default Profile;
