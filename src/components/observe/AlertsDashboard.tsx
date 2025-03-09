import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowUp, Bell, Clock, AlertTriangle, Check, Info } from "lucide-react";

const alertRules = [
  { 
    id: "rule-1", 
    name: "High Latency Alert", 
    condition: "Latency > 500ms", 
    target: "All applications",
    status: "Active",
    created: "2023-01-05" 
  },
  { 
    id: "rule-2", 
    name: "Token Usage Spike", 
    condition: "Token usage increases by >25% in 1 hour", 
    target: "Customer Support",
    status: "Active",
    created: "2023-01-10" 
  },
  { 
    id: "rule-3", 
    name: "Error Rate Monitor", 
    condition: "Error rate > 5%", 
    target: "All applications",
    status: "Inactive",
    created: "2023-01-15" 
  },
  { 
    id: "rule-4", 
    name: "Conversation Length Alert", 
    condition: "Conversation length > 20 messages", 
    target: "Website Chat",
    status: "Active",
    created: "2023-01-20" 
  },
  { 
    id: "rule-5", 
    name: "Function Call Monitor", 
    condition: "Function calls > 5 per conversation", 
    target: "Internal Tool",
    status: "Active",
    created: "2023-01-25" 
  },
];

const alertHistory = [
  { 
    id: "alert-1", 
    rule: "High Latency Alert", 
    application: "Customer Support",
    conversationId: "conv-1234",
    timestamp: "2023-01-12 09:45:22", 
    value: "635ms",
    severity: "high" 
  },
  { 
    id: "alert-2", 
    rule: "Token Usage Spike", 
    application: "Customer Support",
    conversationId: "conv-2345",
    timestamp: "2023-01-12 10:15:33", 
    value: "+32% (1h)",
    severity: "medium" 
  },
  { 
    id: "alert-3", 
    rule: "High Latency Alert", 
    application: "Product Assistant",
    conversationId: "conv-3456",
    timestamp: "2023-01-12 11:30:15", 
    value: "542ms",
    severity: "medium" 
  },
  { 
    id: "alert-4", 
    rule: "Conversation Length Alert", 
    application: "Website Chat",
    conversationId: "conv-4567",
    timestamp: "2023-01-12 12:20:45", 
    value: "23 messages",
    severity: "low" 
  },
  { 
    id: "alert-5", 
    rule: "Function Call Monitor", 
    application: "Internal Tool",
    conversationId: "conv-5678",
    timestamp: "2023-01-12 13:10:10", 
    value: "7 calls",
    severity: "low" 
  },
  { 
    id: "alert-6", 
    rule: "High Latency Alert", 
    application: "Website Chat",
    conversationId: "conv-6789",
    timestamp: "2023-01-12 14:05:33", 
    value: "580ms",
    severity: "high" 
  },
  { 
    id: "alert-7", 
    rule: "Token Usage Spike", 
    application: "Product Assistant",
    conversationId: "conv-7890",
    timestamp: "2023-01-12 15:15:22", 
    value: "+28% (1h)",
    severity: "medium" 
  },
];

interface AlertsDashboardProps {
  onConversationSelect?: (conversationId: string) => void;
}

export function AlertsDashboard({ onConversationSelect }: AlertsDashboardProps) {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive" className="w-16 flex justify-center">High</Badge>;
      case "medium":
        return <Badge variant="warning" className="w-16 flex justify-center">Medium</Badge>;
      case "low":
        return <Badge variant="info" className="w-16 flex justify-center">Low</Badge>;
      default:
        return <Badge variant="outline" className="w-16 flex justify-center">Unknown</Badge>;
    }
  };

  const handleAlertClick = (conversationId: string) => {
    if (onConversationSelect) {
      onConversationSelect(conversationId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Alerts (Today)</CardDescription>
            <CardTitle className="text-2xl">12</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 text-red-600">
              <ArrowUp className="h-4 w-4" />
              <span className="text-sm font-medium">4 more than yesterday</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Alert Rules</CardDescription>
            <CardTitle className="text-2xl">8</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 text-gray-600">
              <Bell className="h-4 w-4" />
              <span className="text-sm font-medium">Monitoring all systems</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg. Response Time</CardDescription>
            <CardTitle className="text-2xl">15 min</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 text-green-600">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">5 min faster than target</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full md:w-96 grid-cols-2">
          <TabsTrigger value="history">Alert History</TabsTrigger>
          <TabsTrigger value="rules">Alert Rules</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Recent Alerts</CardTitle>
              <CardDescription>Alerts triggered in the past 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <Input placeholder="Filter alerts..." />
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">Filter</Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-medium py-2">Alert</th>
                      <th className="text-left font-medium py-2">Application</th>
                      <th className="text-left font-medium py-2">Conversation</th>
                      <th className="text-left font-medium py-2">Time</th>
                      <th className="text-left font-medium py-2">Value</th>
                      <th className="text-left font-medium py-2">Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alertHistory.map((alert) => (
                      <tr key={alert.id} className="border-b hover:bg-gray-50">
                        <td className="py-3">{alert.rule}</td>
                        <td className="py-3">{alert.application}</td>
                        <td className="py-3">
                          <span 
                            className="text-blue-600 cursor-pointer hover:underline"
                            onClick={() => handleAlertClick(alert.conversationId)}
                          >
                            {alert.conversationId}
                          </span>
                        </td>
                        <td className="py-3 text-gray-500">{alert.timestamp}</td>
                        <td className="py-3 font-medium">{alert.value}</td>
                        <td className="py-3">
                          {getSeverityBadge(alert.severity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rules" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Alert Rules</CardTitle>
                <CardDescription>Configure when to trigger alerts</CardDescription>
              </div>
              <Button>New Rule</Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-medium py-2">Rule Name</th>
                      <th className="text-left font-medium py-2">Condition</th>
                      <th className="text-left font-medium py-2">Target</th>
                      <th className="text-left font-medium py-2">Created</th>
                      <th className="text-left font-medium py-2">Status</th>
                      <th className="text-left font-medium py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alertRules.map((rule) => (
                      <tr key={rule.id} className="border-b">
                        <td className="py-3 font-medium">{rule.name}</td>
                        <td className="py-3">{rule.condition}</td>
                        <td className="py-3">{rule.target}</td>
                        <td className="py-3 text-gray-500">{rule.created}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <Switch id={`status-${rule.id}`} defaultChecked={rule.status === "Active"} />
                            <Label htmlFor={`status-${rule.id}`} className="text-sm">
                              {rule.status}
                            </Label>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Info className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <AlertTriangle className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium mb-2">Create a New Alert Rule</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Alert rules help you monitor your AI applications for issues. You can set conditions based on latency, token usage, error rates, and more.
                </p>
                <Button variant="outline" size="sm">
                  <Check className="mr-2 h-4 w-4" /> View Alert Rule Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
