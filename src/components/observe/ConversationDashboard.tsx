
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const lengthDistributionData = [
  { range: "1-5", count: 450 },
  { range: "6-10", count: 780 },
  { range: "11-15", count: 560 },
  { range: "16-20", count: 320 },
  { range: "21-25", count: 180 },
  { range: "26-30", count: 90 },
  { range: "31+", count: 40 }
];

const summaryUsageData = [
  { name: "Used", value: 65 },
  { name: "Not Used", value: 35 }
];

const functionCallsData = [
  { name: "Get Weather", count: 340 },
  { name: "Search Web", count: 285 },
  { name: "Calculate", count: 210 },
  { name: "Find Location", count: 190 },
  { name: "Translate", count: 170 },
  { name: "Generate Image", count: 155 },
  { name: "Code Assist", count: 130 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#44C29B', '#B042FF'];

const chartConfig = {
  count: {
    label: "Conversations",
    color: "#007ACC"
  }
};

const conversationList = [
  { id: "conv-5432", app: "Customer Support", start: "2023-01-12 09:23:45", length: 8, tokens: 452, functions: 2 },
  { id: "conv-6543", app: "Internal Tool", start: "2023-01-12 10:15:22", length: 12, tokens: 678, functions: 3 },
  { id: "conv-7654", app: "Product Assistant", start: "2023-01-12 11:34:10", length: 5, tokens: 320, functions: 1 },
  { id: "conv-8765", app: "Website Chat", start: "2023-01-12 12:45:31", length: 9, tokens: 510, functions: 2 },
  { id: "conv-9876", app: "Sales Assistant", start: "2023-01-12 13:12:05", length: 14, tokens: 825, functions: 4 },
  { id: "conv-0987", app: "Customer Support", start: "2023-01-12 14:32:45", length: 7, tokens: 380, functions: 1 },
  { id: "conv-1098", app: "Internal Tool", start: "2023-01-12 15:18:50", length: 10, tokens: 605, functions: 3 },
  { id: "conv-2109", app: "Product Assistant", start: "2023-01-12 16:05:12", length: 6, tokens: 345, functions: 2 },
  { id: "conv-3210", app: "Website Chat", start: "2023-01-12 17:23:30", length: 11, tokens: 590, functions: 2 },
  { id: "conv-4321", app: "Sales Assistant", start: "2023-01-12 18:10:25", length: 9, tokens: 480, functions: 3 },
];

interface ConversationDashboardProps {
  onConversationSelect?: (conversationId: string) => void;
}

export function ConversationDashboard({ onConversationSelect }: ConversationDashboardProps) {
  const handleConversationClick = (id: string) => {
    if (onConversationSelect) {
      onConversationSelect(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Conversation Length</CardTitle>
            <CardDescription>Distribution by message count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <BarChart
                  data={lengthDistributionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="range" />
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
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Summary Usage</CardTitle>
            <CardDescription>Percentage of conversations using summarization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summaryUsageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {summaryUsageData.map((entry, index) => (
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
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Function Calls</CardTitle>
            <CardDescription>Most frequently used functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <BarChart
                  data={functionCallsData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="count" 
                    fill="var(--color-count)" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Conversation Explorer</CardTitle>
          <CardDescription>Search and filter conversation history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Search conversations..." 
                  className="pl-8"
                />
              </div>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Application" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Applications</SelectItem>
                    <SelectItem value="customer-support">Customer Support</SelectItem>
                    <SelectItem value="product-assistant">Product Assistant</SelectItem>
                    <SelectItem value="internal-tool">Internal Tool</SelectItem>
                    <SelectItem value="website-chat">Website Chat</SelectItem>
                    <SelectItem value="sales-assistant">Sales Assistant</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">Filter</Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-medium py-2">ID</th>
                    <th className="text-left font-medium py-2">Application</th>
                    <th className="text-left font-medium py-2">Started</th>
                    <th className="text-left font-medium py-2">Length</th>
                    <th className="text-left font-medium py-2">Tokens</th>
                    <th className="text-left font-medium py-2">Functions</th>
                  </tr>
                </thead>
                <tbody>
                  {conversationList.map((conversation) => (
                    <tr 
                      key={conversation.id} 
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleConversationClick(conversation.id)}
                    >
                      <td className="py-3 text-blue-600">{conversation.id}</td>
                      <td className="py-3">{conversation.app}</td>
                      <td className="py-3">{conversation.start}</td>
                      <td className="py-3">{conversation.length} messages</td>
                      <td className="py-3">{conversation.tokens}</td>
                      <td className="py-3">
                        <Badge variant={conversation.functions > 2 ? "info" : "outline"}>
                          {conversation.functions}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing 10 of 245 conversations
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
