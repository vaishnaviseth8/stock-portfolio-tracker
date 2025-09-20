import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  shares: number;
  value: number;
}

interface PortfolioChartProps {
  stocks: Stock[];
}

interface ChartDataPoint {
  time: string;
  value: number;
}

export const PortfolioChart = ({ stocks }: PortfolioChartProps) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  // Generate initial historical data
  useEffect(() => {
    const totalValue = stocks.reduce((sum, stock) => sum + stock.value, 0);
    const initialData: ChartDataPoint[] = [];
    
    // Generate 20 data points for the last 20 time periods
    for (let i = 19; i >= 0; i--) {
      const baseValue = totalValue * (0.95 + Math.random() * 0.1); // ±5% variation
      const time = new Date(Date.now() - i * 30000).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });
      
      initialData.push({
        time,
        value: baseValue,
      });
    }
    
    setChartData(initialData);
  }, [stocks]);

  // Update chart data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const currentValue = stocks.reduce((sum, stock) => sum + stock.value, 0);
      const currentTime = new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });

      setChartData(prevData => {
        const newData = [...prevData, { time: currentTime, value: currentValue }];
        // Keep only the last 20 data points
        return newData.slice(-20);
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [stocks]);

  const currentValue = stocks.reduce((sum, stock) => sum + stock.value, 0);
  const initialValue = chartData.length > 0 ? chartData[0].value : currentValue;
  const isPositive = currentValue >= initialValue;

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))'
            }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Portfolio Value']}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={isPositive ? 'hsl(var(--gain))' : 'hsl(var(--loss))'}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: isPositive ? 'hsl(var(--gain))' : 'hsl(var(--loss))' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
