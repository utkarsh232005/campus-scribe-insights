
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
  Mail
} from 'lucide-react';
import { format } from 'date-fns';

interface UserProfile {
  id: string;
  department: string;
  created_at: string;
  email?: string;
  last_sign_in_at?: string;
  status?: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Fetch profiles
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data) {
          // In a real app, you'd join with auth data or use an edge function
          // For demo purposes, we'll simulate some user status
          const usersWithStatus = data.map(user => ({
            ...user,
            email: `${user.department}@example.com`, // Simulated email
            status: Math.random() > 0.3 ? 'active' : 'inactive', // Random status
            last_sign_in_at: new Date(
              Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
            ).toISOString() // Random last sign in date within 30 days
          }));
          
          setUsers(usersWithStatus);
          setFilteredUsers(usersWithStatus);
        }
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
          user.email?.toLowerCase().includes(term) ||
          user.department?.toLowerCase().includes(term) ||
          user.id?.toLowerCase().includes(term)
      );
    }
    
    setFilteredUsers(result);
  }, [searchTerm, filterDepartment, users]);

  const handleUserAction = async (userId: string, action: 'activate' | 'deactivate') => {
    try {
      // In a real app, you'd update the user status in your auth system
      // For demo purposes, we'll just update our local state
      
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
  const departments = ['all', ...new Set(users.map(user => user.department))];

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">User Management</h1>
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
                      <TableHead>Created</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="h-9 w-9 rounded-full bg-gray-800 flex items-center justify-center mr-3">
                                <span className="text-xs font-bold">{user.department?.[0]?.toUpperCase()}</span>
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
                              {user.department.replace(/_/g, ' ')}
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
                            {format(new Date(user.created_at), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            {user.last_sign_in_at ? 
                              format(new Date(user.last_sign_in_at), 'MMM d, yyyy') :
                              'Never'
                            }
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
    </DashboardLayout>
  );
};

export default UserManagement;
