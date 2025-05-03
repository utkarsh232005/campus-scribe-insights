
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/user';
import { toast } from '@/components/ui/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Award, 
  School, 
  BookOpen, 
  FilePen, 
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAwards: 0,
    totalFaculty: 0,
    totalReports: 0,
    recentUsers: [],
    pendingReports: 0
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch user count
        const { count: userCount, error: userError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        // Fetch awards count
        const { count: awardCount, error: awardError } = await supabase
          .from('awards')
          .select('*', { count: 'exact', head: true });
        
        // Fetch faculty count
        const { count: facultyCount, error: facultyError } = await supabase
          .from('faculty')
          .select('*', { count: 'exact', head: true });
        
        // Fetch reports count
        const { count: reportCount, error: reportError } = await supabase
          .from('reports')
          .select('*', { count: 'exact', head: true });
        
        // Fetch pending reports count
        const { count: pendingCount, error: pendingError } = await supabase
          .from('reports')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');
        
        // Fetch recent users (limit 5)
        const { data: recentUsers, error: recentError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (userError || awardError || facultyError || reportError || pendingError || recentError) {
          throw new Error('Error fetching dashboard statistics');
        }
        
        setStats({
          totalUsers: userCount || 0,
          totalAwards: awardCount || 0,
          totalFaculty: facultyCount || 0,
          totalReports: reportCount || 0,
          recentUsers: recentUsers || [],
          pendingReports: pendingCount || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard statistics",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { 
      title: "Total Users", 
      value: stats.totalUsers, 
      icon: <Users className="h-5 w-5 text-blue-400" />,
      color: "from-blue-500/20 to-blue-600/5 border-blue-500/30"
    },
    { 
      title: "Faculty Members", 
      value: stats.totalFaculty, 
      icon: <School className="h-5 w-5 text-purple-400" />,
      color: "from-purple-500/20 to-purple-600/5 border-purple-500/30"
    },
    { 
      title: "Total Awards", 
      value: stats.totalAwards, 
      icon: <Award className="h-5 w-5 text-yellow-400" />,
      color: "from-yellow-500/20 to-yellow-600/5 border-yellow-500/30"
    },
    { 
      title: "Total Reports", 
      value: stats.totalReports, 
      icon: <FilePen className="h-5 w-5 text-green-400" />,
      color: "from-green-500/20 to-green-600/5 border-green-500/30"
    },
    { 
      title: "Pending Reports", 
      value: stats.pendingReports, 
      icon: <Activity className="h-5 w-5 text-red-400" />,
      color: "from-red-500/20 to-red-600/5 border-red-500/30"
    }
  ];

  return (
    <DashboardLayout>
      <div className="container p-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400 mb-8">Welcome to the Campus Insights admin panel</p>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <Card key={i} className="bg-gray-800/50 animate-pulse h-24"></Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {statCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`bg-gradient-to-br ${card.color} border border-gray-800/50 shadow-lg`}>
                  <CardContent className="p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-400">{card.title}</p>
                      {card.icon}
                    </div>
                    <div className="flex items-end justify-between">
                      <h3 className="text-2xl font-bold text-white">{card.value}</h3>
                      <span className="text-xs text-gray-500">Total</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-950 border border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-400" />
                Recent Faculty Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-12 bg-gray-800/50 animate-pulse rounded"></div>
                  ))}
                </div>
              ) : stats.recentUsers.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentUsers.map((user: any, index) => (
                    <motion.div 
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-2 rounded-lg bg-gray-900/50 border border-gray-800/30"
                    >
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-900/50 flex items-center justify-center mr-3">
                          <span className="text-xs font-bold text-blue-300">{user.department?.charAt(0)?.toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-200">{user.department?.replace(/_/g, ' ')}</p>
                          <p className="text-xs text-gray-500">Joined {new Date(user.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-gray-500" />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent users found</p>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-950 border border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-green-400" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-lg bg-blue-900/20 border border-blue-800/30 cursor-pointer"
                  onClick={() => window.location.href = '/admin/users'}
                >
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 mr-2 text-blue-400" />
                    <h3 className="font-medium text-gray-200">Manage Users</h3>
                  </div>
                  <p className="text-xs text-gray-500">View, edit and manage faculty users</p>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-lg bg-purple-900/20 border border-purple-800/30 cursor-pointer"
                  onClick={() => window.location.href = '/faculty'}
                >
                  <div className="flex items-center mb-2">
                    <School className="h-5 w-5 mr-2 text-purple-400" />
                    <h3 className="font-medium text-gray-200">Faculty</h3>
                  </div>
                  <p className="text-xs text-gray-500">Manage faculty member profiles</p>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-lg bg-yellow-900/20 border border-yellow-800/30 cursor-pointer"
                  onClick={() => window.location.href = '/awards'}
                >
                  <div className="flex items-center mb-2">
                    <Award className="h-5 w-5 mr-2 text-yellow-400" />
                    <h3 className="font-medium text-gray-200">Awards</h3>
                  </div>
                  <p className="text-xs text-gray-500">Manage awards and recognitions</p>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-lg bg-green-900/20 border border-green-800/30 cursor-pointer"
                  onClick={() => window.location.href = '/reports'}
                >
                  <div className="flex items-center mb-2">
                    <FilePen className="h-5 w-5 mr-2 text-green-400" />
                    <h3 className="font-medium text-gray-200">Reports</h3>
                  </div>
                  <p className="text-xs text-gray-500">Review faculty reports and submissions</p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
