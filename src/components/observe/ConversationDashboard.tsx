
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, Bar, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import { ChartContainer, ChartTooltipContent, ChartTooltip, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const lengthDistributionData = [
  { range: "1-5", count: 124 },
  { range: "6-10", count: 235 },
  { range: "11-15", count: 187 },
  { range: "16-20", count: 97 },
  { range: "21-25", count: 45 },
  { range: "26+", count: 32 },
];

const summarizationData = [
  { name: "Used", value: 67, color: "#007ACC" },
  { name: "Not Used", value: 33, color: "#D4D4D4" },
];

const functionCallsData = [
  { function: "getWeather", count: 145 },
  { function: "searchProducts", count: 132 },
  { function: "bookAppointment", count: 98 },
  { function: "calculatePrice", count: 76 },
  { function: "processOrder", count: 62 },
];

const conversationListData = [
  { 
    id: "conv-7890",
    date: "2023-01-10",
    user: "customer@example.com",
    messages: 12,
    functions: 3,
    app: "Customer Support"
  },
  { 
    id: "conv-6789",
    date: "2023-01-10",
    user: "john.doe@example.com",
    messages: 8,
    functions: 1,
    app: "Product Assistant"
  },
  { 
    id: "conv-5678",
    date: "2023-01-09",
    user: "employee@internal.com",
    messages: 15,
    functions: 4,
    app: "Internal Tool"
  },
  { 
    id: "conv-4321",
    date: "2023-01-09",
    user: "visitor@example.com",
    messages: 6,
    functions: 2,
    app: "Website Chat"
  },
  { 
    id: "conv-3210",
    date: "2023-01-08",
    user: "app.user@example.com",
    messages: 9,
    functions: 0,
    app: "Mobile App"
  },
];

const chartConfig = {
  count: {
    label: "Conversations",
    color: "#005B99"
  },
  range: {
    label: "Message Count",
    color: "#333333"
  },
  function: {
    label: "Function Name",
    color: "#333333"
  }
};

export function ConversationDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Conversation Length Distribution</CardTitle>
            <CardDescription>Number of messages per conversation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <BarChart
                  data={lengthDistributionData}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
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
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Summarization Usage</CardTitle>
            <CardDescription>Percentage of conversations using summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summarizationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {summarizationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
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
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Function Calls</CardTitle>
          <CardDescription>Most frequently used functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart
                data={functionCallsData}
                margin={{ top: 5, right: 20, left: 20, bottom: 30 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" />
                <YAxis 
                  dataKey="function" 
                  type="category" 
                  width={120}
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="count" 
                  fill="var(--color-count)" 
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Conversation Explorer</CardTitle>
          <CardDescription>Search and browse conversation history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search conversations..."
              className="pl-8"
            />
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Conversation ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Messages</TableHead>
                <TableHead>Functions</TableHead>
                <TableHead>Application</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conversationListData.map((item) => (
                <TableRow key={item.id} className="cursor-pointer hover:bg-gray-50">
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.user}</TableCell>
                  <TableCell>{item.messages}</TableCell>
                  <TableCell>{item.functions}</TableCell>
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
