
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, BarChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";

const conversationData = [
  { date: "Jan 1", count: 120 },
  { date: "Jan 8", count: 145 },
  { date: "Jan 15", count: 160 },
  { date: "Jan 22", count: 180 },
  { date: "Jan 29", count: 210 },
  { date: "Feb 5", count: 250 },
  { date: "Feb 12", count: 280 },
];

const appUsageData = [
  { app: "Customer Support", count: 450 },
  { app: "Product Assistant", count: 380 },
  { app: "Internal Tool", count: 230 },
  { app: "Website Chat", count: 190 },
  { app: "Mobile App", count: 120 },
];

const chartConfig = {
  count: {
    label: "Conversations",
    color: "#005B99"
  },
  app: {
    label: "Application",
    color: "#333333"
  }
};

export function ObserveOverviewDashboard() {
  const activeConversations = 43;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Active Conversations</CardTitle>
            <CardDescription>Real-time active sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32">
              <div className="text-5xl font-bold text-brand-primary">{activeConversations}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Conversation Trends</CardTitle>
            <CardDescription>Conversations over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32 w-full">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <LineChart
                  data={conversationData}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="var(--color-count)" 
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
          <CardTitle className="text-xl">App Usage Breakdown</CardTitle>
          <CardDescription>Conversations by application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart
                data={appUsageData}
                margin={{ top: 5, right: 20, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="app" 
                  angle={-45} 
                  textAnchor="end" 
                  height={70} 
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="count" 
                  fill="var(--color-count)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
