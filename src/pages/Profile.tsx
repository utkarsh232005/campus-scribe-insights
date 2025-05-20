import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { User, Mail, Building2, Shield, Award, BookOpen, GraduationCap, Users2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Profile = () => {
  const { user, isAdmin } = useAuth();
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto space-y-8"
        >
          {/* Profile Header */}
          <Card className={cn(
            "overflow-hidden",
            "bg-gradient-to-br from-gray-800 to-gray-900",
            "border border-gray-700/50 hover:border-gray-600/50",
            "transition-colors duration-300"
          )}>
            <CardHeader className="relative space-y-4">
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className={cn(
                    "p-3 rounded-lg",
                    "bg-gray-700/50 border border-gray-600/50 shadow-none",
                    "transition-all duration-300"
                  )}
                >
                  <User className="w-6 h-6 text-gray-300" />
                </motion.div>
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-white">
                    {user?.user_metadata?.full_name || user?.email || 'Guest User'}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Your personal profile and achievements
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge 
                  className={cn(
                    "px-3 py-1 text-sm font-medium",
                    isAdmin ? 
                      "bg-amber-600/20 text-amber-300 border border-amber-500/30" :
                      "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                  )}
                >
                  {isAdmin ? 'Administrator' : 'Faculty'}
                </Badge>
                <Badge className="bg-gray-700/50 text-gray-300 border border-gray-600/50 px-3 py-1 text-sm font-medium">
                  {user?.user_metadata?.department || 'Department Not Set'}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, title: 'Publications', value: '24', color: 'indigo' },
              { icon: Award, title: 'Awards', value: '12', color: 'amber' },
              { icon: GraduationCap, title: 'Teaching Years', value: '8', color: 'emerald' },
              { icon: Users2, title: 'Students Mentored', value: '120+', color: 'blue' }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className={cn(
                  "group relative isolate overflow-hidden",
                  "bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-800/95",
                  "border border-white/10",
                  `hover:border-${stat.color}-500/30 hover:shadow-[0_0_30px_rgba(var(--${stat.color}-rgb),0.15)]`
                )}>
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500",
                    `from-${stat.color}-500/10 via-${stat.color}-400/10 to-${stat.color}-500/10`
                  )}></div>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative">
                    <CardTitle className="text-base font-medium text-white/80">{stat.title}</CardTitle>
                    <div className={cn(
                      "p-2 rounded-xl",
                      `bg-gradient-to-br from-${stat.color}-500/20 via-${stat.color}-400/20 to-${stat.color}-500/20`,
                      "border border-white/10",
                      "transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
                    )}>
                      <stat.icon className={`h-5 w-5 text-${stat.color}-400`} />
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className={cn(
                      "text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent animate-gradient",
                      `from-${stat.color}-400 via-${stat.color}-300 to-${stat.color}-400`
                    )}>
                      {stat.value}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contact & Details */}
          <Card className={cn(
            "overflow-hidden",
            "bg-gray-900",
            "border border-gray-800 hover:border-blue-500/30",
            "hover:shadow-lg transition-all duration-200"
          )}>
            <CardHeader className="relative">
              <CardTitle className="text-xl font-medium text-white flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  "bg-blue-500/10 border border-blue-500/20",
                  "transition-all duration-200"
                )}>
                  <Mail className="h-5 w-5 text-blue-400" />
                </div>
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Email', value: user?.email, icon: Mail },
                  { label: 'Department', value: user?.user_metadata?.department || 'Not set', icon: Building2 },
                  { label: 'Role', value: isAdmin ? 'Administrator' : 'Faculty', icon: Shield },
                  { label: 'Member Since', value: '2023', icon: User }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className={cn(
                      "p-4 rounded-lg",
                      "bg-gray-800",
                      "border border-gray-700 hover:border-blue-500/20",
                      "transition-all duration-200"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-md",
                        "bg-blue-500/10",
                        "border border-blue-500/20",
                        "transition-all duration-200"
                      )}>
                        <item.icon className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-400">{item.label}</p>
                        <p className="text-base text-white">{item.value}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button 
                  className={cn(
                    "gap-2 bg-blue-600 hover:bg-blue-700",
                    "text-white",
                    "transition-all duration-200"
                  )}
                >
                  <Shield className="w-4 h-4" />
                  <span>Update Profile</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
