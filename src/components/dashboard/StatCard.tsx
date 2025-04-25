
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg?: string;
}

const StatCard = ({ title, value, icon, iconBg = 'bg-blue-100' }: StatCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className={`${iconBg} p-3 rounded-full`}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
