import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { serverStatus } from "@/lib/axios";
import { ecoTrackerApi } from "@/services/api";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ChartData {
  month: string;
  footprint: number;
  target: number;
}

export const CarbonChart = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if transactions endpoint returns chart data as well
        const response = await ecoTrackerApi.getTransactions();
        
        if (response && response.chartData) {
          setChartData(response.chartData);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setError("Could not load chart data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 rounded-md shadow-lg border text-sm dark:bg-gray-800 dark:border-gray-700">
          <p className="font-medium dark:text-gray-200">{payload[0].payload.month}</p>
          <p className="text-primary dark:text-green-400">Footprint: {payload[0].value.toFixed(2)} tons</p>
          <p className="text-muted-foreground dark:text-gray-400">Target: {payload[0].payload.target.toFixed(2)} tons</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="dark:text-gray-200">Carbon Footprint Trend</CardTitle>
        {!serverStatus.isOnline && (
          <div className="flex items-center text-xs text-yellow-600 dark:text-yellow-500">
            <AlertCircle className="h-3 w-3 mr-1" />
            Showing offline data
          </div>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-64 w-full flex items-center justify-center">
            <LoadingSpinner size="lg" text="Loading chart data..." />
          </div>
        ) : error ? (
          <div className="h-64 w-full flex items-center justify-center flex-col text-center p-6">
            <AlertCircle className="h-8 w-8 text-destructive mb-2" />
            <p className="text-muted-foreground dark:text-gray-400">{error}</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-64 w-full flex items-center justify-center flex-col text-center p-6">
            <p className="text-muted-foreground dark:text-gray-400">Not enough data to display chart</p>
            <p className="text-xs text-muted-foreground dark:text-gray-500 mt-2">Add transactions to see your carbon footprint trend</p>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="footprintGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                  domain={[0, 'dataMax + 0.5']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="footprint"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#footprintGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="hsl(var(--warning))"
                  fillOpacity={0}
                  strokeDasharray="4 4"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="flex justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="dark:text-gray-300">Your footprint</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 border-2 border-warning border-dashed rounded-full"></div>
            <span className="dark:text-gray-300">Target</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};