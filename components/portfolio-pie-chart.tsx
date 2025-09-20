'use client';

import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Cell,
  Legend,
} from 'recharts';

type PortfolioPieChartProps = {
  data: {
    stock: string;
    allocation: number;
  }[];
};

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export default function PortfolioPieChart({ data }: PortfolioPieChartProps) {
  const chartData = data.map((item) => ({
    name: item.stock,
    value: item.allocation,
  }));

  return (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <PieChart>
          <Tooltip
            contentStyle={{
              background: 'hsl(var(--card))',
              borderColor: 'hsl(var(--border))',
              borderRadius: 'var(--radius)',
            }}
            formatter={(value: number) => [`${value.toFixed(2)}%`, 'Allocation']}
          />
          <Legend
            verticalAlign="middle"
            align="right"
            layout="vertical"
            iconSize={10}
            wrapperStyle={{
              paddingLeft: '20px'
            }}
          />
          <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
