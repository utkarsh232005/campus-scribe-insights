import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { 
  Loader2, 
  Search, 
  RefreshCw, 
  Filter, 
  Users, 
  CheckCircle2, 
  XCircle,
  Clock,
  UserCog,
  UserPlus
} from 'lucide-react';
import { format } from 'date-fns';

interface SupabaseProfile {
  id: string;
  department: string;
  created_at: string;
  email: string | null;
  status: 'active' | 'inactive' | null;
  last_sign_in_at?: string;
  isAdmin?: boolean;
}

interface DatabaseProfile {
  id: string;
  department: string;
  created_at: string;
  email: string;
  status: 'active' | 'inactive';
  last_sign_in_at?: string;
  isAdmin?: boolean;
}

const UserManagement = () => {
  const [users, setUsers] = useState<DatabaseProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*') as { data: SupabaseProfile[] | null; error: Error | null };

      if (error) throw error;

      if (data) {
        setUsers(data.map(profile => ({
          id: profile.id,
          department: profile.department || 'Unknown',
          created_at: profile.created_at,
          email: profile.email || '',
          status: profile.status || 'active',
          last_sign_in_at: profile.last_sign_in_at,
          isAdmin: profile.isAdmin || false
        })));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRefresh = () => {
    setSearchQuery('');
    fetchUsers();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-white">
              User Management
            </h1>
            <p className="text-gray-400">Manage faculty members and their permissions</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleRefresh}
              className="bg-gray-800 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-md transition-all duration-200 border border-gray-700 hover:border-gray-600">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5">
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        <Card className="bg-gray-900 border border-gray-800 shadow-lg rounded-lg overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-bold text-white">
              <Users className="mr-3 h-6 w-6 text-blue-400" />
              <span className="text-white font-semibold">
                Faculty Users
              </span>
              <Badge className="ml-3 bg-indigo-600 px-3 py-1 text-white font-medium text-sm rounded-lg border border-indigo-400/20">
                {filteredUsers.length} Members
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Search and Filter Section */}
            <div className="flex flex-col gap-6 mb-8 animate-in slide-in-from-top-4 duration-700">
              <div className="flex flex-col md:flex-row justify-between items-stretch gap-4">
                <div className="relative flex-1 max-w-2xl group">
                  <div className="p-2 rounded-md bg-blue-500/10 border border-blue-500/20 mr-3">
                    <Users className="h-5 w-5 text-blue-400" />
                  </div>
                  Faculty Users
                  <div className="relative flex items-center bg-gray-800/80 rounded-xl overflow-hidden border border-gray-700/50 backdrop-blur-sm">
                    <Search className="absolute left-4 h-5 w-5 text-indigo-400/70 group-hover:text-indigo-300 transition-colors duration-300" />
                    <Input
                      type="text"
                      placeholder="Search by name, email, or department..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={cn(
                        "w-full pl-12 pr-4 py-6 bg-transparent",
                        "border-0 focus-visible:ring-2 focus-visible:ring-indigo-500/30",
                        "text-base text-white/90 placeholder:text-gray-400/50",
                        "transition-all duration-200 rounded-lg"
                      )}
                    />
                  </div>
                </div>
                <div className="flex items-stretch gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
                    onClick={handleRefresh}
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-1" />
                    Reset
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-3.5 w-3.5 mr-1" />
                    Filter
                  </Button>
                </div>
              </div>
              {showFilters && (
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search by email or department..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn(
                      "bg-gray-800 border-gray-700",
                      "focus:border-blue-500/50 focus:ring-0",
                      "text-white placeholder:text-gray-500",
                      "transition-all duration-200 rounded-md pl-9"
                    )}
                  />
                  <Input
                    type="text"
                    placeholder="Filter by status..."
                    className={cn(
                      "bg-gray-800 border-gray-700",
                      "focus:border-blue-500/50 focus:ring-0",
                      "text-white placeholder:text-gray-500",
                      "transition-all duration-200 rounded-md"
                    )}
                  />
                  <Input
                    type="date"
                    placeholder="Filter by date..."
                    className={cn(
                      "bg-gray-800/60 border-gray-700",
                      "focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/50",
                      "text-white/90 placeholder:text-gray-400/50",
                      "transition-all duration-200 rounded-lg"
                    )}
                  />
                </div>
              )}
            </div>

            <ScrollArea className="rounded-md border border-gray-800 bg-gray-900">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="py-3 text-gray-400 font-medium text-sm">User</TableHead>
                    <TableHead className="py-3 text-gray-400 font-medium text-sm">Department</TableHead>
                    <TableHead className="py-3 text-gray-400 font-medium text-sm">Status</TableHead>
                    <TableHead className="py-3 text-gray-400 font-medium text-sm">Created</TableHead>
                    <TableHead className="py-3 text-gray-400 font-medium text-sm">Last Login</TableHead>
                    <TableHead className="py-3 text-gray-400 font-medium text-sm">Role</TableHead>
                    <TableHead className="py-3 text-gray-400 font-medium text-sm text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <TableRow 
                        key={user.id} 
                        className="opacity-0 animate-in fade-in-0 slide-in-from-bottom-3 duration-500 hover:bg-gray-800 transition-all border-b border-gray-800"
                        style={{ '--delay': `${index * 50}ms` } as React.CSSProperties}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 ring-1 ring-gray-700 bg-blue-600">
                              <AvatarFallback className="text-sm font-medium text-white bg-blue-600">
                                {user.department[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm text-white">{user.email}</div>
                              <div className="text-xs text-gray-400">{user.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className="bg-gray-800 text-blue-300 border border-blue-500/20 px-2 py-0.5 text-xs font-medium"
                          >
                            {user.department}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={user.status === 'active' 
                              ? 'bg-green-500/10 text-green-400 border border-green-500/30 px-2 py-0.5 text-xs font-medium'
                              : 'bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-0.5 text-xs font-medium'
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-400 text-sm">
                          {format(new Date(user.created_at), 'MMM d, yyyy')}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-400 text-sm">
                          {user.last_sign_in_at ? format(new Date(user.last_sign_in_at), 'MMM d, yyyy') : 'Never'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={user.isAdmin 
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 text-xs font-medium'
                              : 'bg-gray-800 text-gray-400 border border-gray-700 px-2 py-0.5 text-xs font-medium'
                            }
                          >
                            {user.isAdmin ? 'Admin' : 'User'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="bg-gray-800 border border-gray-700 hover:bg-gray-700 hover:border-blue-500/30 text-gray-400 hover:text-white transition-all duration-200"
                            >
                              <UserCog className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No users found matching your criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;
