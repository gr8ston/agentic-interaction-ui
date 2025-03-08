
import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  ChartContainer, 
  ChartTooltipContent, 
  ChartTooltip, 
  ChartLegend, 
  ChartLegendContent, 
  type ChartConfig
} from "@/components/ui/chart";

const usageData = [
  { date: "Jan", agents: 35, tokens: 120, latency: 380 },
  { date: "Feb", agents: 42, tokens: 152, latency: 395 },
  { date: "Mar", agents: 58, tokens: 189, latency: 375 },
  { date: "Apr", agents: 75, tokens: 253, latency: 340 },
  { date: "May", agents: 92, tokens: 310, latency: 325 },
  { date: "Jun", agents: 105, tokens: 344, latency: 310 }
];

const chartConfig: ChartConfig = {
  agents: {
    label: "Active Agents",
    color: "#005B99"
  },
  tokens: {
    label: "Token Usage (k)",
    color: "#007ACC"
  },
  latency: {
    label: "Avg Latency (ms)",
    color: "#3DA6FF"
  }
};

export function ObserveFeatureChart() {
  const isMobile = useIsMobile();
  
  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-brand-primary text-left">Sample Metrics Dashboard</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
        <div>
          <h4 className="text-sm font-medium mb-3 text-gray-700 text-left">Agent Activity Over Time</h4>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <LineChart
              data={usageData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <ChartTooltip 
                content={<ChartTooltipContent />} 
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="agents"
                stroke="var(--color-agents)"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ChartContainer>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-3 text-gray-700 text-left">Token Consumption Trend</h4>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <AreaChart
              data={usageData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip 
                content={<ChartTooltipContent />}
              />
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
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-3 text-gray-700 text-left">System Performance</h4>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart
            data={usageData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip 
              content={<ChartTooltipContent />}
            />
            <Bar
              dataKey="latency"
              fill="var(--color-latency)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
