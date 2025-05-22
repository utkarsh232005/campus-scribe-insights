import React from 'react';
import { 
  BarChart, 
  LineChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBarChart,
  RadialBar,
  Treemap
} from 'recharts';

interface ChartData {
  name: string;
  [key: string]: string | number;
}

interface ReportChartProps {
  title: string;
  type: 'bar' | 'line' | 'area' | 'pie' | 'radar' | 'radialBar' | 'treemap';
  data: ChartData[];
  dataKeys: {
    key: string;
    color: string;
    name?: string;
  }[];
  height?: number;
  hideLegend?: boolean;
  stacked?: boolean;
  gradient?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 shadow-lg p-3 rounded-lg text-xs">
        <p className="text-gray-300 mb-2 font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`tooltip-${index}`} className="flex items-center">
            <div
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-400 mr-2">{entry.name}:</span>
            <span className="text-white font-medium">
              {typeof entry.value === 'number' 
                ? entry.value.toLocaleString()
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ReportChart = ({
  title,
  type,
  data,
  dataKeys,
  height = 300,
  hideLegend = false,
  stacked = false,
  gradient = false
}: ReportChartProps) => {
  // Generate unique IDs for gradients
  const gradientIds = dataKeys.map((_, index) => `colorGradient-${index}`);

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart 
            data={data}
            barCategoryGap={8}
            barGap={4}
            className="[&_.recharts-cartesian-grid-horizontal_line]:stroke-gray-800 [&_.recharts-cartesian-grid-vertical_line]:stroke-gray-800"
          >
            <defs>
              {gradient && dataKeys.map((dataKey, index) => (
                <linearGradient key={index} id={gradientIds[index]} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={dataKey.color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={dataKey.color} stopOpacity={0.2}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2D3748" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#A0AEC0' }}
              axisLine={{ stroke: '#2D3748' }}
              tickLine={{ stroke: '#2D3748' }}
            />
            <YAxis 
              tick={{ fill: '#A0AEC0' }}
              axisLine={{ stroke: '#2D3748' }}
              tickLine={{ stroke: '#2D3748' }}
            />
            <Tooltip content={<CustomTooltip />} />
            {!hideLegend && (
              <Legend 
                wrapperStyle={{ paddingTop: 16 }}
                formatter={(value) => <span className="text-xs text-gray-400">{value}</span>}
              />
            )}
            {dataKeys.map((dataKey, index) => (
              <Bar 
                key={index} 
                dataKey={dataKey.key} 
                name={dataKey.name || dataKey.key}
                fill={gradient ? `url(#${gradientIds[index]})` : dataKey.color} 
                radius={[4, 4, 0, 0]} 
                stackId={stacked ? "stack" : undefined}
                animationDuration={1500}
              />
            ))}
          </BarChart>
        );
        
      case 'line':
        return (
          <LineChart 
            data={data}
            className="[&_.recharts-cartesian-grid-horizontal_line]:stroke-gray-800 [&_.recharts-cartesian-grid-vertical_line]:stroke-gray-800"
          >
            <defs>
              {gradient && dataKeys.map((dataKey, index) => (
                <linearGradient key={index} id={gradientIds[index]} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={dataKey.color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={dataKey.color} stopOpacity={0.1}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2D3748" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#A0AEC0' }}
              axisLine={{ stroke: '#2D3748' }}
              tickLine={{ stroke: '#2D3748' }}
            />
            <YAxis 
              tick={{ fill: '#A0AEC0' }}
              axisLine={{ stroke: '#2D3748' }}
              tickLine={{ stroke: '#2D3748' }}
            />
            <Tooltip content={<CustomTooltip />} />
            {!hideLegend && (
              <Legend 
                wrapperStyle={{ paddingTop: 16 }}
                formatter={(value) => <span className="text-xs text-gray-400">{value}</span>}
              />
            )}
            {dataKeys.map((dataKey, index) => (
              <Line 
                key={index} 
                type="monotone" 
                dataKey={dataKey.key} 
                name={dataKey.name || dataKey.key}
                stroke={dataKey.color} 
                strokeWidth={2.5} 
                dot={{
                  r: 4,
                  stroke: dataKey.color,
                  strokeWidth: 2,
                  fill: '#1A202C'
                }} 
                activeDot={{
                  r: 6,
                  stroke: dataKey.color,
                  strokeWidth: 2,
                  fill: '#1A202C'
                }}
                animationDuration={1500}
              />
            ))}
          </LineChart>
        );
        
      case 'area':
        return (
          <AreaChart 
            data={data}
            className="[&_.recharts-cartesian-grid-horizontal_line]:stroke-gray-800 [&_.recharts-cartesian-grid-vertical_line]:stroke-gray-800"
          >
            <defs>
              {dataKeys.map((dataKey, index) => (
                <linearGradient key={index} id={gradientIds[index]} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={dataKey.color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={dataKey.color} stopOpacity={0.1}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2D3748" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#A0AEC0' }}
              axisLine={{ stroke: '#2D3748' }}
              tickLine={{ stroke: '#2D3748' }}
            />
            <YAxis 
              tick={{ fill: '#A0AEC0' }}
              axisLine={{ stroke: '#2D3748' }}
              tickLine={{ stroke: '#2D3748' }}
            />
            <Tooltip content={<CustomTooltip />} />
            {!hideLegend && (
              <Legend 
                wrapperStyle={{ paddingTop: 16 }}
                formatter={(value) => <span className="text-xs text-gray-400">{value}</span>}
              />
            )}
            {dataKeys.map((dataKey, index) => (
              <Area 
                key={index} 
                type="monotone" 
                dataKey={dataKey.key} 
                name={dataKey.name || dataKey.key}
                stroke={dataKey.color} 
                strokeWidth={2} 
                fill={`url(#${gradientIds[index]})`}
                stackId={stacked ? "stack" : undefined}
                animationDuration={1500}
              />
            ))}
          </AreaChart>
        );

      case 'pie':
        const RADIAN = Math.PI / 180;
        const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
        
        // Calculate responsive chart dimensions based on container height
        const calculateChartDimensions = () => {
          // Calculate dimensions in percentage of height to ensure it stays within container
          const containerHeight = height;
          // For pie chart, use 70% of available height as a max to prevent overflow
          const chartHeight = Math.min(containerHeight * 0.7, 200);
          
          return {
            outerRadius: Math.floor(chartHeight * 0.4),  // 40% of chart height
            innerRadius: Math.floor(chartHeight * 0.2),  // 20% of chart height
            labelOffset: Math.floor(chartHeight * 0.08)   // 8% of chart height for label offset
          };
        };
        
        const { outerRadius, innerRadius, labelOffset } = calculateChartDimensions();
        
        const renderCustomizedLabel = ({ 
          cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, active 
        }: any) => {
          // Only render percentage label if it's significant (greater than 2%)
          if (percent < 0.02) return null;
          
          const radius = innerRadius + (outerRadius - innerRadius) * 0.65;
          const x = cx + radius * Math.cos(-midAngle * RADIAN);
          const y = cy + radius * Math.sin(-midAngle * RADIAN);
          const isActive = index === activeIndex;

          return (
            <text 
              x={x} 
              y={y} 
              fill="white"
              textAnchor="middle" 
              dominantBaseline="central"
              fontSize={isActive ? 12 : 10} // Reduced font size
              fontWeight={isActive ? 700 : 600}
              opacity={isActive ? 1 : 0.9}
              style={{
                filter: isActive ? 'drop-shadow(0px 0px 4px rgba(255, 255, 255, 0.6))' : 'none',
                transition: 'all 0.3s ease',
                pointerEvents: 'none'
              }}
            >
              {`${(percent * 100).toFixed(0)}%`}
            </text>
          );
        };

        const onPieEnter = (_: any, index: number) => {
          setActiveIndex(index);
        };

        const onPieLeave = () => {
          setActiveIndex(null);
        };
        
        return (
          <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <defs>
              {data.map((entry, index) => {
                const color = dataKeys[index % dataKeys.length]?.color;
                return (
                  <radialGradient 
                    key={`rgrad-${index}`} 
                    id={`radialGradient-${index}`} 
                    cx="50%" 
                    cy="50%" 
                    r="50%" 
                    fx="50%" 
                    fy="50%"
                  >
                    <stop
                      offset="0%"
                      stopColor={color}
                      stopOpacity={0.95}
                    />
                    <stop
                      offset="80%"
                      stopColor={color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="100%"
                      stopColor={color}
                      stopOpacity={0.7}
                    />
                  </radialGradient>
                );
              })}
              {data.map((entry, index) => {
                const color = dataKeys[index % dataKeys.length]?.color;
                return (
                  <filter key={`shadow-${index}`} id={`shadow-${index}`} x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor={color} floodOpacity="0.4" />
                  </filter>
                );
              })}
            </defs>
            <Pie
              data={data}
              cx="50%"
              cy="47%" // Move up slightly to make room for legend
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={outerRadius} // Responsive radius
              innerRadius={innerRadius} // Responsive inner radius
              paddingAngle={3}
              dataKey={dataKeys[0].key}
              nameKey="name"
              animationDuration={1500}
              animationBegin={200}
              animationEasing="ease-out"
              isAnimationActive={true}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              activeShape={(props) => {
                const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value, midAngle, percent } = props;
                const sin = Math.sin(-RADIAN * midAngle);
                const cos = Math.cos(-RADIAN * midAngle);
                
                // Calculate points within bounds to prevent overflow
                // Constrain the extension of lines and labels within the chart area
                const maxExtension = outerRadius * 0.25; // limit extension to 25% of outer radius
                const mx = cx + (outerRadius + maxExtension) * cos;
                const my = cy + (outerRadius + maxExtension) * sin;
                
                // Ensure hover content stays within chart bounds
                const textOffsetX = (cos >= 0 ? 1 : -1) * 8; // Reduced offset
                const ex = mx + textOffsetX;
                const ey = my;
                
                return (
                  <g>
                    <path 
                      d={`M${cx},${cy}L${mx},${my}`} 
                      stroke={fill} 
                      fill="none"
                      opacity={0.7}
                      strokeWidth={1.5} 
                      strokeDasharray="2 2"
                    />
                    <circle 
                      cx={ex} 
                      cy={ey} 
                      r={4} // Smaller circle
                      fill={fill} 
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth={1}
                      filter={`drop-shadow(0px 0px 2px ${fill})`}
                    />
                    <text 
                      x={ex + textOffsetX} 
                      y={ey - 8} // Reduced text offset
                      textAnchor={cos >= 0 ? 'start' : 'end'} 
                      fontSize={11} // Smaller font size 
                      fill="#fff"
                      fontWeight={600}
                      dominantBaseline="central"
                      filter="drop-shadow(0px 0px 1px rgba(0,0,0,0.5))"
                    >
                      {payload.name}
                    </text>
                    <text 
                      x={ex + textOffsetX} 
                      y={ey + 8} // Reduced text offset
                      textAnchor={cos >= 0 ? 'start' : 'end'} 
                      fontSize={11} // Smaller font size
                      fill="#fff"
                      fontWeight={700}
                      dominantBaseline="central"
                      filter="drop-shadow(0px 0px 1px rgba(0,0,0,0.5))"
                    >
                      {`${value} (${(percent * 100).toFixed(0)}%)`}
                    </text>
                  </g>
                );
              }}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#radialGradient-${index})`}
                  strokeWidth={index === activeIndex ? 1.5 : 1}
                  stroke={index === activeIndex ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.1)'}
                  style={{
                    filter: index === activeIndex ? `url(#shadow-${index})` : 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease-out, filter 0.3s ease-out',
                    // Reduce scaling to prevent overflow
                    transform: index === activeIndex ? 'scale(1.03) translateY(-2px)' : 'scale(1)',
                  }}
                />
              ))}
            </Pie>
            <Tooltip 
              content={<CustomTooltip />} 
              wrapperStyle={{
                border: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                backgroundColor: 'rgba(23, 25, 35, 0.85)',
                backdropFilter: 'blur(8px)',
                borderRadius: '8px',
                padding: '6px',
                transition: 'all 0.3s ease',
                fontSize: '11px'
              }}
            />
            <Legend 
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: 16, fontSize: '10px' }}
              formatter={(value) => <span className="text-xs text-gray-300 font-medium">{value}</span>}
              iconSize={8}
              iconType="circle"
            />
          </PieChart>
        );

      case 'radar':
        return (
          <RadarChart cx="50%" cy="50%" outerRadius={110} data={data}>
            <PolarGrid stroke="#2D3748" />
            <PolarAngleAxis dataKey="name" tick={{ fill: '#A0AEC0' }} />
            <PolarRadiusAxis tick={{ fill: '#A0AEC0' }} />
            {dataKeys.map((dataKey, index) => (
              <Radar 
                key={index} 
                name={dataKey.name || dataKey.key} 
                dataKey={dataKey.key} 
                stroke={dataKey.color} 
                fill={dataKey.color} 
                fillOpacity={0.2}
                animationDuration={1500}
              />
            ))}
            <Tooltip content={<CustomTooltip />} />
            {!hideLegend && (
              <Legend 
                wrapperStyle={{ paddingTop: 16 }}
                formatter={(value) => <span className="text-xs text-gray-400">{value}</span>}
              />
            )}
          </RadarChart>
        );

      case 'radialBar':
        return (
          <RadialBarChart 
            cx="50%" 
            cy="50%" 
            innerRadius={20} 
            outerRadius={140} 
            barSize={20} 
            data={data}
            startAngle={90} 
            endAngle={-270}
          >
            <RadialBar
              label={{ 
                fill: '#A0AEC0', 
                position: 'insideStart',
                fontSize: 12
              }}
              background={{ fill: '#2D3748' }}
              dataKey={dataKeys[0].key}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={dataKeys[index % dataKeys.length]?.color || '#1A202C'} 
                />
              ))}
            </RadialBar>
            <Tooltip content={<CustomTooltip />} />
            {!hideLegend && (
              <Legend 
                wrapperStyle={{ paddingTop: 16 }}
                formatter={(value, entry: any) => {
                  return <span className="text-xs text-gray-400">{entry.payload.name}</span>;
                }}
                iconSize={10}
              />
            )}
          </RadialBarChart>
        );

      case 'treemap':
        return (
          <Treemap
            data={data}
            dataKey={dataKeys[0].key}
            aspectRatio={4 / 3}
            stroke="#2D3748"
            fill="#4299E1"
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={dataKeys[index % dataKeys.length]?.color || '#1A202C'} 
              />
            ))}
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        );

      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg shadow p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-gray-700 transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-zinc-50">{title}</h3>
        <div className="flex flex-wrap items-center gap-3">
          {!hideLegend && type !== 'pie' && dataKeys.map((dataKey, index) => (
            <div key={index} className="flex items-center">
              <span 
                className="w-3 h-3 rounded-full mr-1" 
                style={{ backgroundColor: dataKey.color }} 
              />
              <span className="text-xs text-gray-400">{dataKey.name || dataKey.key}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ height: `${height}px` }} className="mt-2">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReportChart;