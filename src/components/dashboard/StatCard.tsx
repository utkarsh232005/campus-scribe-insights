
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg?: string;
}

const StatCard = ({ title, value, icon, iconBg = 'bg-blue-900' }: StatCardProps) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex items-center justify-between border border-gray-700">
      <div>
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <p className="text-2xl font-bold text-gray-100">{value}</p>
      </div>
      <div className={`${iconBg} p-3 rounded-full`}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
