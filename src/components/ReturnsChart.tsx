
import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyReturn } from "@/types";

interface ReturnsChartProps {
  dailyReturns: DailyReturn[];
  className?: string;
}

export default function ReturnsChart({ dailyReturns, className }: ReturnsChartProps) {
  // Format data for the chart
  const chartData = useMemo(() => {
    return dailyReturns.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      amount: item.amount,
      percentage: item.percentage
    }));
  }, [dailyReturns]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Daily Returns</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <YAxis 
                yAxisId="left"
                orientation="left" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <YAxis 
                yAxisId="right"
                orientation="right" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === "amount") return [`$${value}`, "Amount"];
                  if (name === "percentage") return [`${value}%`, "Percentage"];
                  return [value, name];
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="amount"
                stroke="hsl(var(--primary))"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="percentage"
                stroke="#FFB224"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
