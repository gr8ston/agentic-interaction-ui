import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
  ComposedChart,
  Scatter,
  Rectangle
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabaseService } from "@/services/supabase-service";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import {
  RefreshCw,
  Database,
  Calendar,
  AlertCircle,
  Loader2,
  CalendarIcon,
  Filter,
  Check
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { differenceInDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { DateRangePicker, formatDateRange } from "@/components/ui/date-range-picker";
import { 
  latencyVsTokensData,
  latencyByTimeData,
  latencyByAppData,
  summaryComparisonData,
  summaryFeedbackData,
  summaryMetricsData,
  latencyOverTimeData,
  latencyVsTokensByModelData
} from "./performanceData";
import { renderProviderBar } from "./chartRenderers";
import { chartConfig, providerChartConfig } from "./chartConfig";
import { Badge } from "@/components/ui/badge";

interface GeneralMetricsTabProps {
  onConversationSelect?: (conversationId: string) => void;
}

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label, unit = "" }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow text-sm">
        <p className="font-semibold">{label}</p>
        <p>{`${payload[0].name}: ${payload[0].value}${unit}`}</p>
      </div>
    );
  }
  return null;
};

export function GeneralMetricsTab({ onConversationSelect }: GeneralMetricsTabProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [latencyTrendData, setLatencyTrendData] = useState<any[]>([]);
  const [latencyModelData, setLatencyModelData] = useState<any[]>([]);
  const [tokenUsageTrendData, setTokenUsageTrendData] = useState<any[]>([]);
  const [tokenModelData, setTokenModelData] = useState<any[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [debugModalOpen, setDebugModalOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 6)),
    to: new Date(),
  });
  const [debugInfo, setDebugInfo] = useState<any>({
    latencyTrendsSQL: "",
    latencyDistributionSQL: "",
    tokenUsageSQL: "",
    latencyData: [],
    tokenData: [],
    chartSummary: {
      latency: {
        days: 0,
        minValue: 0,
        maxValue: 0,
        avgValue: 0,
        modelsCount: 0,
        models: []
      },
      tokens: {
        days: 0,
        totalTokens: 0,
        avgDailyTokens: 0,
        minDailyTokens: 0,
        maxDailyTokens: 0
      }
    }
  });
  const [providerLatencyData, setProviderLatencyData] = useState<any[]>([]);
  const [latencyDistributionData, setLatencyDistributionData] = useState<any[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [allModels, setAllModels] = useState<{model: string, provider: string}[]>([]);
  const [outlierData, setOutlierData] = useState<any[]>([]);
  const [outlierThreshold, setOutlierThreshold] = useState<number>(0);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Update selected models when distribution data changes
    if (latencyDistributionData.length > 0) {
      // Create a list of all available models
      const models = latencyDistributionData.map(item => ({
        model: item.model,
        provider: item.provider
      }));
      setAllModels(models);
      
      // Set default selected models
      const defaultModels = latencyDistributionData
        .filter(item => 
          item.model.includes('gpt-3.5-turbo') || 
          item.model.includes('gpt-4o') || 
          item.model.includes('claude-3-opus'))
        .map(item => item.model);
      
      // Only update if we haven't already set selections
      if (selectedModels.length === 0 && defaultModels.length > 0) {
        setSelectedModels(defaultModels);
      }
    }
  }, [latencyDistributionData]);

  const fetchData = async () => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      // Add a timeout of 30 seconds for the entire data fetch operation
      const timeout = setTimeout(() => {
        console.error("Data fetching timed out after 30 seconds");
        setIsLoading(false);
        setHasError(true);
      }, 30000);
      
      // Calculate the number of days in the selected range
      if (!selectedRange.from || !selectedRange.to) return;
      
      // Log the actual date range being used for debugging
      console.log("Using date range:", {
        from: selectedRange.from.toISOString(),
        to: selectedRange.to.toISOString(),
        days: differenceInDays(selectedRange.to, selectedRange.from) + 1
      });
      
      const daysDiff = differenceInDays(selectedRange.to, selectedRange.from) + 1;
      
      // Fetch latency trends with date range
      try {
        const latencyResponse = await supabaseService.getLatencyTrends(
          daysDiff, 
          selectedRange.from,
          selectedRange.to
        );
        setLatencyTrendData(latencyResponse.trendData);
        setLatencyModelData(latencyResponse.modelData);
        
        // Update provider latency data directly using the model data from the response
        const formattedProviderData = latencyResponse.modelData.map(item => ({
          provider: item.provider,
          model: item.model,
          latency: item.avgLatency
        }));
        setProviderLatencyData(formattedProviderData);
      } catch (err) {
        console.error("Error fetching latency trends:", err);
      }
      
      // Fetch latency distribution data for box plot
      try {
        const distributionResponse = await supabaseService.getLatencyDistribution(
          selectedRange.from,
          selectedRange.to
        );
        setLatencyDistributionData(distributionResponse.distributionData);
      } catch (err) {
        console.error("Error fetching latency distribution:", err);
      }
      
      // Fetch outlier data
      try {
        const outliersResponse = await supabaseService.getLatencyOutliers(
          selectedRange.from,
          selectedRange.to
        );
        setOutlierData(outliersResponse.outlierData);
        setOutlierThreshold(outliersResponse.thresholdValue || 0);
      } catch (err) {
        console.error("Error fetching outliers:", err);
      }

      // Fetch token usage trends with date range
      try {
        const tokenResponse = await supabaseService.getTokenUsageTrends(
          daysDiff,
          selectedRange.from,
          selectedRange.to
        );
        setTokenUsageTrendData(tokenResponse.trendData);
        setTokenModelData(tokenResponse.modelData);
      } catch (err) {
        console.error("Error fetching token usage trends:", err);
      }

      // Clear the timeout since we're done
      clearTimeout(timeout);
      
      // Update debug info with the actual dates being used
      setDebugInfo({
        latencyTrendsSQL: `
-- Latency Trends SQL Query (Average latency by model)
SELECT 
    llm_provider,
    llm_model,
    AVG(latency_ms) AS avg_latency_ms
FROM messages
WHERE created_at >= '${selectedRange.from.toISOString()}'
AND created_at <= '${selectedRange.to.toISOString()}'
AND latency_ms IS NOT NULL
GROUP BY llm_provider, llm_model
ORDER BY avg_latency_ms DESC;`,

        latencyDistributionSQL: `
-- Latency Distribution Query (Box plot data)
SELECT 
    llm_provider,
    llm_model,
    MIN(latency_ms) AS min_latency,
    MAX(latency_ms) AS max_latency,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY latency_ms) AS median_latency,
    PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY latency_ms) AS q1_latency,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY latency_ms) AS q3_latency
FROM messages
WHERE latency_ms IS NOT NULL
AND created_at >= '${selectedRange.from.toISOString()}'
AND created_at <= '${selectedRange.to.toISOString()}'
GROUP BY llm_provider, llm_model
ORDER BY median_latency DESC;`,

        outliersSQL: `
-- Outliers Query (Latency above 95th percentile)
WITH threshold AS (
  SELECT PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY latency_ms) AS threshold_value
  FROM messages
  WHERE latency_ms IS NOT NULL
  AND created_at >= '${selectedRange.from.toISOString()}'
  AND created_at <= '${selectedRange.to.toISOString()}'
)
SELECT 
  m.message_id, 
  m.conversation_id,
  m.created_at,
  m.latency_ms,
  m.llm_provider,
  m.llm_model,
  m.tokens_consumed,
  c.app_name
FROM messages m
JOIN conversations c ON m.conversation_id = c.conversation_id
JOIN threshold t ON m.latency_ms >= t.threshold_value
WHERE m.latency_ms IS NOT NULL
AND m.created_at >= '${selectedRange.from.toISOString()}'
AND m.created_at <= '${selectedRange.to.toISOString()}'
ORDER BY m.latency_ms DESC
LIMIT 10;`,

        tokenUsageSQL: `
-- Token Usage SQL Query (Tokens by model)
SELECT 
    llm_provider,
    llm_model,
    AVG(
      CASE WHEN tokens_consumed::text LIKE '{%' 
      THEN (tokens_consumed->'input')::int + (tokens_consumed->'output')::int
      ELSE tokens_consumed::int END
    ) AS avg_tokens,
    SUM(
      CASE WHEN tokens_consumed::text LIKE '{%' 
      THEN (tokens_consumed->'input')::int + (tokens_consumed->'output')::int
      ELSE tokens_consumed::int END
    ) AS total_tokens
FROM messages
WHERE created_at >= '${selectedRange.from.toISOString()}'
AND created_at <= '${selectedRange.to.toISOString()}'
AND tokens_consumed IS NOT NULL
GROUP BY llm_provider, llm_model
ORDER BY total_tokens DESC;`,

        chartSummary: {
          latency: {
            days: daysDiff,
            minValue: Math.min(...latencyTrendData.map(item => item.value)),
            maxValue: Math.max(...latencyTrendData.map(item => item.value)),
            avgValue: Math.round(latencyTrendData.reduce((sum, item) => sum + item.value, 0) / latencyTrendData.length),
            modelsCount: latencyModelData.length,
            models: latencyModelData.map(m => m.model)
          },
          tokens: {
            days: daysDiff,
            totalTokens: tokenUsageTrendData.reduce((sum, item) => sum + item.tokens, 0),
            avgDailyTokens: Math.round(tokenUsageTrendData.reduce((sum, item) => sum + item.tokens, 0) / tokenUsageTrendData.length),
            minDailyTokens: Math.min(...tokenUsageTrendData.map(item => item.tokens)),
            maxDailyTokens: Math.max(...tokenUsageTrendData.map(item => item.tokens))
          }
        }
      });
      
      // Update lastRefresh
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Error fetching performance data:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    console.log("Manually refreshing performance metrics data");
    fetchData();
  };

  const handleRangeChange = (range: DateRange) => {
    console.log("Date range changed:", range);
    if (range.from && range.to) {
      setSelectedRange(range);
      // Don't auto close the popover and fetch data when range changes
      // Let the user apply their selection with the button
    }
  };

  const handleApplyDateRange = () => {
    console.log("Applying date range:", selectedRange);
    // Close the date picker and fetch data with the selected range
    setDatePickerOpen(false);
    fetchData();
  };

  const handleOutlierClick = (data: any) => {
    if (onConversationSelect && data && data.conversationId) {
      // Pass the conversation ID, not the message ID
      console.log("Selected conversation for details:", data.conversationId);
      onConversationSelect(data.conversationId);
    } else {
      console.warn("Missing conversation ID in outlier data:", data);
    }
  };

  const displayRange = selectedRange.from && selectedRange.to 
    ? formatDateRange(selectedRange)
    : "Select date range";

  // Function to toggle model selection
  const toggleModelSelection = (model: string) => {
    setSelectedModels(prev => 
      prev.includes(model) 
        ? prev.filter(m => m !== model) 
        : [...prev, model]
    );
  };

  // Function to select all models
  const selectAllModels = () => {
    setSelectedModels(allModels.map(m => m.model));
  };

  // Function to clear all selections
  const clearModelSelection = () => {
    setSelectedModels([]);
  };

  // Get filtered distribution data
  const filteredDistributionData = latencyDistributionData.filter(
    item => selectedModels.includes(item.model)
  );

  if (hasError) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">Performance Metrics</h2>
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
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>
        
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Data</h3>
          <p className="text-red-700 mb-4">
            We encountered an error while loading the performance data. This could be due to:
          </p>
          <ul className="text-red-700 text-left max-w-md mx-auto mb-4">
            <li>• High data volume in the selected date range</li>
            <li>• Temporary database connection issues</li>
            <li>• Request timeout due to complex calculations</li>
          </ul>
          <Button onClick={handleRefresh} className="bg-red-600 hover:bg-red-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Performance Metrics</h2>
        <div className="flex items-center gap-2">
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                {displayRange}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 max-w-[calc(100vw-2rem)] md:max-w-none" align="end">
              <div className="p-1 text-xs text-right">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={handleApplyDateRange}
                >
                  Apply Selection
                </Button>
              </div>
              <DateRangePicker 
                initialDateRange={selectedRange} 
                onRangeChange={handleRangeChange} 
                showBorder={false}
              />
            </PopoverContent>
          </Popover>
          
          <Dialog open={debugModalOpen} onOpenChange={setDebugModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Database className="h-4 w-4 mr-2" />
                Debug Data
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Debug Information</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="sql">
                <TabsList>
                  <TabsTrigger value="sql">SQL Queries</TabsTrigger>
                  <TabsTrigger value="data">Data</TabsTrigger>
                  <TabsTrigger value="summary">Chart Summary</TabsTrigger>
                </TabsList>
                <TabsContent value="sql" className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Latency Trends SQL</h3>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                      {debugInfo.latencyTrendsSQL}
                    </pre>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Latency Distribution SQL</h3>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                      {debugInfo.latencyDistributionSQL}
                    </pre>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Token Usage SQL</h3>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                      {debugInfo.tokenUsageSQL}
                    </pre>
                  </div>
                  
                  <div className="space-y-2 mt-6">
                    <h3 className="text-lg font-medium">SQL Execution Details</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Latency Query Notes</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          <li>Query fetches latency data points in the selected date range</li>
                          <li>Data is grouped by provider and model to calculate averages</li>
                          <li>Only system/agent messages are considered (user messages don't have latency)</li>
                          <li>Null values are excluded from calculations</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium">Token Query Notes</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          <li>Query fetches all tokens data in the selected date range</li>
                          <li>For JSON token structure, both input and output tokens are summed</li>
                          <li>Data is grouped by provider and model to show consumption patterns</li>
                          <li>Only system/agent messages are considered (user messages have no tokens)</li>
                        </ul>
                      </div>
                      <div className="text-sm text-muted-foreground mt-4">
                        <p>* If no data is available in your selected date range, mock data may be shown.</p>
                        <p>* Check browser console for detailed logs during data fetching.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="data" className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Latency Trend Data</h3>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                      {JSON.stringify(latencyTrendData, null, 2)}
                    </pre>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Latency Distribution Data</h3>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                      {JSON.stringify(latencyDistributionData, null, 2)}
                    </pre>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Token Usage Data</h3>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                      {JSON.stringify(tokenUsageTrendData, null, 2)}
                    </pre>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Outlier Data</h3>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                      {JSON.stringify(outlierData, null, 2)}
                    </pre>
                  </div>
                </TabsContent>
                <TabsContent value="summary" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Latency Trends Summary</h3>
                      <div className="space-y-2">
                        <p><strong>Date Range:</strong> {selectedRange.from?.toLocaleDateString()} to {selectedRange.to?.toLocaleDateString()}</p>
                        <p><strong>Days Included:</strong> {debugInfo.chartSummary.latency.days}</p>
                        <p><strong>Min Latency:</strong> {debugInfo.chartSummary.latency.minValue}ms</p>
                        <p><strong>Max Latency:</strong> {debugInfo.chartSummary.latency.maxValue}ms</p>
                        <p><strong>Avg Latency:</strong> {debugInfo.chartSummary.latency.avgValue}ms</p>
                        <p><strong>Models Count:</strong> {debugInfo.chartSummary.latency.modelsCount}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Token Usage Summary</h3>
                      <div className="space-y-2">
                        <p><strong>Date Range:</strong> {selectedRange.from?.toLocaleDateString()} to {selectedRange.to?.toLocaleDateString()}</p>
                        <p><strong>Days Included:</strong> {debugInfo.chartSummary.tokens.days}</p>
                        <p><strong>Total Tokens:</strong> {debugInfo.chartSummary.tokens.totalTokens.toLocaleString()}</p>
                        <p><strong>Avg Daily Tokens:</strong> {debugInfo.chartSummary.tokens.avgDailyTokens.toLocaleString()}</p>
                        <p><strong>Min Daily Tokens:</strong> {debugInfo.chartSummary.tokens.minDailyTokens.toLocaleString()}</p>
                        <p><strong>Max Daily Tokens:</strong> {debugInfo.chartSummary.tokens.maxDailyTokens.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Distribution Data Summary</h3>
                    <div className="space-y-2">
                      <p><strong>Models with Distribution Data:</strong> {latencyDistributionData.length}</p>
                      <p><strong>Data Point Types:</strong> min, q1, median, q3, max per model</p>
                      <div className="mt-2">
                        <h4 className="font-medium">Sample Values:</h4>
                        {latencyDistributionData.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="text-xs mt-1 bg-gray-50 p-2 rounded">
                            <p><strong>Model:</strong> {item.model} ({item.provider})</p>
                            <p><strong>Min:</strong> {item.min}ms | <strong>Q1:</strong> {item.q1}ms | <strong>Median:</strong> {item.median}ms | <strong>Q3:</strong> {item.q3}ms | <strong>Max:</strong> {item.max}ms</p>
                          </div>
                        ))}
                        {latencyDistributionData.length > 3 && (
                          <p className="text-xs text-gray-500 mt-1">...and {latencyDistributionData.length - 3} more models</p>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <span className="text-xs text-gray-500">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Latency Trends</CardTitle>
            <CardDescription>Average response time ({displayRange})</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {isLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <LineChart
                    data={latencyTrendData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="var(--color-value)" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ChartContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Token Usage</CardTitle>
            <CardDescription>Daily token consumption ({displayRange})</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <AreaChart
                  data={tokenUsageTrendData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
          <CardHeader>
            <CardTitle>Average Latency by Provider/Model</CardTitle>
            <CardDescription>Comparison of response times across providers and models</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={providerChartConfig} className="h-full w-full">
                <BarChart
                  data={providerLatencyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="model" />
                  <YAxis label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft' }} />
                  <ChartTooltip 
                    content={
                      <ChartTooltipContent 
                        labelFormatter={(value) => `Model: ${value}`}
                        formatter={(value, name, props) => {
                          return [`${value} ms`, `Provider: ${props.payload.provider}`];
                        }}
                      />
                    } 
                  />
                  <Bar 
                    dataKey="latency" 
                    name="Latency" 
                    fill="var(--color-latency)" 
                    shape={renderProviderBar}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Latency Distribution by Provider/Model</CardTitle>
              <CardDescription>Box plot showing min, max, median, and quartiles</CardDescription>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {selectedModels.length} models
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0" align="end">
                <div className="p-2 border-b">
                  <div className="font-medium">Filter Models</div>
                  <div className="text-xs text-gray-500">Select which models to display</div>
                </div>
                <div className="p-2 border-b">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={selectAllModels}>Select All</Button>
                    <Button variant="outline" size="sm" onClick={clearModelSelection}>Clear</Button>
                  </div>
                </div>
                <div className="p-2 max-h-[300px] overflow-auto">
                  {allModels.map((modelItem, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center py-1 hover:bg-gray-50 cursor-pointer px-2 rounded"
                      onClick={() => toggleModelSelection(modelItem.model)}
                    >
                      <div className="w-5 h-5 flex items-center justify-center">
                        {selectedModels.includes(modelItem.model) && <Check className="h-4 w-4 text-brand-primary" />}
                      </div>
                      <div className="ml-2">
                        <div className="text-sm font-medium">{modelItem.model}</div>
                        <div className="text-xs text-gray-500">{modelItem.provider}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {isLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredDistributionData.length === 0 ? (
                <div className="h-full w-full flex items-center justify-center">
                  <p className="text-gray-500">
                    {latencyDistributionData.length === 0 
                      ? "No distribution data available" 
                      : "Please select at least one model to display"}
                  </p>
                </div>
              ) : (
                <div className="relative h-full w-full">
                  <svg viewBox={`0 0 800 ${filteredDistributionData.length * 50 + 50}`} className="h-full w-full">
                    {/* Add X axis ticks */}
                    <g transform="translate(120, 20)">
                      {/* Find min and max values for scaling */}
                      {(() => {
                        const allValues = filteredDistributionData.flatMap(
                          item => [item.min, item.q1, item.median, item.q3, item.max]
                        );
                        const minVal = Math.min(...allValues);
                        const maxVal = Math.max(...allValues);
                        const range = maxVal - minVal;
                        const padding = range * 0.1; // Add 10% padding
                        
                        const xScale = (val: number) => (val - minVal + padding) * 650 / (range + padding * 2);
                        
                        // Create axis ticks
                        const ticks = [
                          minVal,
                          minVal + range * 0.25,
                          minVal + range * 0.5,
                          minVal + range * 0.75,
                          maxVal
                        ].map(v => Math.round(v));
                        
                        return (
                          <>
                            {/* X axis line */}
                            <line 
                              x1="0" 
                              y1={filteredDistributionData.length * 50 + 10} 
                              x2="680" 
                              y2={filteredDistributionData.length * 50 + 10} 
                              stroke="#cbd5e1" 
                              strokeWidth="1"
                            />
                            
                            {/* X axis ticks */}
                            {ticks.map((tick, i) => (
                              <g key={i}>
                                <line 
                                  x1={xScale(tick)} 
                                  y1={filteredDistributionData.length * 50 + 10} 
                                  x2={xScale(tick)} 
                                  y2={filteredDistributionData.length * 50 + 15} 
                                  stroke="#cbd5e1" 
                                  strokeWidth="1"
                                />
                                <text 
                                  x={xScale(tick)} 
                                  y={filteredDistributionData.length * 50 + 30} 
                                  textAnchor="middle" 
                                  fontSize="12" 
                                  fill="#64748b"
                                >
                                  {tick}
                                </text>
                              </g>
                            ))}
                            
                            {/* X axis label */}
                            <text 
                              x="340" 
                              y={filteredDistributionData.length * 50 + 45} 
                              textAnchor="middle" 
                              fontSize="12" 
                              fill="#334155"
                              fontWeight="500"
                            >
                              Latency (ms)
                            </text>
                            
                            {/* Draw box plots for each model */}
                            {filteredDistributionData.map((item, idx) => {
                              // Determine color based on provider
                              let color = "#8B5CF6"; // Default color
                              switch (item.provider) {
                                case "OpenAI":
                                  color = "#10a37f"; // OpenAI green
                                  break;
                                case "anthropic":
                                  color = "#b622ff"; // Anthropic purple
                                  break;
                                case "azure_openai":
                                  color = "#0078d4"; // Azure blue
                                  break;
                                case "Google":
                                  color = "#4285F4"; // Google blue
                                  break;
                                case "Mistral":
                                  color = "#7c3aed"; // Mistral violet
                                  break;
                                case "Cohere":
                                  color = "#ff5a5f"; // Cohere red
                                  break;
                                default:
                                  color = "#64748b"; // Default slate
                              }
                              
                              const y = idx * 50 + 25;
                              
                              return (
                                <g key={idx}>
                                  {/* Model label */}
                                  <text 
                                    x="-10" 
                                    y={y + 5} 
                                    textAnchor="end" 
                                    fontSize="12" 
                                    fill="#334155"
                                    fontWeight="500"
                                  >
                                    {item.model}
                                  </text>
                                  
                                  {/* Provider label */}
                                  <text 
                                    x="-10" 
                                    y={y + 20} 
                                    textAnchor="end" 
                                    fontSize="10" 
                                    fill="#64748b"
                                  >
                                    {item.provider}
                                  </text>
                                  
                                  {/* Min-Max line (whisker) */}
                                  <line 
                                    x1={xScale(item.min)} 
                                    y1={y} 
                                    x2={xScale(item.max)} 
                                    y2={y} 
                                    stroke="#94a3b8" 
                                    strokeWidth="1"
                                  />
                                  
                                  {/* Q1-Q3 box */}
                                  <rect 
                                    x={xScale(item.q1)} 
                                    y={y - 10} 
                                    width={xScale(item.q3) - xScale(item.q1)} 
                                    height="20" 
                                    fill={`${color}33`} 
                                    stroke={color}
                                    strokeWidth="1"
                                    rx="2"
                                  />
                                  
                                  {/* Median line */}
                                  <line 
                                    x1={xScale(item.median)} 
                                    y1={y - 10} 
                                    x2={xScale(item.median)} 
                                    y2={y + 10} 
                                    stroke={color} 
                                    strokeWidth="2"
                                  />
                                  
                                  {/* Min marker */}
                                  <circle 
                                    cx={xScale(item.min)} 
                                    cy={y} 
                                    r="3" 
                                    fill="#94a3b8"
                                  />
                                  
                                  {/* Max marker */}
                                  <circle 
                                    cx={xScale(item.max)} 
                                    cy={y} 
                                    r="3" 
                                    fill="#94a3b8"
                                  />
                                </g>
                              );
                            })}
                          </>
                        );
                      })()}
                    </g>
                  </svg>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Performance Outliers</span>
            {outlierThreshold > 0 && (
              <Badge variant="outline" className="ml-2 text-xs">
                Threshold: {outlierThreshold}ms (95th percentile)
              </Badge>
            )}
          </CardTitle>
          <CardDescription>Conversations with unusual latency (click to view details)</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : outlierData.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-gray-500">No outliers found in the selected date range</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-medium p-2">ID</th>
                    <th className="text-left font-medium p-2">Timestamp</th>
                    <th className="text-left font-medium p-2">Latency (ms)</th>
                    <th className="text-left font-medium p-2">Model</th>
                    <th className="text-left font-medium p-2">Tokens</th>
                    <th className="text-left font-medium p-2">Resource</th>
                    <th className="text-left font-medium p-2">Application</th>
                  </tr>
                </thead>
                <tbody>
                  {outlierData.map((item) => (
                    <tr 
                      key={item.id} 
                      className="border-b hover:bg-gray-50 cursor-pointer" 
                      onClick={() => handleOutlierClick(item)}
                    >
                      <td className="p-2 text-blue-600">{item.id.substring(0, 8)}...</td>
                      <td className="p-2">{item.timestamp}</td>
                      <td className="p-2 font-medium">{item.latency}</td>
                      <td className="p-2">{item.model || '—'}</td>
                      <td className="p-2">{item.tokens ? item.tokens.toLocaleString() : '—'}</td>
                      <td className="p-2">
                        <span 
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            item.resource.includes('token') ? 'bg-amber-100 text-amber-800' : 
                            item.resource.includes('content') ? 'bg-blue-100 text-blue-800' : 
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.resource}
                        </span>
                      </td>
                      <td className="p-2">{item.app}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
