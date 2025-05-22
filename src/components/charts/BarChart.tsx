import React from 'react';
import { Bar } from 'react-chartjs-2';

interface BarChartProps {
  data: {
    labels: string[];
    values: number[];
  };
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({ data, height = 300 }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Value',
        data: data.values,
        backgroundColor: '#818cf8', // indigo-400
        borderColor: '#818cf8', // indigo-400
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: '#6366f1', // indigo-500
        hoverBorderColor: '#6366f1', // indigo-500
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#18181b', // zinc-900
        titleColor: '#f4f4f5', // zinc-100
        bodyColor: '#a1a1aa', // zinc-400
        borderColor: '#3f3f46', // zinc-700
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: any) => `Value: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#a1a1aa', // zinc-400
          font: {
            family: 'Inter',
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(63, 63, 70, 0.1)', // zinc-700 with opacity
        },
        ticks: {
          color: '#a1a1aa', // zinc-400
          font: {
            family: 'Inter',
          },
        },
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as const,
    },
  };

  return (
    <div style={{ height, width: '100%' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}; 