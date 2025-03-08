
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PieChart, 
  Pie, 
  Cell, 
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
  ScatterChart, 
  Scatter,
  ZAxis
} from "recharts";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, Clock, User, MessageSquare, Activity } from "lucide-react";

// Mock data for feedback distribution
const feedbackDistributionData = [
  { name: "Positive", value: 65, color: "#4CAF50" },
  { name: "Negative", value: 35, color: "#F44336" },
];

// Mock data for feedback over time
const feedbackOverTimeData = [
  { date: "Jan 1", positive: 45, negative: 10 },
  { date: "Jan 2", positive: 50, negative: 15 },
  { date: "Jan 3", positive: 55, negative: 12 },
  { date: "Jan 4", positive: 60, negative: 8 },
  { date: "Jan 5", positive: 65, negative: 10 },
  { date: "Jan 6", positive: 48, negative: 20 },
  { date: "Jan 7", positive: 52, negative: 15 },
  { date: "Jan 8", positive: 58, negative: 12 },
  { date: "Jan 9", positive: 63, negative: 8 },
  { date: "Jan 10", positive: 70, negative: 5 },
];

// Mock data for feedback by user
const feedbackByUserData = [
  { id: "user-1", name: "John D.", positive: 18, negative: 2 },
  { id: "user-2", name: "Sarah M.", positive: 15, negative: 3 },
  { id: "user-3", name: "Alex W.", positive: 12, negative: 6 },
  { id: "user-4", name: "Emma R.", positive: 10, negative: 8 },
  { id: "user-5", name: "Mike T.", positive: 8, negative: 10 },
];

// Mock data for feedback by conversation
const feedbackByConversationData = [
  { id: "conv-1234", time: "Today, 10:23", positive: 3, negative: 0 },
  { id: "conv-2345", time: "Today, 09:15", positive: 2, negative: 1 },
  { id: "conv-3456", time: "Yesterday, 15:30", positive: 0, negative: 4 },
  { id: "conv-4567", time: "Yesterday, 14:20", positive: 4, negative: 0 },
  { id: "conv-5678", time: "2 days ago", positive: 1, negative: 2 },
];

// Mock data for feedback vs latency
const feedbackVsLatencyData = [
  { id: "msg-1001", latency: 350, isPositive: true, app: "Customer Support" },
  { id: "msg-1002", latency: 420, isPositive: true, app: "Customer Support" },
  { id: "msg-1003", latency: 280, isPositive: true, app: "Product Assistant" },
  { id: "msg-1004", latency: 580, isPositive: false, app: "Product Assistant" },
  { id: "msg-1005", latency: 620, isPositive: false, app: "Internal Tool" },
  { id: "msg-1006", latency: 450, isPositive: true, app: "Internal Tool" },
  { id: "msg-1007", latency: 310, isPositive: true, app: "Website Chat" },
  { id: "msg-1008", latency: 750, isPositive: false, app: "Website Chat" },
  { id: "msg-1009", latency: 280, isPositive: true, app: "Sales Assistant" },
  { id: "msg-1010", latency: 690, isPositive: false, app: "Sales Assistant" },
];

// Mock data for feedback vs token consumption
const feedbackVsTokensData = [
  { id: "msg-2001", tokens: 120, isPositive: true, app: "Customer Support" },
  { id: "msg-2002", tokens: 350, isPositive: true, app: "Customer Support" },
  { id: "msg-2003", tokens: 180, isPositive: true, app: "Product Assistant" },
  { id: "msg-2004", tokens: 580, isPositive: false, app: "Product Assistant" },
  { id: "msg-2005", tokens: 780, isPositive: false, app: "Internal Tool" },
  { id: "msg-2006", tokens: 420, isPositive: true, app: "Internal Tool" },
  { id: "msg-2007", tokens: 280, isPositive: true, app: "Website Chat" },
  { id: "msg-2008", tokens: 650, isPositive: false, app: "Website Chat" },
  { id: "msg-2009", tokens: 150, isPositive: true, app: "Sales Assistant" },
  { id: "msg-2010", tokens: 550, isPositive: false, app: "Sales Assistant" },
];

