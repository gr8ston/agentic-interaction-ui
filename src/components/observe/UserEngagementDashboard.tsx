
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Filter, Users, Clock, Users2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Sample data for active users over time
const activeUsersData = [
  { date: "Jan 1", users: 120 },
  { date: "Jan 2", users: 132 },
  { date: "Jan 3", users: 145 },
  { date: "Jan 4", users: 160 },
  { date: "Jan 5", users: 178 },
  { date: "Jan 6", users: 190 },
  { date: "Jan 7", users: 203 },
  { date: "Jan 8", users: 215 },
  { date: "Jan 9", users: 230 },
  { date: "Jan 10", users: 242 },
  { date: "Jan 11", users: 258 },
  { date: "Jan 12", users: 270 },
];

// Sample data for user retention
const retentionData = [
  { cohort: "Week 1", week1: 100, week2: 80, week3: 65, week4: 55 },
  { cohort: "Week 2", week1: 100, week2: 85, week3: 70, week4: 60 },
  { cohort: "Week 3", week1: 100, week2: 82, week3: 68, week4: 58 },
  { cohort: "Week 4", week1: 100, week2: 90, week3: 75, week4: 65 },
];

// Sample data for average session duration
const sessionDurationData = [
  { date: "Jan 1", duration: 5.2 },
  { date: "Jan 2", duration: 5.7 },
  { date: "Jan 3", duration: 6.1 },
  { date: "Jan 4", duration: 5.5 },
  { date: "Jan 5", duration: 5.9 },
  { date: "Jan 6", duration: 6.3 },
  { date: "Jan 7", duration: 6.7 },
  { date: "Jan 8", duration: 7.0 },
  { date: "Jan 9", duration: 6.5 },
  { date: "Jan 10", duration: 6.8 },
  { date: "Jan 11", duration: 7.1 },
  { date: "Jan 12", duration: 7.4 },
];

// Sample data for applications
const applicationsData = [
  { id: "app-1", name: "Customer Support", users: 245, avgDuration: 6.8, growth: "+12%" },
  { id: "app-2", name: "Product Assistant", users: 189, avgDuration: 5.2, growth: "+8%" },
  { id: "app-3", name: "Internal Tool", users: 95, avgDuration: 7.5, growth: "+15%" },
  { id: "app-4", name: "Website Chat", users: 320, avgDuration: 4.3, growth: "+25%" },
  { id: "app-5", name: "Sales Assistant", users: 156, avgDuration: 8.1, growth: "+5%" },
];

// Sample data for users (when drilling down into an app)
const usersData = [
  { id: "user-1", name: "John Doe", lastActive: "Today, 10:45 AM", totalSessions: 28, avgDuration: 6.2 },
  { id: "user-2", name: "Jane Smith", lastActive: "Today, 9:30 AM", totalSessions: 42, avgDuration: 7.5 },
  { id: "user-3", name: "Robert Johnson", lastActive: "Yesterday, 4:15 PM", totalSessions: 15, avgDuration: 5.8 },
  { id: "user-4", name: "Emily Davis", lastActive: "Today, 11:20 AM", totalSessions: 33, avgDuration: 6.9 },
  { id: "user-5", name: "Michael Wilson", lastActive: "2 days ago", totalSessions: 20, avgDuration: 4.5 },
];

const chartConfig = {
  users: {
    label: "Active Users",
    color: "#8B5CF6"
  },
  duration: {
    label: "Duration (minutes)",
    color: "#3B82F6"
  },
  week1: {
    label: "Week 1",
    color: "#10B981"
  },
  week2: {
    label: "Week 2",
    color: "#3B82F6"
  },
  week3: {
    label: "Week 3",
    color: "#8B5CF6"
  },
  week4: {
    label: "Week 4",
    color: "#EC4899"
  }
};

interface UserEngagementDashboardProps {
  onConversationSelect?: (conversationId: string) => void;
}

export function UserEngagementDashboard({ onConversationSelect }: UserEngagementDashboardProps) {
  const [viewType, setViewType] = useState<"chart" | "table">("chart");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<"week" | "month" | "quarter" | "year">("month");

  const handleAppSelect = (appId: string) => {
    setSelectedApp(appId);
  };

  const handleBackToApps = () => {
    setSelectedApp(null);
  };

  return (
    <div className="space-y-6">
      {/* Filter and View Controls */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <CalendarIcon className="h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Filter className="h-4 w-4" />
                {dateRange === "week" ? "Last Week" : 
                 dateRange === "month" ? "Last Month" : 
                 dateRange === "quarter" ? "Last Quarter" : "Last Year"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <div className="p-2">
                <Button 
                  variant={dateRange === "week" ? "default" : "ghost"} 
                  onClick={() => setDateRange("week")}
                  className="w-full justify-start mb-1"
                >
                  Last Week
                </Button>
                <Button 
                  variant={dateRange === "month" ? "default" : "ghost"} 
                  onClick={() => setDateRange("month")}
                  className="w-full justify-start mb-1"
                >
                  Last Month
                </Button>
                <Button 
                  variant={dateRange === "quarter" ? "default" : "ghost"} 
                  onClick={() => setDateRange("quarter")}
                  className="w-full justify-start mb-1"
                >
                  Last Quarter
                </Button>
                <Button 
                  variant={dateRange === "year" ? "default" : "ghost"} 
                  onClick={() => setDateRange("year")}
                  className="w-full justify-start"
                >
                  Last Year
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Tabs value={viewType} onValueChange={(v) => setViewType(v as "chart" | "table")}>
            <TabsList>
              <TabsTrigger value="chart">Charts</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {selectedApp ? (
        // App drill-down view
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {applicationsData.find(app => app.id === selectedApp)?.name} - User Details
            </h2>
            <Button variant="outline" onClick={handleBackToApps}>
              Back to Applications
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Users</CardTitle>
              <CardDescription>Active users and their engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User Name</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Total Sessions</TableHead>
                    <TableHead>Avg. Duration (min)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersData.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.lastActive}</TableCell>
                      <TableCell>{user.totalSessions}</TableCell>
                      <TableCell>{user.avgDuration}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Main view (Apps and metrics)
        <div className="space-y-6">
          {viewType === "chart" ? (
            // Charts view
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Active Users Over Time</CardTitle>
                  <CardDescription>Daily unique user counts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                      <LineChart
                        data={activeUsersData}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="users" 
                          stroke="var(--color-users)" 
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
                  <CardTitle className="text-xl">Average Session Duration</CardTitle>
                  <CardDescription>Minutes per session</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                      <BarChart
                        data={sessionDurationData}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar 
                          dataKey="duration" 
                          fill="var(--color-duration)" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">User Retention</CardTitle>
                  <CardDescription>Weekly cohort retention rates (%)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                      <BarChart
                        data={retentionData}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="cohort" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="week1" stackId="a" fill="var(--color-week1)" />
                        <Bar dataKey="week2" stackId="a" fill="var(--color-week2)" />
                        <Bar dataKey="week3" stackId="a" fill="var(--color-week3)" />
                        <Bar dataKey="week4" stackId="a" fill="var(--color-week4)" />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            // Table view
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Applications</CardTitle>
                <CardDescription>User engagement by application</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application</TableHead>
                      <TableHead>Active Users</TableHead>
                      <TableHead>Avg. Duration (min)</TableHead>
                      <TableHead>Growth</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applicationsData.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.name}</TableCell>
                        <TableCell>{app.users}</TableCell>
                        <TableCell>{app.avgDuration}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {app.growth}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" onClick={() => handleAppSelect(app.id)}>
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
