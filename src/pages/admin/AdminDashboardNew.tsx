import * as React from 'react';
import { useState, useEffect } from 'react';
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
  ArrowUpRight,
  TrendingUp,
  Calendar,
  Clock,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ChartGrid } from '@/components/charts/ChartGrid';
import { ChartCard } from '@/components/charts/ChartCard';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { AreaChart } from '@/components/charts/AreaChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { updateMonthlyStats, getMonthlyStats } from '@/lib/stats';
import { Button } from '@/components/ui/button';

const ACCENTS = [
  'from-cyan-500 to-blue-600',
  'from-purple-500 to-fuchsia-600',
  'from-amber-400 to-orange-500',
  'from-emerald-400 to-teal-500',
  'from-rose-500 to-pink-500',
];
const ICON_GLOWS = [
  'shadow-cyan-500/40',
  'shadow-purple-500/40',
  'shadow-amber-400/40',
  'shadow-emerald-400/40',
  'shadow-rose-500/40',
];

const SECTION_ACCENTS = [
  'from-cyan-500 to-blue-600',
  'from-purple-500 to-fuchsia-600',
];

const CARD_GRADIENTS = [
  'bg-gradient-to-br from-cyan-900/80 via-cyan-800/60 to-blue-900/80',
  'bg-gradient-to-br from-purple-900/80 via-fuchsia-800/60 to-purple-900/80',
  'bg-gradient-to-br from-amber-900/80 via-yellow-800/60 to-orange-900/80',
  'bg-gradient-to-br from-emerald-900/80 via-teal-800/60 to-emerald-900/80',
  'bg-gradient-to-br from-rose-900/80 via-pink-800/60 to-rose-900/80',
];
const ICON_BG = [
  'bg-cyan-900/80 ring-cyan-400/60',
  'bg-purple-900/80 ring-purple-400/60',
  'bg-amber-900/80 ring-amber-400/60',
  'bg-emerald-900/80 ring-emerald-400/60',
  'bg-rose-900/80 ring-rose-400/60',
];
const HOVER_GLOWS = [
  'hover:shadow-cyan-500/30',
  'hover:shadow-purple-500/30',
  'hover:shadow-amber-400/30',
  'hover:shadow-emerald-400/30',
  'hover:shadow-rose-500/30',
];

