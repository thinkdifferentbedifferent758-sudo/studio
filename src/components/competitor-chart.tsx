'use client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type CompetitorChartProps = {
  portfolio: {
    stock: string;
    allocation: number;
    isRisky: boolean;
  }[];
  competitors: {
    ticker: string;
    name: string;
    marketCap: number;
    peRatio: number;
    dividendYield: number;
  }[];
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 border rounded-lg bg-background/80 backdrop-blur-sm shadow-md">
        <p className="font-bold">{label}</p>
        {payload.map((pld: any) => (
          <p key={pld.dataKey} style={{ color: pld.color }}>
            {`${pld.name}: ${
              pld.dataKey === 'marketCap'
                ? `$${pld.value.toFixed(2)}B`
                : pld.dataKey === 'dividendYield'
                ? `${pld.value.toFixed(2)}%`
                : pld.value.toFixed(2)
            }`}
          </p>
        ))}
      </div>
    );
  }

  return null;
};


export default function CompetitorChart({
  competitors,
}: CompetitorChartProps) {
  const chartData = competitors.map((c) => ({
    name: c.ticker,
    marketCap: c.marketCap,
    peRatio: c.peRatio,
    dividendYield: c.dividendYield,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h4 className="text-md font-medium text-center mb-2">Market Capitalization (in Billions USD)</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
            <YAxis stroke="hsl(var(--foreground))" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="marketCap" fill="hsl(var(--chart-1))" name="Market Cap (B)"/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div>
        <h4 className="text-md font-medium text-center mb-2">P/E Ratio</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
            <YAxis stroke="hsl(var(--foreground))" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="peRatio" fill="hsl(var(--chart-2))" name="P/E Ratio"/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h4 className="text-md font-medium text-center mb-2">Dividend Yield (%)</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
            <YAxis stroke="hsl(var(--foreground))" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="dividendYield" fill="hsl(var(--chart-3))" name="Dividend Yield (%)"/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