// Mock data for app-based feedback
const appFeedbackData = [
  { name: "Customer Support", positive: 75, negative: 25 },
  { name: "Product Assistant", positive: 60, negative: 40 },
  { name: "Internal Tool", positive: 50, negative: 50 },
  { name: "Website Chat", positive: 85, negative: 15 },
  { name: "Sales Assistant", positive: 65, negative: 35 },
];

// Common words for positive feedback (mock data)
const positiveWords = [
  { text: "helpful", value: 64 },
  { text: "fast", value: 42 },
  { text: "accurate", value: 36 },
  { text: "efficient", value: 28 },
  { text: "easy", value: 25 },
  { text: "great", value: 22 },
  { text: "reliable", value: 18 },
  { text: "clear", value: 16 },
  { text: "intuitive", value: 14 },
  { text: "excellent", value: 12 },
];

// Common words for negative feedback (mock data)
const negativeWords = [
  { text: "slow", value: 38 },
  { text: "confusing", value: 30 },
  { text: "inaccurate", value: 28 },
  { text: "difficult", value: 25 },
  { text: "unclear", value: 22 },
  { text: "frustrating", value: 18 },
  { text: "complicated", value: 15 },
  { text: "unhelpful", value: 12 },
  { text: "buggy", value: 10 },
  { text: "unreliable", value: 8 },
];

const chartConfig = {
  positive: {
    label: "Positive Feedback",
    color: "#4CAF50"
  },
  negative: {
    label: "Negative Feedback",
    color: "#F44336"
  },
  latency: {
    label: "Latency (ms)",
    color: "#007ACC"
  },
  tokens: {
    label: "Token Usage",
    color: "#3DA6FF"
  }
};

interface FeedbackDashboardProps {
  onConversationSelect?: (conversationId: string) => void;
}

