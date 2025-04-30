
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/user';
import { toast } from '@/components/ui/use-toast';

const AdminDashboard = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Get users from profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching users:', error);
          toast({
            title: "Error",
            description: "Failed to fetch user data",
            variant: "destructive",
          });
          return;
        }
        
        // Also get admin users to mark them
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('email')
          .eq('is_active', true);
        
        if (adminError) {
          console.error('Error fetching admin users:', adminError);
        }
        
        const adminEmails = adminData ? adminData.map(admin => admin.email) : [];
        
        if (data) {
          // Format the data as UserProfile objects
          const formattedUsers: UserProfile[] = data.map(user => ({
            id: user.id,
            email: `${user.department}@faculty.edu`, // Generate email from department
            department: user.department,
            created_at: user.created_at,
            last_sign_in_at: null,
            isAdmin: adminEmails.includes(`${user.department}@faculty.edu`)
          }));
          
          setUsers(formattedUsers);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-gray-900/80 rounded-lg shadow-xl">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-800 text-gray-300">
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Department</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-gray-700 hover:bg-gray-800/50 transition-colors">
                  <td className="py-3 px-4 text-gray-300">{user.id.slice(0, 8)}...</td>
                  <td className="py-3 px-4 text-gray-300">{user.email}</td>
                  <td className="py-3 px-4 text-gray-300">{user.department}</td>
                  <td className="py-3 px-4 text-gray-300">
                    {user.isAdmin ? (
                      <span className="px-2 py-1 bg-purple-900/50 text-purple-300 rounded-full text-xs">Admin</span>
                    ) : (
                      <span className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded-full text-xs">Faculty</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-300">{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
