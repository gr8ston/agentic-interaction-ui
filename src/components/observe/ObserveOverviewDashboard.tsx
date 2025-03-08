
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { ArrowUp, ArrowDown, Users, MessageSquare, Activity, Clock } from "lucide-react";
import { ObserveFeatureChart } from "@/components/ObserveFeatureChart";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";

const appUsageData = [
  { name: "Customer Support", value: 35 },
  { name: "Product Assistant", value: 25 },
  { name: "Internal Tool", value: 15 },
  { name: "Website Chat", value: 20 },
  { name: "Sales Assistant", value: 5 },
];

const conversationTrendsData = [
  { date: "Mon", value: 240 },
  { date: "Tue", value: 280 },
  { date: "Wed", value: 310 },
  { date: "Thu", value: 290 },
  { date: "Fri", value: 320 },
  { date: "Sat", value: 180 },
  { date: "Sun", value: 190 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const chartConfig = {
  value: {
    label: "Conversations",
    color: "#007ACC"
  }
};

const recentConversations = [
  { id: "conv-1234", app: "Customer Support", time: "10 minutes ago", status: "Completed", tokens: 128 },
  { id: "conv-2345", app: "Product Assistant", time: "15 minutes ago", status: "Completed", tokens: 156 },
  { id: "conv-3456", app: "Internal Tool", time: "25 minutes ago", status: "Completed", tokens: 203 },
  { id: "conv-4567", app: "Website Chat", time: "30 minutes ago", status: "Completed", tokens: 182 },
  { id: "conv-5678", app: "Sales Assistant", time: "45 minutes ago", status: "Completed", tokens: 145 },
];

interface ObserveOverviewDashboardProps {
  onConversationSelect?: (conversationId: string) => void;
}

export function ObserveOverviewDashboard({ onConversationSelect }: ObserveOverviewDashboardProps) {
  const handleConversationClick = (id: string) => {
    if (onConversationSelect) {
      onConversationSelect(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Conversations</CardDescription>
            <CardTitle className="text-2xl">32,192</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 text-green-600">
              <ArrowUp className="h-4 w-4" />
              <span className="text-sm font-medium">12% increase</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Users</CardDescription>
            <CardTitle className="text-2xl">1,420</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 text-red-600">
              <ArrowDown className="h-4 w-4" />
              <span className="text-sm font-medium">3% decrease</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg. Response Time</CardDescription>
            <CardTitle className="text-2xl">340ms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 text-green-600">
              <ArrowUp className="h-4 w-4" />
              <span className="text-sm font-medium">5% faster</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Token Usage (Today)</CardDescription>
            <CardTitle className="text-2xl">5.2M</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 text-red-600">
              <ArrowUp className="h-4 w-4" />
              <span className="text-sm font-medium">8% increase</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Conversation Trends</CardTitle>
            <CardDescription>Volume over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <LineChart
                  data={conversationTrendsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">App Usage Distribution</CardTitle>
            <CardDescription>Conversations by application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={appUsageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {appUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recent Conversations</CardTitle>
          <CardDescription>Latest interactions across applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left font-medium py-2">ID</th>
                  <th className="text-left font-medium py-2">Application</th>
                  <th className="text-left font-medium py-2">Time</th>
                  <th className="text-left font-medium py-2">Status</th>
                  <th className="text-left font-medium py-2">Tokens</th>
                </tr>
              </thead>
              <tbody>
                {recentConversations.map((conversation) => (
                  <tr 
                    key={conversation.id} 
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleConversationClick(conversation.id)}
                  >
                    <td className="py-3 text-blue-600">{conversation.id}</td>
                    <td className="py-3">{conversation.app}</td>
                    <td className="py-3 text-gray-500">{conversation.time}</td>
                    <td className="py-3">
                      <Badge variant="success">{conversation.status}</Badge>
                    </td>
                    <td className="py-3">{conversation.tokens}</td>
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
