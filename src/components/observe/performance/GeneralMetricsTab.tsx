
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
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
  ComposedChart,
  Scatter,
  BoxPlot
} from "recharts";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { chartConfig, providerChartConfig } from "./chartConfig";
import { 
  latencyData, 
  tokenUsageData, 
  tokenUsagePerAppData, 
  tokenUsageMonthlyData, 
  latencyVsTokensData,
  outlierData,
  providerLatencyData,
  latencyDistributionData
} from "./performanceData";
import { renderProviderBar } from "./chartRenderers";

interface GeneralMetricsTabProps {
  onConversationSelect?: (conversationId: string) => void;
}

export function GeneralMetricsTab({ onConversationSelect }: GeneralMetricsTabProps) {
  const handleOutlierClick = (data: any) => {
    if (onConversationSelect && data && data.id) {
      onConversationSelect(data.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Latency Trends</CardTitle>
            <CardDescription>Average response time (last 12 days)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <LineChart
                  data={latencyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="var(--color-value)" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Token Usage</CardTitle>
            <CardDescription>Daily token consumption (last 12 days)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <AreaChart
                  data={tokenUsageData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="tokens" 
                    stroke="var(--color-tokens)" 
                    fill="var(--color-tokens)" 
                    fillOpacity={0.3} 
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Average Latency by Provider/Model</CardTitle>
            <CardDescription>Comparison of response times across providers and models</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={providerChartConfig} className="h-full w-full">
                <BarChart
                  data={providerLatencyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="model" />
                  <YAxis label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft' }} />
                  <ChartTooltip 
                    content={
                      <ChartTooltipContent 
                        labelFormatter={(value) => `Model: ${value}`}
                        formatter={(value, name, props) => {
                          return [`${value} ms`, `Provider: ${props.payload.provider}`];
                        }}
                      />
                    } 
                  />
                  <Bar 
                    dataKey="latency" 
                    name="Latency" 
                    fill="var(--color-latency)" 
                    shape={renderProviderBar}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latency Distribution by Provider/Model</CardTitle>
            <CardDescription>Box plot showing min, max, median, and quartiles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={providerChartConfig} className="h-full w-full">
                <ComposedChart
                  data={latencyDistributionData}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis type="number" domain={['dataMin - 20', 'dataMax + 20']} />
                  <YAxis dataKey="model" type="category" scale="band" />
                  <ChartTooltip 
                    content={
                      <ChartTooltipContent 
                        labelFormatter={(value) => `Model: ${value}`}
                        formatter={(value, name, props) => {
                          if (name === "median") return [`Median: ${value} ms`, `Provider: ${props.payload.provider}`];
                          if (name === "q1") return [`Q1: ${value} ms`, ""];
                          if (name === "q3") return [`Q3: ${value} ms`, ""];
                          if (name === "min") return [`Min: ${value} ms`, ""];
                          if (name === "max") return [`Max: ${value} ms`, ""];
                          return [value, name];
                        }}
                      />
                    } 
                  />
                  {/* Min-Max line */}
                  <Line 
                    dataKey="min" 
                    stroke="#94a3b8" 
                    strokeWidth={1} 
                    dot={false}
                    activeDot={false}
                  />
                  <Line 
                    dataKey="max" 
                    stroke="#94a3b8" 
                    strokeWidth={1} 
                    dot={false}
                    activeDot={false}
                  />
                  
                  {/* Box for Q1-Q3 */}
                  <Bar
                    dataKey="q3"
                    fill="rgba(148, 163, 184, 0.2)"
                    stroke="#94a3b8"
                    radius={0}
                    barSize={20}
                  />
                  
                  {/* Median line */}
                  <Line 
                    dataKey="median" 
                    stroke="#64748b" 
                    strokeWidth={2} 
                    dot={{ fill: "#64748b", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </ComposedChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Token Usage by Application</CardTitle>
            <CardDescription>Distribution of token consumption</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <BarChart
                  data={tokenUsagePerAppData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="tokens" 
                    fill="var(--color-tokens)" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Token Usage</CardTitle>
            <CardDescription>Historical token consumption</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <BarChart
                  data={tokenUsageMonthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="tokens" 
                    fill="var(--color-tokens)" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Outliers</CardTitle>
          <CardDescription>Conversations with unusual latency (click to view details)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left font-medium p-2">ID</th>
                  <th className="text-left font-medium p-2">Timestamp</th>
                  <th className="text-left font-medium p-2">Latency (ms)</th>
                  <th className="text-left font-medium p-2">Resource</th>
                  <th className="text-left font-medium p-2">Application</th>
                </tr>
              </thead>
              <tbody>
                {outlierData.map((item) => (
                  <tr 
                    key={item.id} 
                    className="border-b hover:bg-gray-50 cursor-pointer" 
                    onClick={() => handleOutlierClick(item)}
                  >
                    <td className="p-2 text-blue-600">{item.id}</td>
                    <td className="p-2">{item.timestamp}</td>
                    <td className="p-2">{item.latency}</td>
                    <td className="p-2">{item.resource}</td>
                    <td className="p-2">{item.app}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
