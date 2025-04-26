import React from 'react';
import { Badge } from '@/components/ui/badge';
interface Activity {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
  date: string;
}
interface ActivityListProps {
  title: string;
  activities: Activity[];
}
const ActivityList = ({
  title,
  activities
}: ActivityListProps) => {
  return <div className="rounded-lg shadow p-6 bg-transparent">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-slate-50">{title}</h3>
      </div>
      
      <div className="space-y-4">
        {activities.map(activity => <div key={activity.id} className="flex items-start">
            <div className={`p-2 rounded-full ${activity.iconColor} mr-3 mt-1`}>
              {activity.icon}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-cyan-300">{activity.title}</h4>
              <p className="text-xs text-gray-500">{activity.description}</p>
            </div>
            <Badge variant="outline" className="text-xs bg-sky-400">
              {activity.date}
            </Badge>
          </div>)}
      </div>
    </div>;
};
export default ActivityList;