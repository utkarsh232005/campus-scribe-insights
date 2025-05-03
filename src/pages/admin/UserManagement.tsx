
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useNotifications } from '@/context/NotificationContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  Search,
  UserCheck,
  UserX,
  Info,
  UserCog,
  Filter,
  RefreshCw,
  Mail,
  Shield
} from 'lucide-react';
import { format } from 'date-fns';

interface UserProfile {
  id: string;
  department: string;
  created_at: string;
  email?: string;
  last_sign_in_at?: string | null;
  status?: string;
  isAdmin?: boolean;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        console.log("Fetching users data...");
        
        // Get auth users from auth.users table via built-in RPC
        const { data: authUsersData, error: authUsersError } = await supabase.auth.admin.listUsers();
        
        if (authUsersError) {
          console.error('Error fetching auth users:', authUsersError);
          throw new Error('Failed to fetch user data');
        }
        
        // Get profiles from profiles table
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          throw new Error('Failed to fetch profile data');
        }
        
        // Get admin users
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('email')
          .eq('is_active', true);
        
        if (adminError) {
          console.error('Error fetching admin users:', adminError);
        }
        
        const adminEmails = adminData ? adminData.map(admin => admin.email.toLowerCase()) : [];
        console.log("Admin emails:", adminEmails);
        
        // Merge auth and profile data
        let mergedUsers: UserProfile[] = [];
        
        if (authUsersData?.users) {
          mergedUsers = authUsersData.users.map(authUser => {
            // Find matching profile if exists
            const profile = profilesData?.find(p => p.id === authUser.id);
            
            // Check if user is admin
            const isAdmin = authUser.email ? adminEmails.includes(authUser.email.toLowerCase()) : false;
            
            return {
              id: authUser.id,
              department: profile?.department || authUser.user_metadata?.department || 'unknown',
              email: authUser.email || 'No email',
              created_at: authUser.created_at,
              last_sign_in_at: authUser.last_sign_in_at,
              status: authUser.banned ? 'inactive' : 'active',
              isAdmin: isAdmin
            };
          });
        }
        
        console.log("Merged users:", mergedUsers);
        
        setUsers(mergedUsers);
        setFilteredUsers(mergedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: 'Error',
          description: 'Failed to load user data',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [toast]);

  // Apply filters and search
  useEffect(() => {
    let result = [...users];
    
    // Apply department filter
    if (filterDepartment !== 'all') {
      result = result.filter(user => user.department === filterDepartment);
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        user => 
          (user.email?.toLowerCase().includes(term) || false) ||
          (user.department?.toLowerCase().includes(term) || false) ||
          (user.id?.toLowerCase().includes(term) || false)
      );
    }
    
    setFilteredUsers(result);
  }, [searchTerm, filterDepartment, users]);

  const handleUserAction = async (userId: string, action: 'activate' | 'deactivate') => {
    try {
      // Update the user in Supabase Auth
      if (action === 'deactivate') {
        const { error } = await supabase.auth.admin.updateUserById(
          userId,
          { ban_duration: '999999h' } // Effectively permanent
        );
        
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.admin.updateUserById(
          userId,
          { ban_duration: null }
        );
        
        if (error) throw error;
      }
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, status: action === 'activate' ? 'active' : 'inactive' } 
          : user
      ));
      
      setFilteredUsers(filteredUsers.map(user => 
        user.id === userId 
          ? { ...user, status: action === 'activate' ? 'active' : 'inactive' } 
          : user
      ));
      
      // Send notification
      await addNotification({
        message: `User ${action === 'activate' ? 'activated' : 'deactivated'} by admin`,
        type: action === 'activate' ? 'success' : 'warning'
      });
      
      toast({
        title: action === 'activate' ? 'User activated' : 'User deactivated',
        description: `User has been ${action === 'activate' ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      toast({
        title: 'Action failed',
        description: `Failed to ${action} the user`,
        variant: 'destructive'
      });
    }
  };

  // Get unique departments for filtering
  const departments = ['all', ...new Set(users.filter(user => user.department).map(user => user.department))];

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white animate-fade-in">User Management</h1>
            <p className="text-gray-400">Manage faculty members and their permissions</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search users..."
                className="pl-9 w-full md:w-64 bg-gray-900 border-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Department: {filterDepartment === 'all' ? 'All' : filterDepartment.replace(/_/g, ' ')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-800">
                {departments.map((dept) => (
                  <DropdownMenuItem
                    key={dept}
                    className={dept === filterDepartment ? "bg-gray-800" : ""}
                    onClick={() => setFilterDepartment(dept)}
                  >
                    {dept === 'all' ? 'All Departments' : dept.replace(/_/g, ' ')}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setFilterDepartment('all');
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Users className="mr-2 h-5 w-5" />
              Faculty Users
              <Badge className="ml-2 bg-blue-600">{filteredUsers.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-12">
                <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="rounded-md border border-gray-800">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id} className="animate-slide-in">
                          <TableCell>
                            <div className="flex items-center">
                              <div className="h-9 w-9 rounded-full bg-gray-800 flex items-center justify-center mr-3">
                                <span className="text-xs font-bold">{user.email?.[0]?.toUpperCase() || '?'}</span>
                              </div>
                              <div>
                                <div className="font-medium text-sm">{user.email}</div>
                                <div className="text-xs text-gray-500 flex items-center">
                                  <Mail className="h-3 w-3 mr-1" />
                                  ID: {user.id.substring(0, 8)}...
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-gray-800 text-gray-300 hover:bg-gray-700">
                              {user.department?.replace(/_/g, ' ') || 'Not set'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.status === 'active' ? (
                              <Badge className="bg-green-900/30 text-green-500 border-green-800/30">
                                <UserCheck className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            ) : (
                              <Badge className="bg-red-900/30 text-red-500 border-red-800/30">
                                <UserX className="h-3 w-3 mr-1" />
                                Inactive
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {user.isAdmin ? (
                              <Badge className="bg-purple-900/30 text-purple-300 border-purple-800/30">
                                <Shield className="h-3 w-3 mr-1" />
                                Admin
                              </Badge>
                            ) : (
                              <Badge className="bg-blue-900/30 text-blue-300 border-blue-800/30">
                                Faculty
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {user.created_at ? format(new Date(user.created_at), 'MMM d, yyyy') : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <UserCog className="h-4 w-4 mr-1" />
                                  Actions
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 bg-gray-900 border-gray-800">
                                <DropdownMenuItem 
                                  className="text-green-500 focus:text-green-500"
                                  onClick={() => handleUserAction(user.id, 'activate')}
                                  disabled={user.status === 'active'}
                                >
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Activate User
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-500 focus:text-red-500"
                                  onClick={() => handleUserAction(user.id, 'deactivate')}
                                  disabled={user.status === 'inactive'}
                                >
                                  <UserX className="h-4 w-4 mr-2" />
                                  Deactivate User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                          <Info className="h-5 w-5 mx-auto mb-2" />
                          No users found matching your criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-slide-in {
            animation: slideIn 0.3s ease forwards;
          }
          
          .animate-fade-in {
            animation: fadeIn 0.6s ease-in-out;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </DashboardLayout>
  );
};

export default UserManagement;