// Add shimmer keyframes for accent bar
const shimmerStyle = `<style>
@keyframes shimmer {
  0% { background-position: -100px 0; }
  100% { background-position: 200px 0; }
}
@keyframes iconGradient {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}
@keyframes bgAurora {
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 100%; }
}
</style>`;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAwards: 0,
    totalFaculty: 0,
    totalReports: 0,
    recentUsers: [],
    pendingReports: 0,
    monthlyStats: {
      users: [],
      reports: [],
      awards: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
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

      // Fetch monthly statistics
      const monthlyStats = await getMonthlyStats();
      
      if (userError || awardError || facultyError || reportError || pendingError || recentError) {
        throw new Error('Error fetching dashboard statistics');
      }
      
      setStats({
        totalUsers: userCount || 0,
        totalAwards: awardCount || 0,
        totalFaculty: facultyCount || 0,
        totalReports: reportCount || 0,
        recentUsers: recentUsers || [],
        pendingReports: pendingCount || 0,
        monthlyStats: {
          users: monthlyStats.map(stat => ({ month: stat.month, value: stat.users })),
          reports: monthlyStats.map(stat => ({ month: stat.month, value: stat.reports })),
          awards: monthlyStats.map(stat => ({ month: stat.month, value: stat.awards }))
        }
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

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await updateMonthlyStats();
      await fetchStats();
      toast({
        title: "Success",
        description: "Dashboard statistics updated successfully",
      });
    } catch (error) {
      console.error('Error refreshing stats:', error);
      toast({
        title: "Error",
        description: "Failed to refresh dashboard statistics",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    { 
      title: "Total Users", 
      value: stats.totalUsers, 
      icon: <Users className="h-7 w-7 text-cyan-400 drop-shadow-lg" />, 
      accent: ACCENTS[0],
      iconGlow: ICON_GLOWS[0],
      trend: "+12%",
      trendColor: "text-cyan-400"
    },
    { 
      title: "Faculty Members", 
      value: stats.totalFaculty, 
      icon: <School className="h-7 w-7 text-purple-400 drop-shadow-lg" />, 
      accent: ACCENTS[1],
      iconGlow: ICON_GLOWS[1],
      trend: "+5%",
      trendColor: "text-purple-400"
    },
    { 
      title: "Total Awards", 
      value: stats.totalAwards, 
      icon: <Award className="h-7 w-7 text-amber-400 drop-shadow-lg" />, 
      accent: ACCENTS[2],
      iconGlow: ICON_GLOWS[2],
      trend: "+8%",
      trendColor: "text-amber-400"
    },
    { 
      title: "Total Reports", 
      value: stats.totalReports, 
      icon: <FilePen className="h-7 w-7 text-emerald-400 drop-shadow-lg" />, 
      accent: ACCENTS[3],
      iconGlow: ICON_GLOWS[3],
      trend: "+15%",
      trendColor: "text-emerald-400"
    },
    { 
      title: "Pending Reports", 
      value: stats.pendingReports, 
      icon: <Activity className="h-7 w-7 text-rose-400 drop-shadow-lg" />, 
      accent: ACCENTS[4],
      iconGlow: ICON_GLOWS[4],
      trend: "-3%",
      trendColor: "text-rose-400"
    }
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen w-full relative overflow-x-hidden" style={{ background: 'radial-gradient(ellipse at 60% 20%, #232347 0%, #0a0a23 100%)', backgroundColor: '#0a0a23' }}>
        <div className="container p-6 relative z-10 animate-fade-in">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-extrabold text-zinc-100 tracking-tight mb-1">Admin Dashboard</h1>
              <p className="text-lg text-zinc-400 font-medium">Welcome to the Campus Insights admin panel</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 bg-zinc-900/60 border-zinc-800 hover:bg-zinc-800/80 text-zinc-200 backdrop-blur-md shadow-md"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
              <div className="flex items-center text-zinc-400">
                <Clock className="h-4 w-4 mr-2" />
                <span className="font-mono text-sm">Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
            {statCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 48, damping: 15, mass: 0.8, delay: index * 0.07 }}
                whileHover={{ scale: 1.055, rotateX: 3, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.22)' }}
                className={`group ${HOVER_GLOWS[index]}`}
                style={{ perspective: 800 }}
              >
                <div className={`relative rounded-2xl overflow-hidden shadow-xl border border-zinc-800/70 ${CARD_GRADIENTS[index]} backdrop-blur-md transition-all duration-300 group-hover:shadow-2xl group-hover:border-opacity-90`}>
                  {/* Animated accent bar with shimmer */}
                  <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${card.accent}`} style={{
                    backgroundImage: `linear-gradient(120deg, var(--tw-gradient-stops)), linear-gradient(90deg, rgba(255,255,255,0.18) 25%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.18) 75%)`,
                    backgroundSize: '100% 100%, 200px 100%',
                    backgroundRepeat: 'no-repeat',
                    animation: 'shimmer 2.5s linear infinite',
                  }} />
                  <div className="flex flex-col h-full p-5 pl-6">
                    <div className="flex items-center justify-between mb-2">
                      {/* Animated icon background */}
                      <span className={`rounded-full p-2 ${ICON_BG[index]} ${card.iconGlow} transition-shadow duration-300 ring-2`} style={{
                        background: 'linear-gradient(120deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.12) 100%)',
                        backgroundSize: '200% 200%',
                        animation: 'iconGradient 8s linear infinite alternate',
                      }}>
                        {card.icon}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded bg-zinc-800/60 text-zinc-400`}>{card.trend}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-300 mb-1 tracking-tight">{card.title}</h3>
                    <div className="flex items-end justify-between mt-auto">
                      <span className="text-3xl font-extrabold text-zinc-100 drop-shadow-lg">{card.value}</span>
                      <span className={`ml-2 text-xs font-bold ${card.trendColor}`}>{card.trend}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-zinc-800/70 bg-zinc-900/80 backdrop-blur-md transition-all duration-300 group">
              <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${SECTION_ACCENTS[0]}`} />
              <div className="flex items-center gap-2 px-6 pt-6 pb-2">
                <Users className="h-6 w-6 text-cyan-400 drop-shadow-lg" />
                <h2 className="text-2xl font-bold text-zinc-100 tracking-tight flex-1">Recent Faculty Users</h2>
              </div>
              <div className="px-6 pb-6">
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-12 bg-zinc-800/50 animate-pulse rounded"></div>
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
                        whileHover={{ scale: 1.03, boxShadow: '0 4px 24px 0 rgba(34,211,238,0.10)' }}
                        className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/70 border border-zinc-800/30 hover:bg-zinc-900/90 transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center ring-2 ring-cyan-400/60 shadow-cyan-400/20 shadow-lg">
                            <span className="text-lg font-bold text-white uppercase">{user.department?.charAt(0) || '?'}</span>
                          </div>
                          <div>
                            <p className="text-base font-semibold text-zinc-100 capitalize">{user.department?.replace(/_/g, ' ') || 'Unknown'}</p>
                            <p className="text-xs text-zinc-400 font-mono">{user.email || 'unknown'}</p>
                          </div>
                        </div>
                        <div className="text-xs text-zinc-400 font-mono">
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-400 text-center py-4">No recent users found</p>
                )}
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-zinc-800/70 bg-zinc-900/80 backdrop-blur-md transition-all duration-300 group">
              <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${SECTION_ACCENTS[1]}`} />
              <div className="flex items-center gap-2 px-6 pt-6 pb-2">
                <Calendar className="h-6 w-6 text-purple-400 drop-shadow-lg" />
                <h2 className="text-2xl font-bold text-zinc-100 tracking-tight flex-1">Monthly Overview</h2>
              </div>
              <div className="px-6 pb-6">
                <ChartCard title="User Growth" subtitle="Last 12 months" className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/90 border border-zinc-800/60 shadow-lg">
                  <LineChart 
                    data={{
                      labels: stats.monthlyStats.users.map(stat => stat.month),
                      values: stats.monthlyStats.users.map(stat => stat.value)
                    }}
                    height={200}
                  />
                </ChartCard>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ChartCard title="Report Distribution" subtitle="By Department">
              <DonutChart 
                data={{
                  labels: ['Computer Science', 'Engineering', 'Business', 'Arts', 'Science'],
                  values: [30, 25, 20, 15, 10]
                }}
                height={300}
              />
            </ChartCard>

            <ChartCard title="Award Trends" subtitle="Monthly comparison">
              <BarChart 
                data={{
                  labels: stats.monthlyStats.awards.map(stat => stat.month),
                  values: stats.monthlyStats.awards.map(stat => stat.value)
                }}
                height={300}
              />
            </ChartCard>

            <ChartCard title="Report Activity" subtitle="Daily submissions">
              <AreaChart 
                data={{
                  labels: stats.monthlyStats.reports.map(stat => stat.month),
                  values: stats.monthlyStats.reports.map(stat => stat.value)
                }}
                height={300}
              />
            </ChartCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard; 