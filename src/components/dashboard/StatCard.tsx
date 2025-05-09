
import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg?: string;
}

const StatCard = ({ title, value, icon, iconBg = 'bg-gray-800' }: StatCardProps) => {
  return (
    <motion.div 
      className="bg-gray-900 rounded-lg shadow-lg p-6 flex items-center justify-between border border-gray-800"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
    >
      <div>
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
      <div className={`${iconBg} p-3 rounded-full`}>
        {icon}
      </div>
    </motion.div>
  );
};

export default StatCard;
