
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Bell, AlertTriangle, Check, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const alertHistoryData = [
  { 
    id: "alert-1234",
    timestamp: "2023-01-10 14:23:45",
    type: "Latency",
    threshold: "500ms",
    value: "645ms",
    status: "Resolved",
    app: "Customer Support"
  },
  { 
    id: "alert-2345",
    timestamp: "2023-01-10 09:12:32",
    type: "Error Rate",
    threshold: "5%",
    value: "7.2%",
    status: "Active",
    app: "Product Assistant"
  },
  { 
    id: "alert-3456",
    timestamp: "2023-01-09 16:45:03",
    type: "Token Usage",
    threshold: "10000/day",
    value: "12540",
    status: "Acknowledged",
    app: "Internal Tool"
  },
  { 
    id: "alert-4567",
    timestamp: "2023-01-09 11:34:19",
    type: "Latency",
    threshold: "500ms",
    value: "532ms",
    status: "Resolved",
    app: "Website Chat"
  },
  { 
    id: "alert-5678",
    timestamp: "2023-01-08 10:22:15",
    type: "Error Rate",
    threshold: "5%",
    value: "6.8%",
    status: "Resolved",
    app: "Mobile App"
  },
];

export function AlertsDashboard() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Alert Rules</CardTitle>
              <CardDescription>Configure monitoring thresholds</CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New Alert
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-dashed border-gray-300">
              <CardContent className="pt-6">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="alert-name">Alert Name</Label>
                    <Input id="alert-name" placeholder="High Latency Alert" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="metric-type">Metric Type</Label>
                    <Select>
                      <SelectTrigger id="metric-type">
                        <SelectValue placeholder="Select metric" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="latency">Latency</SelectItem>
                        <SelectItem value="error-rate">Error Rate</SelectItem>
                        <SelectItem value="token-usage">Token Usage</SelectItem>
                        <SelectItem value="conversation-volume">Conversation Volume</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="threshold">Threshold</Label>
                      <Input id="threshold" placeholder="500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit</Label>
                      <Select>
                        <SelectTrigger id="unit">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ms">Milliseconds</SelectItem>
                          <SelectItem value="percent">Percent</SelectItem>
                          <SelectItem value="count">Count</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notification">Notification Method</Label>
                    <Select>
                      <SelectTrigger id="notification">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="webhook">Webhook</SelectItem>
                        <SelectItem value="slack">Slack</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button className="w-full">Save Alert Rule</Button>
                </form>
              </CardContent>
            </Card>
            
            <div className="space-y-3">
              <div className="rounded-lg border p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-brand-primary" />
                    <span className="font-medium">High Latency Alert</span>
                  </div>
                  <Badge variant="outline">Latency</Badge>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Triggers when latency exceeds 500ms
                </div>
              </div>
              
              <div className="rounded-lg border p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span className="font-medium">Error Rate Monitor</span>
                  </div>
                  <Badge variant="outline">Error Rate</Badge>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Triggers when error rate exceeds 5%
                </div>
              </div>
              
              <div className="rounded-lg border p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Daily Token Limit</span>
                  </div>
                  <Badge variant="outline">Token Usage</Badge>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Triggers when daily token usage exceeds 10,000
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Alert History</CardTitle>
          <CardDescription>Recent alerts and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alert ID</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Threshold</TableHead>
                <TableHead>Actual Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Application</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alertHistoryData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.timestamp}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.threshold}</TableCell>
                  <TableCell>{item.value}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {item.status === "Active" && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Active
                        </Badge>
                      )}
                      {item.status === "Acknowledged" && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Acknowledged
                        </Badge>
                      )}
                      {item.status === "Resolved" && (
                        <Badge variant="outline" className="flex items-center gap-1 text-green-600 border-green-200 bg-green-50">
                          <Check className="h-3 w-3" />
                          Resolved
                        </Badge>
                      )}
                    </div>
                  </TableCell>
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
