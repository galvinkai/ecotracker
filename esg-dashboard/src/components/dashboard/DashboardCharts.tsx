import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const consumptionData = [
  { name: 'Cotton', quantity: 1850.25, emissions: 2890.3 },
  { name: 'Glass', quantity: 2168.68, emissions: 2057.79 },
  { name: 'Petroleum', quantity: 5500.0, emissions: 12750.5 },
  { name: 'Plastic', quantity: 3800.5, emissions: 8950.25 },
  { name: 'Steel', quantity: 4200.0, emissions: 9850.75 },
  { name: 'Timber', quantity: 2944.14, emissions: 6248.8 },
  { name: 'Wheat', quantity: 2750.8, emissions: 1890.45 },
];

const waterUsageData = [
  { name: 'Cotton', usage: 31250000 },
  { name: 'Glass', usage: 16929505 },
  { name: 'Petroleum', usage: 25890000 },
  { name: 'Plastic', usage: 22450000 },
  { name: 'Steel', usage: 15780000 },
  { name: 'Timber', usage: 19790696 },
  { name: 'Wheat', usage: 28950000 },
];

const wasteData = [
  { name: 'Cotton', waste: 225.8 },
  { name: 'Glass', waste: 786.12 },
  { name: 'Petroleum', waste: 890.45 },
  { name: 'Plastic', waste: 925.6 },
  { name: 'Steel', waste: 645.9 },
  { name: 'Timber', waste: 335.37 },
  { name: 'Wheat', waste: 185.3 },
];

const formatYAxis = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toString();
};

export function DashboardCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Production Overview</CardTitle>
          <CardDescription>Material consumption and carbon emissions correlation</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={consumptionData}>
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" tickFormatter={formatYAxis} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={formatYAxis} />
              <Tooltip />
              <Bar
                dataKey="quantity"
                yAxisId="left"
                fill="#059669" // emerald-600
                name="Quantity (tons)"
              />
              <Bar
                dataKey="emissions"
                yAxisId="right"
                fill="#7c3aed" // violet-600
                name="Emissions (tons CO2)"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Environmental Metrics</CardTitle>
          <CardDescription>Water usage and waste generation by material</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="water" className="space-y-4">
            <TabsList>
              <TabsTrigger value="water">Water Usage</TabsTrigger>
              <TabsTrigger value="waste">Waste Generation</TabsTrigger>
            </TabsList>
            <div className="h-[300px]">
              <TabsContent value="water" className="mt-0 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={waterUsageData}>
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={formatYAxis} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="usage"
                      stroke="#059669" // emerald-600
                      strokeWidth={2}
                      name="Water Usage (liters)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="waste" className="mt-0 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={wasteData}>
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={formatYAxis} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="waste"
                      stroke="#7c3aed" // violet-600
                      strokeWidth={2}
                      name="Waste Generated (tons)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
