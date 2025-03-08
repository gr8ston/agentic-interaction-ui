
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, AreaChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const latencyData = [
  { date: "Jan 1", value: 320 },
  { date: "Jan 2", value: 332 },
  { date: "Jan 3", value: 301 },
  { date: "Jan 4", value: 334 },
  { date: "Jan 5", value: 350 },
  { date: "Jan 6", value: 330 },
  { date: "Jan 7", value: 315 },
  { date: "Jan 8", value: 302 },
  { date: "Jan 9", value: 310 },
  { date: "Jan 10", value: 295 },
  { date: "Jan 11", value: 316 },
  { date: "Jan 12", value: 318 },
];

const tokenUsageData = [
  { date: "Jan 1", tokens: 1200 },
  { date: "Jan 2", tokens: 1300 },
  { date: "Jan 3", tokens: 1400 },
  { date: "Jan 4", tokens: 1800 },
  { date: "Jan 5", tokens: 2000 },
  { date: "Jan 6", tokens: 1700 },
  { date: "Jan 7", tokens: 1600 },
  { date: "Jan 8", tokens: 1650 },
  { date: "Jan 9", tokens: 1580 },
  { date: "Jan 10", tokens: 1700 },
  { date: "Jan 11", tokens: 1750 },
  { date: "Jan 12", tokens: 1800 },
];

const outlierData = [
  { 
    id: "conv-1234",
    timestamp: "2023-01-05 14:23:45",
    latency: 892,
    resource: "High token usage",
    app: "Customer Support"
  },
  { 
    id: "conv-2345",
    timestamp: "2023-01-06 09:12:32",
    latency: 756,
    resource: "Long conversation",
    app: "Product Assistant"
  },
  { 
    id: "conv-3456",
    timestamp: "2023-01-08 16:45:03",
    latency: 921,
    resource: "Complex request",
    app: "Internal Tool"
  },
  { 
    id: "conv-4567",
    timestamp: "2023-01-10 11:34:19",
    latency: 812,
    resource: "Image generation",
    app: "Website Chat"
  },
];

const chartConfig = {
  value: {
    label: "Latency (ms)",
    color: "#007ACC"
  },
  tokens: {
    label: "Token Usage",
    color: "#3DA6FF"
  }
};

export function PerformanceDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Latency Trends</CardTitle>
            <CardDescription>Response time in milliseconds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <LineChart
                  data={latencyData}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="var(--color-value)" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Token Usage</CardTitle>
            <CardDescription>Daily token consumption</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <AreaChart
                  data={tokenUsageData}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
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
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Performance Outliers</CardTitle>
          <CardDescription>Conversations with higher than normal resource usage</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Conversation ID</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Latency (ms)</TableHead>
                <TableHead>Resource Issue</TableHead>
                <TableHead>Application</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {outlierData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.timestamp}</TableCell>
                  <TableCell>{item.latency}</TableCell>
                  <TableCell>{item.resource}</TableCell>
                  <TableCell>{item.app}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
