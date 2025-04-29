
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/user';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Get all users - this endpoint requires admin privileges
        const { data, error } = await supabase.auth.admin.listUsers();
        
        if (error) {
          console.error('Error fetching users:', error);
          return;
        }
        
        if (data) {
          // Map auth users to UserProfile format
          const formattedUsers: UserProfile[] = data.users.map(user => ({
            id: user.id,
            email: user.email || '',
            department: user.user_metadata?.department || 'Not set',
            created_at: user.created_at || '',
            last_sign_in_at: user.last_sign_in_at || null
          }));
          
          setUsers(formattedUsers);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="container mx-auto p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 
        className="text-2xl font-bold mb-4"
        variants={itemVariants}
      >
        Admin Dashboard
      </motion.h1>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <motion.div 
          className="overflow-x-auto bg-gray-900/80 rounded-lg shadow-xl"
          variants={itemVariants}
        >
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-800 text-gray-300">
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Department</th>
                <th className="py-3 px-4 text-left">Created At</th>
                <th className="py-3 px-4 text-left">Last Sign In</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <motion.tr 
                  key={user.id} 
                  className="border-t border-gray-700 hover:bg-gray-800/50 transition-colors"
                  variants={itemVariants}
                  custom={index}
                >
                  <td className="py-3 px-4 text-gray-300">{user.id.slice(0, 8)}...</td>
                  <td className="py-3 px-4 text-gray-300">{user.email}</td>
                  <td className="py-3 px-4 text-gray-300">{user.department}</td>
                  <td className="py-3 px-4 text-gray-300">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-gray-300">
                    {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'N/A'}
                  </td>
                </motion.tr>
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
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminDashboard;
