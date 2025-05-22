import React from 'react';
import { motion } from 'framer-motion';

interface SparklineProps {
  data: number[];
  color: string;
}

export const Sparkline: React.FC<SparklineProps> = ({ data, color }) => {
  const width = 100;
  const height = 40;
  const padding = 4;

  // Calculate the path
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - ((value - min) / range) * (height - padding * 2) - padding;
    return `${x},${y}`;
  });

  const path = `M ${points.join(' L ')}`;

  return (
    <svg
      width={width}
      height={height}
      className="w-full h-full"
      viewBox={`0 0 ${width} ${height}`}
    >
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={`var(--${color})`} stopOpacity="0.2" />
          <stop offset="100%" stopColor={`var(--${color})`} stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Area fill */}
      <motion.path
        d={`${path} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`}
        fill={`url(#gradient-${color})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Line */}
      <motion.path
        d={path}
        fill="none"
        stroke={`var(--${color})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
    </svg>
  );
}; 