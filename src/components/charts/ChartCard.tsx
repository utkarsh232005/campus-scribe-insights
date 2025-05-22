import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'rounded-xl bg-[#1E1E2C] border border-[#2A2A3C] p-6',
        className
      )}
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#E6E6E8]">{title}</h3>
        {subtitle && (
          <p className="text-sm text-[#9A9AA0] mt-1">{subtitle}</p>
        )}
      </div>
      <div className="relative w-full h-full">
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              ...child.props,
              style: { ...child.props.style, width: '100%' }
            });
          }
          return child;
        })}
      </div>
    </motion.div>
  );
}; 