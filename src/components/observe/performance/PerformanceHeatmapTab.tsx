
import React, { useState } from "react";
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
import { extendedChartConfig, providerChartConfig } from "./chartConfig";
import { 
  latencyByTimeData, 
  latencyByAppData,
  latencyVsTokensByModelData,
  latencyOverTimeData
} from "./performanceData";
import { renderProviderScatterShape } from "./chartRenderers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function PerformanceHeatmapTab() {
  const [selectedDays, setSelectedDays] = useState<string[]>(["monday", "tuesday", "wednesday", "thursday", "friday"]);
  const [groupBy, setGroupBy] = useState<"provider" | "model">("provider");
  
  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };
  
  return (
    <div className="space-y-6">
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
              <ChartContainer config={extendedChartConfig} className="h-full w-full">
                <LineChart
                  data={latencyByTimeData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="hour" />
                  <YAxis domain={[250, 500]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  
                  {selectedDays.includes("monday") && (
                    <Line 
                      type="monotone" 
                      dataKey="monday" 
                      stroke="var(--color-monday)" 
                      activeDot={{ r: 8 }} 
                    />
                  )}
                  {selectedDays.includes("tuesday") && (
                    <Line 
                      type="monotone" 
                      dataKey="tuesday" 
                      stroke="var(--color-tuesday)" 
                      activeDot={{ r: 8 }} 
                    />
                  )}
                  {selectedDays.includes("wednesday") && (
                    <Line 
                      type="monotone" 
                      dataKey="wednesday" 
                      stroke="var(--color-wednesday)" 
                      activeDot={{ r: 8 }} 
                    />
                  )}
                  {selectedDays.includes("thursday") && (
                    <Line 
                      type="monotone" 
                      dataKey="thursday" 
                      stroke="var(--color-thursday)" 
                      activeDot={{ r: 8 }} 
                    />
                  )}
                  {selectedDays.includes("friday") && (
                    <Line 
                      type="monotone" 
                      dataKey="friday" 
                      stroke="var(--color-friday)" 
                      activeDot={{ r: 8 }} 
                    />
                  )}
                  {selectedDays.includes("saturday") && (
                    <Line 
                      type="monotone" 
                      dataKey="saturday" 
                      stroke="var(--color-saturday)" 
                      activeDot={{ r: 8 }} 
                    />
                  )}
                  {selectedDays.includes("sunday") && (
                    <Line 
                      type="monotone" 
                      dataKey="sunday" 
                      stroke="var(--color-sunday)" 
                      activeDot={{ r: 8 }} 
                    />
                  )}
                </LineChart>
              </ChartContainer>
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
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid />
                  <XAxis type="category" dataKey="name" name="Application" />
                  <YAxis type="number" dataKey="median" name="Latency (ms)" domain={[200, 550]} />
                  <ZAxis range={[100, 100]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter 
                    name="Median" 
                    data={latencyByAppData} 
                    fill="#8884d8"
                    line={{ stroke: '#ddd', strokeWidth: 1, strokeDasharray: '5 5' }}
                    shape={(props) => {
                      const { cx, cy, payload } = props;
                      return (
                        <g>
                          {/* Min-Max line */}
                          <line 
                            x1={cx} 
                            y1={cy - 40 * (payload.max - payload.median) / 100} 
                            x2={cx} 
                            y2={cy + 40 * (payload.median - payload.min) / 100} 
                            stroke="#94a3b8" 
                            strokeWidth={1} 
                          />
                          
                          {/* Q1-Q3 box */}
                          <rect 
                            x={cx - 10} 
                            y={cy - 20 * (payload.q3 - payload.median) / 100} 
                            width={20} 
                            height={20 * (payload.q3 - payload.q1) / 100} 
                            fill="rgba(148, 163, 184, 0.2)" 
                            stroke="#94a3b8" 
                          />
                          
                          {/* Median point */}
                          <circle 
                            cx={cx} 
                            cy={cy} 
                            r={6} 
                            fill="#64748b" 
                            stroke="#fff" 
                            strokeWidth={2} 
                          />
                        </g>
                      );
                    }}
                  />
                </ScatterChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Latency Over Time by Provider</CardTitle>
            <CardDescription>Trends in latency changes by provider</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={providerChartConfig} className="h-full w-full">
                <LineChart
                  data={latencyOverTimeData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" />
                  <YAxis domain={[250, 400]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="OpenAI" 
                    stroke="var(--color-OpenAI)" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Anthropic" 
                    stroke="var(--color-Anthropic)" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Google" 
                    stroke="var(--color-Google)" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Mistral" 
                    stroke="var(--color-Mistral)" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Cohere" 
                    stroke="var(--color-Cohere)" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Latency vs Tokens Consumed</CardTitle>
              <CardDescription>Relationship between token usage and performance</CardDescription>
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
            <div className="h-80">
              <ChartContainer config={providerChartConfig} className="h-full w-full">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid />
                  <XAxis 
                    type="number" 
                    dataKey="tokens" 
                    name="Tokens Consumed" 
                    domain={[300, 1400]}
                    label={{ value: 'Tokens Consumed', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="latency" 
                    name="Latency (ms)" 
                    domain={[240, 400]}
                    label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft' }}
                  />
                  <ChartTooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={
                      <ChartTooltipContent 
                        formatter={(value, name, props) => {
                          if (name === "latency") return [`${value} ms`, 'Latency'];
                          if (name === "tokens") return [`${value}`, 'Tokens'];
                          return [value, name];
                        }}
                        labelFormatter={(_, payload) => {
                          if (payload && payload.length) {
                            return groupBy === "provider" 
                              ? `Provider: ${payload[0].payload.provider}` 
                              : `Model: ${payload[0].payload.model}`;
                          }
                          return "";
                        }}
                      />
                    }
                  />
                  <Legend 
                    formatter={(value, entry, index) => {
                      // Customize the legend text based on groupBy
                      if (groupBy === "provider") {
                        return `Provider: ${value}`;
                      } else {
                        return `Model: ${value}`;
                      }
                    }}
                  />
                  {groupBy === "provider" ? (
                    // Group by provider
                    <>
                      <Scatter 
                        name="OpenAI" 
                        data={latencyVsTokensByModelData.filter(item => item.provider === "OpenAI")} 
                        fill="#10a37f"
                        shape={renderProviderScatterShape}
                      />
                      <Scatter 
                        name="Anthropic" 
                        data={latencyVsTokensByModelData.filter(item => item.provider === "Anthropic")} 
                        fill="#b622ff"
                        shape={renderProviderScatterShape}
                      />
                      <Scatter 
                        name="Google" 
                        data={latencyVsTokensByModelData.filter(item => item.provider === "Google")} 
                        fill="#4285F4"
                        shape={renderProviderScatterShape}
                      />
                      <Scatter 
                        name="Mistral" 
                        data={latencyVsTokensByModelData.filter(item => item.provider === "Mistral")} 
                        fill="#7c3aed"
                        shape={renderProviderScatterShape}
                      />
                      <Scatter 
                        name="Cohere" 
                        data={latencyVsTokensByModelData.filter(item => item.provider === "Cohere")} 
                        fill="#ff5a5f"
                        shape={renderProviderScatterShape}
                      />
                    </>
                  ) : (
                    // Group by model - just show a few key models to avoid overcrowding
                    <>
                      <Scatter 
                        name="GPT-4" 
                        data={latencyVsTokensByModelData.filter(item => item.model === "GPT-4")} 
                        fill="#10a37f"
                        shape={renderProviderScatterShape}
                      />
                      <Scatter 
                        name="GPT-3.5" 
                        data={latencyVsTokensByModelData.filter(item => item.model === "GPT-3.5")} 
                        fill="#10a37f"
                        shape={renderProviderScatterShape}
                      />
                      <Scatter 
                        name="Claude 3 Opus" 
                        data={latencyVsTokensByModelData.filter(item => item.model === "Claude 3 Opus")} 
                        fill="#b622ff"
                        shape={renderProviderScatterShape}
                      />
                      <Scatter 
                        name="Gemini Ultra" 
                        data={latencyVsTokensByModelData.filter(item => item.model === "Gemini Ultra")} 
                        fill="#4285F4"
                        shape={renderProviderScatterShape}
                      />
                      <Scatter 
                        name="Mistral Large" 
                        data={latencyVsTokensByModelData.filter(item => item.model === "Mistral Large")} 
                        fill="#7c3aed"
                        shape={renderProviderScatterShape}
                      />
                    </>
                  )}
                </ScatterChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