export function FeedbackDashboard({ onConversationSelect }: FeedbackDashboardProps) {
  const handleConversationClick = (id: string) => {
    if (onConversationSelect) {
      onConversationSelect(id);
    }
  };

  const handleMessageClick = (id: string) => {
    // Extract the conversation ID from the message ID for this demo
    const conversationId = id.replace('msg', 'conv');
    if (onConversationSelect) {
      onConversationSelect(conversationId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Positive Feedback</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              65%
              <ThumbsUp className="h-5 w-5 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500">Last 30 days</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Negative Feedback</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              35%
              <ThumbsDown className="h-5 w-5 text-red-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500">Last 30 days</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Feedback Volume</CardDescription>
            <CardTitle className="text-2xl">1,248</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500">Total feedback received</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg. Response Time</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              352ms
              <Clock className="h-5 w-5 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500">For positive feedback</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Feedback Distribution</CardTitle>
            <CardDescription>Positive vs Negative Sentiment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={feedbackDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {feedbackDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Feedback Over Time</CardTitle>
            <CardDescription>Trends in user sentiment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <LineChart
                  data={feedbackOverTimeData}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="positive" 
                    stroke="var(--color-positive)" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="negative" 
                    stroke="var(--color-negative)" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">User Feedback Analysis</CardTitle>
          <CardDescription>Breakdown by users and conversations</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="users">By User</TabsTrigger>
              <TabsTrigger value="conversations">By Conversation</TabsTrigger>
              <TabsTrigger value="apps">By Application</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users">
              <div className="h-80">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <BarChart
                    data={feedbackByUserData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} horizontal={true} vertical={false} />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={80} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend verticalAlign="top" align="right" />
                    <Bar dataKey="positive" stackId="a" fill="var(--color-positive)" />
                    <Bar dataKey="negative" stackId="a" fill="var(--color-negative)" />
                  </BarChart>
                </ChartContainer>
              </div>
              <div className="mt-4">
                <div className="text-sm font-medium mb-2">Top Feedback Providers</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {feedbackByUserData.slice(0, 4).map((user) => (
                    <div key={user.id} className="flex items-center gap-3 p-3 border rounded-md">
                      <User className="h-8 w-8 text-gray-400 bg-gray-100 p-1.5 rounded-full" />
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3 text-green-500" /> {user.positive}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsDown className="h-3 w-3 text-red-500" /> {user.negative}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="conversations">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-medium py-2">Conversation ID</th>
                      <th className="text-left font-medium py-2">Time</th>
                      <th className="text-left font-medium py-2">Positive</th>
                      <th className="text-left font-medium py-2">Negative</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbackByConversationData.map((conversation) => (
                      <tr 
                        key={conversation.id} 
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleConversationClick(conversation.id)}
                      >
                        <td className="py-3 text-blue-600">{conversation.id}</td>
                        <td className="py-3 text-gray-500">{conversation.time}</td>
                        <td className="py-3">
                          <Badge variant="success" className="flex items-center w-8 justify-center">
                            {conversation.positive}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <Badge variant="destructive" className="flex items-center w-8 justify-center">
                            {conversation.negative}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="apps">
              <div className="h-80">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <BarChart
                    data={appFeedbackData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend verticalAlign="top" align="right" />
                    <Bar dataKey="positive" stackId="a" fill="var(--color-positive)" />
                    <Bar dataKey="negative" stackId="a" fill="var(--color-negative)" />
                  </BarChart>
                </ChartContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Feedback vs Latency</CardTitle>
            <CardDescription>Impact of response time on user satisfaction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid opacity={0.3} />
                  <XAxis 
                    type="number" 
                    dataKey="latency" 
                    name="Latency" 
                    label={{ value: 'Latency (ms)', position: 'bottom', offset: 0 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="isPositive" 
                    name="Sentiment" 
                    domain={[-0.5, 1.5]}
                    ticks={[0, 1]}
                    tickFormatter={(value) => value ? "Positive" : "Negative"}
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
                            <p className="text-sm text-gray-700">Latency: {payload[0].payload.latency}ms</p>
                            <p className="text-sm text-gray-700">Feedback: {payload[0].payload.isPositive ? "Positive" : "Negative"}</p>
                            <p className="text-xs text-blue-600 mt-1">Click to view details</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter 
                    name="Feedback" 
                    data={feedbackVsLatencyData} 
                    fill={(entry) => entry.isPositive ? "#4CAF50" : "#F44336"}
                    onClick={handleMessageClick}
                    cursor="pointer"
                  />
                </ScatterChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Feedback vs Token Usage</CardTitle>
            <CardDescription>Relationship between token consumption and satisfaction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
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
                    dataKey="isPositive" 
                    name="Sentiment" 
                    domain={[-0.5, 1.5]}
                    ticks={[0, 1]}
                    tickFormatter={(value) => value ? "Positive" : "Negative"}
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
                            <p className="text-sm text-gray-700">Feedback: {payload[0].payload.isPositive ? "Positive" : "Negative"}</p>
                            <p className="text-xs text-blue-600 mt-1">Click to view details</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter 
                    name="Feedback" 
                    data={feedbackVsTokensData} 
                    fill={(entry) => entry.isPositive ? "#4CAF50" : "#F44336"}
                    onClick={handleMessageClick}
                    cursor="pointer"
                  />
                </ScatterChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Common Feedback Themes</CardTitle>
          <CardDescription>Frequently mentioned words in user feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="positive" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="positive">Positive Feedback</TabsTrigger>
              <TabsTrigger value="negative">Negative Feedback</TabsTrigger>
            </TabsList>
            
            <TabsContent value="positive">
              <div className="p-4 bg-gray-50 rounded-md min-h-[200px]">
                <div className="flex flex-wrap gap-3 justify-center">
                  {positiveWords.map((word) => (
                    <span 
                      key={word.text}
                      className="inline-block"
                      style={{
                        fontSize: `${Math.max(0.8, Math.min(3, word.value / 10))}rem`, 
                        opacity: Math.max(0.5, Math.min(1, word.value / 50)),
                        color: '#4CAF50'
                      }}
                    >
                      {word.text}
                    </span>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="negative">
              <div className="p-4 bg-gray-50 rounded-md min-h-[200px]">
                <div className="flex flex-wrap gap-3 justify-center">
                  {negativeWords.map((word) => (
                    <span 
                      key={word.text}
                      className="inline-block"
                      style={{
                        fontSize: `${Math.max(0.8, Math.min(3, word.value / 10))}rem`, 
                        opacity: Math.max(0.5, Math.min(1, word.value / 50)),
                        color: '#F44336'
                      }}
                    >
                      {word.text}
                    </span>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
