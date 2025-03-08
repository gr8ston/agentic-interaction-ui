
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, AreaChart, BarChart, ScatterChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Scatter, ZAxis, Legend } from "recharts";
import { ChartContainer, ChartTooltipContent, ChartTooltip, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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

const tokenUsagePerAppData = [
  { name: "Customer Support", tokens: 25000 },
  { name: "Product Assistant", tokens: 18000 },
  { name: "Internal Tool", tokens: 12000 },
  { name: "Website Chat", tokens: 30000 },
  { name: "Sales Assistant", tokens: 15000 },
];

const tokenUsageMonthlyData = [
  { month: "Jan", tokens: 80000 },
  { month: "Feb", tokens: 95000 },
  { month: "Mar", tokens: 102000 },
  { month: "Apr", tokens: 118000 },
  { month: "May", tokens: 125000 },
  { month: "Jun", tokens: 132000 },
];

const latencyVsTokensData = [
  { id: "conv-1001", tokens: 250, latency: 320, app: "Customer Support" },
  { id: "conv-1002", tokens: 320, latency: 380, app: "Customer Support" },
  { id: "conv-1003", tokens: 180, latency: 290, app: "Product Assistant" },
  { id: "conv-1004", tokens: 450, latency: 560, app: "Product Assistant" },
  { id: "conv-1005", tokens: 520, latency: 620, app: "Internal Tool" },
  { id: "conv-1006", tokens: 380, latency: 490, app: "Internal Tool" },
  { id: "conv-1007", tokens: 220, latency: 310, app: "Website Chat" },
  { id: "conv-1008", tokens: 620, latency: 720, app: "Website Chat" },
  { id: "conv-1009", tokens: 180, latency: 280, app: "Sales Assistant" },
  { id: "conv-1010", tokens: 750, latency: 810, app: "Sales Assistant" },
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
  },
  latency: {
    label: "Latency (ms)",
    color: "#007ACC"
  },
  customerSupport: {
    label: "Customer Support",
    color: "#4CAF50"
  },
  productAssistant: {
    label: "Product Assistant",
    color: "#2196F3"
  },
  internalTool: {
    label: "Internal Tool",
    color: "#9C27B0"
  },
  websiteChat: {
    label: "Website Chat",
    color: "#FF9800"
  },
  salesAssistant: {
    label: "Sales Assistant",
    color: "#F44336"
  }
};

interface PerformanceDashboardProps {
  onConversationSelect?: (conversationId: string) => void;
}

export function PerformanceDashboard({ onConversationSelect }: PerformanceDashboardProps) {
  const handleRowClick = (id: string) => {
    if (onConversationSelect) {
      onConversationSelect(id);
    }
  };

  const handleScatterClick = (data: any) => {
    if (data && data.id && onConversationSelect) {
      onConversationSelect(data.id);
    }
  };

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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Token Usage Per App</CardTitle>
            <CardDescription>Distribution across applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <BarChart
                  data={tokenUsagePerAppData}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={120} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="tokens" 
                    fill="var(--color-tokens)" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Monthly Token Usage</CardTitle>
            <CardDescription>Trends over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <LineChart
                  data={tokenUsageMonthlyData}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="tokens" 
                    stroke="var(--color-tokens)" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Latency vs Token Usage</CardTitle>
          <CardDescription>Correlation between tokens and response time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid opacity={0.3} />
                <XAxis 
                  type="number" 
                  dataKey="tokens" 
                  name="Tokens" 
                  label={{ value: 'Tokens Used', position: 'bottom', offset: 0 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="latency" 
                  name="Latency" 
                  label={{ value: 'Latency (ms)', angle: -90, position: 'left' }}
                />
                <ZAxis range={[60, 60]} />
                <ChartTooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-4 border border-gray-200 rounded shadow-md">
                          <p className="font-semibold text-sm">ID: {payload[0].payload.id}</p>
                          <p className="text-sm text-gray-700">App: {payload[0].payload.app}</p>
                          <p className="text-sm text-gray-700">Tokens: {payload[0].payload.tokens}</p>
                          <p className="text-sm text-gray-700">Latency: {payload[0].payload.latency}ms</p>
                          <p className="text-xs text-blue-600 mt-1">Click to view details</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter 
                  name="Conversations" 
                  data={latencyVsTokensData} 
                  fill="#8884d8"
                  onClick={handleScatterClick}
                  cursor="pointer"
                />
              </ScatterChart>
            </ChartContainer>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>Each point represents a conversation. Click on any point to view detailed conversation data.</p>
          </div>
        </CardContent>
      </Card>
      
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
                <TableRow 
                  key={item.id}
                  onClick={() => handleRowClick(item.id)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <TableCell className="font-medium text-blue-600">{item.id}</TableCell>
                  <TableCell>{item.timestamp}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      {item.latency}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.resource}</TableCell>
                  <TableCell>{item.app}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 text-sm text-gray-600">
            <p>Click on any conversation ID to view the detailed conversation history.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
