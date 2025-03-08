
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ErrorBar } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Import data and utilities
import { latencyByTimeData, latencyByAppData } from "./performanceData";
import { extendedChartConfig } from "./chartConfig";

export function PerformanceHeatmapTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Latency by Time of Day</CardTitle>
          <CardDescription>Average response time (ms) across different hours and days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full overflow-x-auto">
            <div className="min-w-[800px]">
              <ChartContainer config={extendedChartConfig} className="h-full w-full">
                <BarChart
                  data={latencyByTimeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="monday" fill="var(--color-monday)" stackId="a" />
                  <Bar dataKey="tuesday" fill="var(--color-tuesday)" stackId="a" />
                  <Bar dataKey="wednesday" fill="var(--color-wednesday)" stackId="a" />
                  <Bar dataKey="thursday" fill="var(--color-thursday)" stackId="a" />
                  <Bar dataKey="friday" fill="var(--color-friday)" stackId="a" />
                  <Bar dataKey="saturday" fill="var(--color-saturday)" stackId="a" />
                  <Bar dataKey="sunday" fill="var(--color-sunday)" stackId="a" />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>Higher bars indicate longer response times. You can see patterns across different days of the week.</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Latency by Application</CardTitle>
          <CardDescription>Distribution of response times across different applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ChartContainer config={extendedChartConfig} className="h-full w-full">
              <BarChart
                layout="vertical"
                data={latencyByAppData}
                margin={{ top: 20, right: 30, left: 90, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <ChartTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-4 border border-gray-200 rounded shadow-md">
                          <p className="font-semibold">{data.name}</p>
                          <p className="text-sm">Min: {data.min}ms</p>
                          <p className="text-sm">Q1: {data.q1}ms</p>
                          <p className="text-sm">Median: {data.median}ms</p>
                          <p className="text-sm">Q3: {data.q3}ms</p>
                          <p className="text-sm">Max: {data.max}ms</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="median" fill="#8B5CF6">
                  <ErrorBar dataKey="q1" direction="x" stroke="#3B82F6" strokeWidth={2} width={0} />
                  <ErrorBar dataKey="q3" direction="x" stroke="#3B82F6" strokeWidth={2} width={0} />
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>The bars represent median latency values, while the error bars show the 1st and 3rd quartiles of the distribution.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
