
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ReportForm from '@/components/dashboard/ReportForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp, Clock, FileCheck, AlertCircle, ChevronRight, Home, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const ReportSubmission = () => {
  return (
    <DashboardLayout>
      {/* Page Header with Gradient */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600/90 via-purple-600/90 to-indigo-700/90 p-8 mb-8 shadow-lg border border-indigo-500/30">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.7))]" />
        <div className="relative z-10">
          <div className="flex items-center text-sm text-indigo-200/90 mb-2">
            <Home className="h-3.5 w-3.5 mr-1" />
            <ChevronRight className="h-3 w-3 mx-1 text-indigo-300/50" />
            <span>Dashboard</span>
            <ChevronRight className="h-3 w-3 mx-1 text-indigo-300/50" />
            <span className="text-indigo-50 font-medium">Submit Report</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Annual Report Submission</h1>
          <p className="text-indigo-200/90 max-w-xl">Document your academic achievements, research output, and scholarly activities for the academic year</p>
        </div>
        <div className="absolute right-8 bottom-8 opacity-20">
          <FileText className="h-24 w-24 text-white" />
        </div>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { 
            title: 'Submitted', 
            value: '12', 
            icon: FileCheck, 
            color: 'emerald',
            description: 'Reports successfully submitted',
            gradientFrom: 'from-emerald-600/20',
            gradientTo: 'to-emerald-500/10',
            textColor: 'text-emerald-400',
            iconColor: 'text-emerald-500'
          },
          { 
            title: 'Pending', 
            value: '3', 
            icon: Clock, 
            color: 'amber',
            description: 'Reports awaiting review',
            gradientFrom: 'from-amber-600/20',
            gradientTo: 'to-amber-500/10',
            textColor: 'text-amber-400',
            iconColor: 'text-amber-500'
          },
          { 
            title: 'Drafts', 
            value: '2', 
            icon: FileUp, 
            color: 'blue',
            description: 'Reports saved as draft',
            gradientFrom: 'from-blue-600/20',
            gradientTo: 'to-blue-500/10',
            textColor: 'text-blue-400',
            iconColor: 'text-blue-500'
          },
          { 
            title: 'Rejected', 
            value: '1', 
            icon: AlertCircle, 
            color: 'rose',
            description: 'Reports needing revision',
            gradientFrom: 'from-rose-600/20',
            gradientTo: 'to-rose-500/10',
            textColor: 'text-rose-400',
            iconColor: 'text-rose-500'
          },
        ].map((stat, index) => (
          <Card 
            key={stat.title}
            className={cn(
              "overflow-hidden border-slate-800/50",
              "bg-gradient-to-br from-slate-900/95 to-slate-800/95", 
              "hover:shadow-md hover:shadow-slate-800/30 transition-all duration-300",
              "group hover:border-slate-700/70"
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-400">{stat.title}</CardTitle>
              <div className={cn(
                "p-2 rounded-full bg-gradient-to-br", 
                stat.gradientFrom, 
                stat.gradientTo,
                "transition-all duration-300 group-hover:scale-110"
              )}>
                <stat.icon className={cn("h-4 w-4", stat.iconColor)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={cn("text-3xl font-bold", stat.textColor)}>{stat.value}</div>
              <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
            </CardContent>
            <div className={cn(
              "h-1 w-full absolute bottom-0 left-0 opacity-40",
              `bg-gradient-to-r ${stat.gradientFrom} ${stat.gradientTo}`
            )} />
          </Card>
        ))}
      </div>
      
      <ReportForm />
    </DashboardLayout>
  );
};

export default ReportSubmission;
