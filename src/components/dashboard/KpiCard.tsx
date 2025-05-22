import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Sparkline } from './Sparkline';

interface KpiCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend: string;
  trendUp: boolean;
  sparkline: number[];
  index: number;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
  trendUp,
  sparkline,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-300" />
      <div className="relative bg-dark-surface rounded-lg p-6 border border-dark-border hover:border-accent-primary/50 transition-all duration-300 group-hover:shadow-glow">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 rounded-lg bg-dark-card">
            {React.cloneElement(icon as React.ReactElement, {
              className: `h-5 w-5 text-${color}`,
            })}
          </div>
          <div className="flex items-center space-x-1">
            {trendUp ? (
              <TrendingUp className="h-4 w-4 text-accent-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-accent-error" />
            )}
            <span className={`text-sm font-medium ${trendUp ? 'text-accent-success' : 'text-accent-error'}`}>
              {trend}
            </span>
          </div>
        </div>

        <h3 className="text-text-secondary text-sm font-medium mb-1">{title}</h3>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-heading font-bold text-text-primary mb-4"
        >
          {value.toLocaleString()}
        </motion.div>

        <div className="h-12">
          <Sparkline data={sparkline} color={color} />
        </div>
      </div>
    </motion.div>
  );
}; 