import React from 'react';
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
interface ChartData {
  name: string;
  [key: string]: string | number;
}
interface ReportChartProps {
  title: string;
  type: 'bar' | 'line';
  data: ChartData[];
  dataKeys: {
    key: string;
    color: string;
    name?: string;
  }[];
}
const ReportChart = ({
  title,
  type,
  data,
  dataKeys
}: ReportChartProps) => {
  return <div className="rounded-lg shadow p-6 bg-transparent">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-zinc-50">{title}</h3>
        <div className="flex items-center space-x-2">
          {dataKeys.map((dataKey, index) => <div key={index} className="flex items-center">
              <span className="w-3 h-3 rounded-full mr-1" style={{
            backgroundColor: dataKey.color
          }} />
              <span className="text-xs text-gray-500">{dataKey.name || dataKey.key}</span>
            </div>)}
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'bar' ? <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {dataKeys.map((dataKey, index) => <Bar key={index} dataKey={dataKey.key} fill={dataKey.color} radius={[4, 4, 0, 0]} />)}
            </BarChart> : <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {dataKeys.map((dataKey, index) => <Line key={index} type="monotone" dataKey={dataKey.key} stroke={dataKey.color} strokeWidth={2} dot={{
            r: 4
          }} activeDot={{
            r: 6
          }} />)}
            </LineChart>}
        </ResponsiveContainer>
      </div>
    </div>;
};
export default ReportChart;