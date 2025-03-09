import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, Loader2, RefreshCw } from "lucide-react";
import { DateRange } from "react-day-picker";
import { DateRangePicker, formatDateRange } from "@/components/ui/date-range-picker";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine
} from "recharts";
import { 
  supabaseService,
  SummarizationMessageCountComparison,
  SummarizationFeedback,
  SummarizationImpact
} from "@/services/supabase-service";

interface SummarizationEffectivenessTabProps {}

export function SummarizationEffectivenessTab({}: SummarizationEffectivenessTabProps) {
  // Date range state and picker state
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Data states for each chart
  const [messageCountData, setMessageCountData] = useState<SummarizationMessageCountComparison | null>(null);
  const [feedbackData, setFeedbackData] = useState<SummarizationFeedback | null>(null);
  const [impactData, setImpactData] = useState<SummarizationImpact | null>(null);

  // Load data on mount and when date range changes
  useEffect(() => {
    fetchData();
  }, []);

  // Handle date range changes
  const handleRangeChange = (range: DateRange) => {
    if (range.from && range.to) {
      setSelectedRange(range);
    }
  };

  // Apply date range and fetch data
  const handleApplyDateRange = () => {
    setDatePickerOpen(false);
    fetchData();
  };

  // Refresh data
  const handleRefresh = () => {
    fetchData();
  };

  // Fetch data from Supabase
  const fetchData = async () => {
    if (!selectedRange.from || !selectedRange.to) return;
    
    setIsLoading(true);
    setHasError(false);
    
    try {
      console.log("Fetching data with date range:", {
        from: selectedRange.from.toISOString(),
        to: selectedRange.to.toISOString()
      });
      
      // Add a timeout for the entire operation
      const timeout = setTimeout(() => {
        console.error("Data fetching timed out after 30 seconds");
        setIsLoading(false);
        setHasError(true);
      }, 30000);
      
      // Fetch data for all three charts
      const messageCountComparison = await supabaseService.getSummarizationMessageCountComparison(
        selectedRange.from,
        selectedRange.to
      );
      console.log("Message count comparison data:", messageCountComparison);
      setMessageCountData(messageCountComparison);
      
      const feedbackStats = await supabaseService.getSummarizationFeedback(
        selectedRange.from,
        selectedRange.to
      );
      console.log("Feedback stats data:", feedbackStats);
      setFeedbackData(feedbackStats);
      
      const impactMetrics = await supabaseService.getSummarizationImpact(
        selectedRange.from,
        selectedRange.to
      );
      console.log("Impact metrics data:", impactMetrics);
      setImpactData(impactMetrics);
      
      // Clear timeout and update last refresh time
      clearTimeout(timeout);
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Error fetching summarization effectiveness data:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Format message count comparison data for the bar chart
  const getMessageCountChartData = () => {
    if (!messageCountData) return [];
    
    return [
      { name: 'With Summary', value: messageCountData.withSummary, fill: '#8884d8' },
      { name: 'Without Summary', value: messageCountData.withoutSummary, fill: '#8884d8' }
    ];
  };

  // Format feedback data for the bar chart
  const getFeedbackChartData = () => {
    if (!feedbackData) return [];
    
    return [
      { name: 'Positive', value: feedbackData.positive, fill: '#4ade80' },  // Green
      { name: 'Neutral', value: feedbackData.neutral, fill: '#f59e0b' },    // Amber
      { name: 'Negative', value: feedbackData.negative, fill: '#ef4444' }   // Red
    ];
  };

  // Format impact data for the bar chart
  const getImpactChartData = () => {
    if (!impactData) return [];
    
    return [
      { name: 'Conversation Time', value: impactData.conversationTime },
      { name: 'Messages Count', value: impactData.messagesCount },
      { name: 'User Satisfaction', value: impactData.userSatisfaction },
      { name: 'Task Completion', value: impactData.taskCompletion }
    ];
  };

  // Format date range for display
  const displayRange = selectedRange.from && selectedRange.to 
    ? formatDateRange(selectedRange)
    : "Select date range";

  return (
    <div className="space-y-6">
      {/* Add controls at the top */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Summarization Effectiveness</h2>
        <div className="flex items-center gap-2">
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                {displayRange}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <DateRangePicker 
                initialDateRange={selectedRange} 
                onRangeChange={handleRangeChange} 
              />
              <div className="p-2 border-t text-right">
                <Button 
                  size="sm"
                  onClick={handleApplyDateRange}
                >
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Error state */}
      {hasError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600 font-medium">We encountered an error fetching the summarization data.</p>
          <p className="text-gray-600 mt-2">Please try refreshing the page or adjusting the date range.</p>
          <Button onClick={handleRefresh} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart 1: Conversation Length Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Conversation Length Comparison</CardTitle>
                <CardDescription>Average number of messages with and without summarization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {isLoading ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <>
                      <ResponsiveContainer width="100%" height="90%">
                        <BarChart 
                          data={getMessageCountChartData()}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" />
                          <YAxis 
                            label={{ value: 'Avg. Messages', angle: -90, position: 'insideLeft' }} 
                            domain={[0, 'auto']}
                          />
                          <Tooltip formatter={(value) => [`${value} messages`, 'Average']} />
                          <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="text-center text-sm text-muted-foreground mt-4">
                        Conversations with summarization features enabled are significantly shorter.
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Chart 2: Feedback on Summarization */}
            <Card>
              <CardHeader>
                <CardTitle>Feedback on Summarization</CardTitle>
                <CardDescription>User sentiment on conversations using summarization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {isLoading ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <>
                      <ResponsiveContainer width="100%" height="90%">
                        <BarChart 
                          data={getFeedbackChartData()}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" />
                          <YAxis 
                            label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} 
                            domain={[0, 100]}
                          />
                          <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {getFeedbackChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="text-center text-sm text-muted-foreground mt-4">
                        The majority of users provide positive feedback on summarization functionality.
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart 3: Summarization Impact */}
          <Card>
            <CardHeader>
              <CardTitle>Summarization Impact</CardTitle>
              <CardDescription>Percentage change in key metrics when summarization is used</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {isLoading ? (
                  <div className="h-full w-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height="90%">
                      <BarChart 
                        data={getImpactChartData()}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis 
                          type="number" 
                          domain={[-50, 50]} 
                          tickFormatter={(value) => `${value}%`}
                        />
                        <YAxis type="category" dataKey="name" width={100} />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Change']}
                          labelFormatter={(value) => `${value}`}
                        />
                        <ReferenceLine x={0} stroke="#000" />
                        <Bar 
                          dataKey="value" 
                          radius={[0, 4, 4, 0]}
                          fill="#10b981"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="text-center text-sm text-muted-foreground mt-4">
                      Negative values indicate a reduction (which is positive for time and message count), while positive values show improvement.
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
