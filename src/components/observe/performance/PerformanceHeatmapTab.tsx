import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis,
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, CalendarIcon, Loader2, RefreshCw } from "lucide-react";
import { chartConfig, extendedChartConfig, providerChartConfig } from "./chartConfig";
import { 
  latencyByTimeData, 
  latencyByAppData,
  latencyVsTokensByModelData
} from "./performanceData";
import { renderProviderScatterShape } from "./chartRenderers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { DateRangePicker, formatDateRange } from "@/components/ui/date-range-picker";
import { 
  supabaseService,
  LatencyByTimeOfDay,
  LatencyByApp,
  LatencyByProviderOverTime,
  TokenVsLatencyDataPoint
} from "@/services/supabase-service";
import { Badge } from "@/components/ui/badge";

interface PerformanceHeatmapTabProps {
  onConversationSelect?: (conversationId: string) => void;
}

export function PerformanceHeatmapTab({ onConversationSelect }: PerformanceHeatmapTabProps) {
  // Day of week filter state
  const [selectedDays, setSelectedDays] = useState<string[]>(["monday", "tuesday", "wednesday", "thursday", "friday"]);
  
  // Group by provider/model state
  const [groupBy, setGroupBy] = useState<"provider" | "model">("provider");
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Chart data states
  const [timeOfDayData, setTimeOfDayData] = useState<any[]>([]);
  const [appLatencyData, setAppLatencyData] = useState<any[]>([]);
  const [providerLatencyData, setProviderLatencyData] = useState<any[]>([]);
  const [tokenVsLatencyData, setTokenVsLatencyData] = useState<TokenVsLatencyDataPoint[]>([]);
  
  // Date range state and picker state
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  
  // Add state for selected models and providers
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [availableProviders, setAvailableProviders] = useState<string[]>([]);
  
  // Load data on mount and when date range changes
  useEffect(() => {
    fetchData();
  }, []);
  
  // Toggle day selection
  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };
  
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
      // Add a timeout for the entire operation
      const timeout = setTimeout(() => {
        console.error("Data fetching timed out after 30 seconds");
        setIsLoading(false);
        setHasError(true);
      }, 30000);
      
      // Fetch time of day data
      const timeData = await supabaseService.getLatencyByTimeOfDay(
        selectedRange.from, 
        selectedRange.to
      );
      setTimeOfDayData(timeData);
      
      // Fetch latency by application data
      const appData = await supabaseService.getLatencyByApp(
        selectedRange.from,
        selectedRange.to
      );
      setAppLatencyData(appData);
      
      // Fetch latency over time by provider data
      const providerData = await supabaseService.getLatencyOverTimeByProvider(
        selectedRange.from,
        selectedRange.to
      );
      setProviderLatencyData(providerData);
      
      // Fetch token consumption vs latency data
      const tokenLatencyData = await supabaseService.getTokenVsLatencyData(
        selectedRange.from,
        selectedRange.to
      );
      setTokenVsLatencyData(tokenLatencyData);
      
      // Clear timeout and update last refresh time
      clearTimeout(timeout);
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Error fetching performance heatmap data:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format date range for display
  const displayRange = selectedRange.from && selectedRange.to 
    ? formatDateRange(selectedRange)
    : "Select date range";
  
  // Update availableModels and availableProviders when data changes
  useEffect(() => {
    if (tokenVsLatencyData.length > 0) {
      // Extract unique models and providers
      const models = Array.from(new Set(tokenVsLatencyData.map(item => item.model)));
      const providers = Array.from(new Set(tokenVsLatencyData.map(item => item.provider)));
      
      setAvailableModels(models);
      setAvailableProviders(providers);
      
      // If no selections yet, select all by default
      if (selectedModels.length === 0) {
        setSelectedModels(models);
      }
      if (selectedProviders.length === 0) {
        setSelectedProviders(providers);
      }
    }
  }, [tokenVsLatencyData]);
  
  // Toggle model selection
  const toggleModelSelection = (model: string) => {
    if (selectedModels.includes(model)) {
      // If it's the only selected model, don't allow deselection
      if (selectedModels.length === 1) return;
      setSelectedModels(selectedModels.filter(m => m !== model));
    } else {
      setSelectedModels([...selectedModels, model]);
    }
  };
  
  // Toggle provider selection
  const toggleProviderSelection = (provider: string) => {
    if (selectedProviders.includes(provider)) {
      // If it's the only selected provider, don't allow deselection
      if (selectedProviders.length === 1) return;
      setSelectedProviders(selectedProviders.filter(p => p !== provider));
    } else {
      setSelectedProviders([...selectedProviders, provider]);
    }
  };
  
  // Select all models
  const selectAllModels = () => {
    setSelectedModels([...availableModels]);
  };
  
  // Select all providers
  const selectAllProviders = () => {
    setSelectedProviders([...availableProviders]);
  };
  
  // Clear model selection (but keep at least one)
  const clearModelSelection = () => {
    if (availableModels.length > 0) {
      setSelectedModels([availableModels[0]]);
    }
  };
  
  // Clear provider selection (but keep at least one)
  const clearProviderSelection = () => {
    if (availableProviders.length > 0) {
      setSelectedProviders([availableProviders[0]]);
    }
  };
  
  // Filter data based on selected models and providers
  const getFilteredTokenVsLatencyData = () => {
    return tokenVsLatencyData.filter(item => 
      selectedModels.includes(item.model) && 
      selectedProviders.includes(item.provider)
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Add controls at the top */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Performance Patterns</h2>
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
          <p className="text-red-600 font-medium">We encountered an error fetching the heatmap data.</p>
          <p className="text-gray-600 mt-2">Please try refreshing the page or adjusting the date range.</p>
          <Button onClick={handleRefresh} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      ) : (
        /* Rest of the component with charts */
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Latency by Time of Day</CardTitle>
                <CardDescription>Performance across different hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button 
                    variant={selectedDays.includes("monday") ? "default" : "outline"} 
                    size="sm"
                    onClick={() => toggleDay("monday")}
                  >
                    Monday
                  </Button>
                  <Button 
                    variant={selectedDays.includes("tuesday") ? "default" : "outline"} 
                    size="sm"
                    onClick={() => toggleDay("tuesday")}
                  >
                    Tuesday
                  </Button>
                  <Button 
                    variant={selectedDays.includes("wednesday") ? "default" : "outline"} 
                    size="sm"
                    onClick={() => toggleDay("wednesday")}
                  >
                    Wednesday
                  </Button>
                  <Button 
                    variant={selectedDays.includes("thursday") ? "default" : "outline"} 
                    size="sm"
                    onClick={() => toggleDay("thursday")}
                  >
                    Thursday
                  </Button>
                  <Button 
                    variant={selectedDays.includes("friday") ? "default" : "outline"} 
                    size="sm"
                    onClick={() => toggleDay("friday")}
                  >
                    Friday
                  </Button>
                  <Button 
                    variant={selectedDays.includes("saturday") ? "default" : "outline"} 
                    size="sm"
                    onClick={() => toggleDay("saturday")}
                  >
                    Saturday
                  </Button>
                  <Button 
                    variant={selectedDays.includes("sunday") ? "default" : "outline"} 
                    size="sm"
                    onClick={() => toggleDay("sunday")}
                  >
                    Sunday
                  </Button>
                </div>
                
                <div className="h-80">
                  {isLoading ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <ChartContainer config={extendedChartConfig} className="h-full w-full">
                      <LineChart
                        data={timeOfDayData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="hour" />
                        <YAxis domain={['auto', 'auto']} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        
                        {selectedDays.includes("monday") && (
                          <Line 
                            type="monotone" 
                            dataKey="monday" 
                            stroke={extendedChartConfig.monday.color}
                            activeDot={{ r: 8 }} 
                          />
                        )}
                        {selectedDays.includes("tuesday") && (
                          <Line 
                            type="monotone" 
                            dataKey="tuesday" 
                            stroke={extendedChartConfig.tuesday.color}
                            activeDot={{ r: 8 }} 
                          />
                        )}
                        {selectedDays.includes("wednesday") && (
                          <Line 
                            type="monotone" 
                            dataKey="wednesday" 
                            stroke={extendedChartConfig.wednesday.color}
                            activeDot={{ r: 8 }} 
                          />
                        )}
                        {selectedDays.includes("thursday") && (
                          <Line 
                            type="monotone" 
                            dataKey="thursday" 
                            stroke={extendedChartConfig.thursday.color}
                            activeDot={{ r: 8 }} 
                          />
                        )}
                        {selectedDays.includes("friday") && (
                          <Line 
                            type="monotone" 
                            dataKey="friday" 
                            stroke={extendedChartConfig.friday.color}
                            activeDot={{ r: 8 }} 
                          />
                        )}
                        {selectedDays.includes("saturday") && (
                          <Line 
                            type="monotone" 
                            dataKey="saturday" 
                            stroke={extendedChartConfig.saturday.color}
                            activeDot={{ r: 8 }} 
                          />
                        )}
                        {selectedDays.includes("sunday") && (
                          <Line 
                            type="monotone" 
                            dataKey="sunday" 
                            stroke={extendedChartConfig.sunday.color}
                            activeDot={{ r: 8 }} 
                          />
                        )}
                      </LineChart>
                    </ChartContainer>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Latency by Application</CardTitle>
                <CardDescription>Performance distribution across applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {isLoading ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <ChartContainer config={chartConfig} className="h-full w-full">
                      <ScatterChart
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                      >
                        <CartesianGrid />
                        <XAxis type="category" dataKey="name" name="Application" />
                        <YAxis 
                          type="number" 
                          dataKey="median" 
                          name="Latency (ms)" 
                          domain={['auto', 'auto']} 
                        />
                        <ZAxis range={[100, 100]} />
                        <Tooltip 
                          cursor={{ strokeDasharray: '3 3' }} 
                          content={
                            <ChartTooltipContent 
                              formatter={(value, name) => {
                                if (name === "name") return [value, 'Application'];
                                
                                // Handle numeric values with proper type checking
                                if (typeof value === 'number') {
                                  if (name === "median") return [`${value.toFixed(0)} ms`, 'Median'];
                                  if (name === "q1") return [`${value.toFixed(0)} ms`, '25th Percentile'];
                                  if (name === "q3") return [`${value.toFixed(0)} ms`, '75th Percentile'];
                                  if (name === "min") return [`${value.toFixed(0)} ms`, 'Min'];
                                  if (name === "max") return [`${value.toFixed(0)} ms`, 'Max'];
                                  return [`${value.toFixed(0)}`, name];
                                }
                                
                                return [value, name];
                              }}
                            />
                          }
                        />
                        <Scatter 
                          name="Median" 
                          data={appLatencyData} 
                          fill="#8884d8"
                          line={{ stroke: '#ddd', strokeWidth: 1, strokeDasharray: '5 5' }}
                          shape={(props) => {
                            const { cx, cy, payload } = props;
                            
                            // Scale factor for visualization
                            const scaleFactor = 40;
                            
                            // Calculate y positions for min, max, q1, and q3
                            const minY = cy + (payload.median - payload.min) / scaleFactor * 100;
                            const maxY = cy - (payload.max - payload.median) / scaleFactor * 100;
                            const q1Y = cy + (payload.median - payload.q1) / scaleFactor * 100;
                            const q3Y = cy - (payload.q3 - payload.median) / scaleFactor * 100;
                            
                            return (
                              <g>
                                {/* Min-Max line */}
                                <line 
                                  x1={cx} 
                                  y1={maxY} 
                                  x2={cx} 
                                  y2={minY} 
                                  stroke="#94a3b8" 
                                  strokeWidth={1} 
                                />
                                
                                {/* Q1-Q3 box */}
                                <rect 
                                  x={cx - 10} 
                                  y={q3Y} 
                                  width={20} 
                                  height={q1Y - q3Y} 
                                  fill="rgba(148, 163, 184, 0.2)" 
                                  stroke="#94a3b8" 
                                />
                                
                                {/* Median point */}
                                <circle 
                                  cx={cx} 
                                  cy={cy} 
                                  r={6} 
                                  fill={chartConfig.value.color} 
                                  stroke="#fff" 
                                  strokeWidth={2} 
                                />
                                
                                {/* Tooltips for extreme values */}
                                <circle 
                                  cx={cx} 
                                  cy={minY} 
                                  r={3} 
                                  fill="#94a3b8" 
                                />
                                <circle 
                                  cx={cx} 
                                  cy={maxY} 
                                  r={3} 
                                  fill="#94a3b8" 
                                />
                              </g>
                            );
                          }}
                        />
                      </ScatterChart>
                    </ChartContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Latency Over Time by Provider</CardTitle>
                <CardDescription>Real-time performance trends across all LLM providers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {isLoading ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <ChartContainer config={providerChartConfig} className="h-full w-full">
                      <LineChart
                        data={providerLatencyData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="date" />
                        <YAxis domain={['auto', 'auto']} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        
                        {/* Dynamically create line for each provider */}
                        {providerLatencyData.length > 0 && 
                          Object.keys(providerLatencyData[0])
                            .filter(key => key !== 'date')
                            .map((provider, index) => {
                              // Calculate a color based on index if provider is not in the config
                              const colors = [
                                "#10a37f",  // green
                                "#b622ff",  // purple
                                "#4285F4",  // blue
                                "#7c3aed",  // violet
                                "#ff5a5f",  // red
                                "#f59e0b",  // amber
                                "#ec4899",  // pink
                                "#14b8a6",  // teal
                                "#6366f1",  // indigo
                                "#f43f5e",  // rose
                              ];
                              
                              const color = colors[index % colors.length];
                              
                              return (
                                <Line 
                                  key={provider}
                                  type="monotone" 
                                  dataKey={provider} 
                                  name={provider}
                                  stroke={color}
                                  activeDot={{ r: 8 }} 
                                  connectNulls={false}
                                />
                              );
                            })
                        }
                      </LineChart>
                    </ChartContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Latency vs Tokens Consumed</CardTitle>
                  <CardDescription>Real-time relationship between token usage and performance</CardDescription>
                </div>
                <Select 
                  defaultValue="provider" 
                  onValueChange={(value) => setGroupBy(value as "provider" | "model")}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Group by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="provider">Group by Provider</SelectItem>
                    <SelectItem value="model">Group by Model</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                {/* Add filter controls */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Filter by {groupBy === "provider" ? "Models" : "Providers"}</h4>
                    <div className="space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={groupBy === "provider" ? selectAllModels : selectAllProviders}
                      >
                        Select All
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={groupBy === "provider" ? clearModelSelection : clearProviderSelection}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-2 border rounded-md">
                    {groupBy === "provider" ? (
                      // Show model filters when grouping by provider
                      availableModels.map(model => (
                        <Badge 
                          key={model}
                          variant={selectedModels.includes(model) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleModelSelection(model)}
                        >
                          {model}
                        </Badge>
                      ))
                    ) : (
                      // Show provider filters when grouping by model
                      availableProviders.map(provider => (
                        <Badge 
                          key={provider}
                          variant={selectedProviders.includes(provider) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleProviderSelection(provider)}
                        >
                          {provider}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
                
                <div className="h-80">
                  {isLoading ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <ChartContainer config={providerChartConfig} className="h-full w-full">
                      <ScatterChart
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                      >
                        <CartesianGrid />
                        <XAxis 
                          type="number" 
                          dataKey="tokens" 
                          name="Tokens Consumed" 
                          domain={['auto', 'auto']}
                          label={{ value: 'Tokens Consumed', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis 
                          type="number" 
                          dataKey="latency" 
                          name="Latency (ms)" 
                          domain={['auto', 'auto']}
                          label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft' }}
                        />
                        <ChartTooltip 
                          cursor={{ strokeDasharray: '3 3' }}
                          content={
                            <ChartTooltipContent 
                              formatter={(value, name, props) => {
                                if (typeof value === 'number') {
                                  if (name === "latency") return [`${value.toFixed(0)} ms`, 'Latency'];
                                  if (name === "tokens") return [`${value.toFixed(0)}`, 'Tokens'];
                                  return [`${value.toFixed(0)}`, name];
                                }
                                return [value, name];
                              }}
                              labelFormatter={(_, payload) => {
                                if (payload && payload.length) {
                                  return groupBy === "provider" 
                                    ? `Provider: ${payload[0].payload.provider}, Model: ${payload[0].payload.model}` 
                                    : `Model: ${payload[0].payload.model}, Provider: ${payload[0].payload.provider}`;
                                }
                                return "";
                              }}
                            />
                          }
                        />
                        <Legend 
                          formatter={(value, entry, index) => {
                            // Customize the legend text based on groupBy
                            return value;
                          }}
                        />

                        {/* Dynamically render scatters based on groupBy selection */}
                        {getFilteredTokenVsLatencyData().length > 0 && (
                          groupBy === "provider" ? (
                            // Group by provider
                            <>
                              {/* Get unique providers that have data after filtering */}
                              {Array.from(new Set(getFilteredTokenVsLatencyData().map(item => item.provider))).map((provider, index) => {
                                // Calculate a color based on index if provider is not in the config
                                const colors = [
                                  "#10a37f",  // green
                                  "#b622ff",  // purple
                                  "#4285F4",  // blue
                                  "#7c3aed",  // violet
                                  "#ff5a5f",  // red
                                  "#f59e0b",  // amber
                                  "#ec4899",  // pink
                                  "#14b8a6",  // teal
                                  "#6366f1",  // indigo
                                  "#f43f5e",  // rose
                                ];
                                
                                const color = colors[index % colors.length];
                                
                                return (
                                  <Scatter 
                                    key={provider}
                                    name={provider} 
                                    data={getFilteredTokenVsLatencyData().filter(item => item.provider === provider)} 
                                    fill={color}
                                    shape={renderProviderScatterShape}
                                  />
                                );
                              })}
                            </>
                          ) : (
                            // Group by model - just show the models
                            <>
                              {/* Get unique models that have data after filtering */}
                              {Array.from(new Set(getFilteredTokenVsLatencyData().map(item => item.model))).map((model, index) => {
                                // Calculate a color based on index
                                const colors = [
                                  "#10a37f",  // green
                                  "#b622ff",  // purple
                                  "#4285F4",  // blue
                                  "#7c3aed",  // violet
                                  "#ff5a5f",  // red
                                  "#f59e0b",  // amber
                                  "#ec4899",  // pink
                                  "#14b8a6",  // teal
                                  "#6366f1",  // indigo
                                  "#f43f5e",  // rose
                                ];
                                
                                const color = colors[index % colors.length];
                                
                                return (
                                  <Scatter 
                                    key={model}
                                    name={model} 
                                    data={getFilteredTokenVsLatencyData().filter(item => item.model === model)} 
                                    fill={color}
                                    shape={renderProviderScatterShape}
                                  />
                                );
                              })}
                            </>
                          )
                        )}
                      </ScatterChart>
                    </ChartContainer>
                  )}
                </div>
                
                {/* Add count of data points for better context */}
                <div className="mt-2 text-sm text-muted-foreground">
                  Showing {getFilteredTokenVsLatencyData().length} data points
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
