import React from 'react';
import { Doughnut } from 'react-chartjs-2';

interface DonutChartProps {
  data: {
    labels: string[];
    values: number[];
  };
  height?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({ data, height = 300 }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: [
          '#3FD07A',
          '#8E44AD',
          '#2ECC71',
          '#E67E22',
          '#E74C3C',
        ],
        borderColor: '#1E1E2C',
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#9A9AA0',
          font: {
            family: 'Inter',
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: '#1E1E2C',
        titleColor: '#E6E6E8',
        bodyColor: '#9A9AA0',
        borderColor: '#3FD07A',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${percentage}%`;
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
      <Doughnut data={chartData} options={options} />
    </div>
  );
}; 