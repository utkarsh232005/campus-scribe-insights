import React from 'react';
import { Card } from '@/components/ui/card';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// Define card variants using class-variance-authority
const cardVariants = cva(
  "relative overflow-hidden rounded-xl border p-5 shadow-lg backdrop-blur-sm transition-all duration-300",
  {
    variants: {
      variant: {
        primary: "border-blue-500/30 bg-gradient-to-br from-blue-900/40 to-blue-950/40 hover:bg-gradient-to-br hover:from-blue-900/50 hover:to-blue-950/50",
        purple: "border-purple-500/30 bg-gradient-to-br from-purple-900/40 to-purple-950/40 hover:bg-gradient-to-br hover:from-purple-900/50 hover:to-purple-950/50",
        amber: "border-amber-500/30 bg-gradient-to-br from-amber-900/40 to-amber-950/40 hover:bg-gradient-to-br hover:from-amber-900/50 hover:to-amber-950/50",
        emerald: "border-emerald-500/30 bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 hover:bg-gradient-to-br hover:from-emerald-900/50 hover:to-emerald-950/50",
        rose: "border-rose-500/30 bg-gradient-to-br from-rose-900/40 to-rose-950/40 hover:bg-gradient-to-br hover:from-rose-900/50 hover:to-rose-950/50",
      },
      size: {
        default: "h-auto",
        lg: "h-44",
      },
      hover: {
        default: "hover:shadow-lg hover:-translate-y-1",
        intense: "hover:shadow-xl hover:-translate-y-2",
        glow: "hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1",
        pulse: "hover:shadow-xl hover:scale-[1.02]",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      hover: "default"
    }
  }
);

// Define icon variants
const iconVariants = cva(
  "absolute -top-3 -right-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br shadow-lg",
  {
    variants: {
      variant: {
        primary: "from-blue-500 to-blue-600 shadow-blue-500/20",
        purple: "from-purple-500 to-purple-600 shadow-purple-500/20",
        amber: "from-amber-400 to-amber-500 shadow-amber-400/20",
        emerald: "from-emerald-500 to-emerald-600 shadow-emerald-500/20",
        rose: "from-rose-500 to-rose-600 shadow-rose-500/20",
      }
    },
    defaultVariants: {
      variant: "primary"
    }
  }
);

// Define badge variants
const badgeVariants = cva(
  "inline-flex items-center rounded px-2 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        primary: "bg-blue-900/60 text-blue-200",
        purple: "bg-purple-900/60 text-purple-200",
        amber: "bg-amber-900/60 text-amber-200",
        emerald: "bg-emerald-900/60 text-emerald-200",
        rose: "bg-rose-900/60 text-rose-200",
      },
      trend: {
        up: "bg-emerald-900/60 text-emerald-200",
        down: "bg-rose-900/60 text-rose-200",
        neutral: "",
      }
    },
    defaultVariants: {
      variant: "primary",
      trend: "neutral"
    }
  }
);

interface StatisticCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string | number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  variant?: 'primary' | 'purple' | 'amber' | 'emerald' | 'rose';
  hover?: 'default' | 'intense' | 'glow' | 'pulse';
  size?: 'default' | 'lg';
  onClick?: () => void;
  className?: string;
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  icon,
  trend,
  variant = 'primary',
  hover = 'default',
  size = 'default',
  onClick,
  className,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        cardVariants({ variant, hover, size }),
        "group cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {/* Background blur with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-gray-950/80 backdrop-blur-sm" />
      
      {/* Glowing corner accent */}
      <div className={cn(
        "absolute bottom-0 right-0 h-16 w-16 rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        variant === 'primary' ? 'bg-blue-500/10' :
        variant === 'purple' ? 'bg-purple-500/10' :
        variant === 'amber' ? 'bg-amber-500/10' :
        variant === 'emerald' ? 'bg-emerald-500/10' :
        'bg-rose-500/10'
      )} />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-medium text-gray-400">{title}</h3>
          <div className={cn(
            iconVariants({ variant }),
            "group-hover:-rotate-12 transform transition-transform duration-300 opacity-90 group-hover:opacity-100 scale-75",
          )}>
            {icon}
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-3xl font-semibold text-white">{value}</div>
          
          {trend && (
            <div className="flex items-center mt-2">
              <span className={badgeVariants({ variant, trend: trend.direction })}>
                {trend.direction === 'up' && (
                  <svg className="mr-1 h-3 w-3" viewBox="0 0 24 24" fill="none">
                    <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {trend.direction === 'down' && (
                  <svg className="mr-1 h-3 w-3" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {trend.value}
              </span>
              {trend.label && (
                <span className="ml-2 text-xs text-gray-400">{trend.label}</span>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Animated border glow effect */}
      <div className={cn(
        "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ring-1",
        variant === 'primary' ? 'ring-blue-500/30' :
        variant === 'purple' ? 'ring-purple-500/30' :
        variant === 'amber' ? 'ring-amber-500/30' :
        variant === 'emerald' ? 'ring-emerald-500/30' :
        'ring-rose-500/30'
      )} />
    </motion.div>
  );
};

export default StatisticCard;
