
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, AreaChart, BarChart, ScatterChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Scatter, ZAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Import data and utilities
import { 
  latencyData, 
  tokenUsageData, 
  tokenUsagePerAppData, 
  tokenUsageMonthlyData,
  latencyVsTokensData,
  outlierData 
} from "../performance/performanceData";
import { chartConfig } from "../performance/chartConfig";

interface GeneralMetricsTabProps {
  onConversationSelect: (conversationId: string) => void;
}

export function GeneralMetricsTab({ onConversationSelect }: GeneralMetricsTabProps) {
  const handleRowClick = (id: string) => {
    onConversationSelect(id);
  };

  const handleScatterClick = (data: any) => {
    if (data && data.id) {
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
