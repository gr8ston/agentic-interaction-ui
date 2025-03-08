
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Import data and utilities
import { summaryComparisonData, summaryFeedbackData, summaryMetricsData } from "./performanceData";
import { extendedChartConfig } from "./chartConfig";
import { renderPositiveNegativeFeedbackBar, renderSummaryMetricsBar } from "./chartRenderers";

export function SummarizationEffectivenessTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Conversation Length Comparison</CardTitle>
            <CardDescription>Average number of messages with and without summarization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ChartContainer config={extendedChartConfig} className="h-full w-full">
                <BarChart
                  data={summaryComparisonData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Avg. Messages', angle: -90, position: 'insideLeft' }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>Conversations with summarization features enabled are significantly shorter.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Feedback on Summarization</CardTitle>
            <CardDescription>User sentiment on conversations using summarization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ChartContainer config={extendedChartConfig} className="h-full w-full">
                <BarChart
                  data={summaryFeedbackData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="value" 
                    shape={renderPositiveNegativeFeedbackBar}
                  />
                </BarChart>
              </ChartContainer>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>The majority of users provide positive feedback on summarization functionality.</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Summarization Impact</CardTitle>
          <CardDescription>Percentage change in key metrics when summarization is used</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ChartContainer config={extendedChartConfig} className="h-full w-full">
              <BarChart
                layout="vertical"
                data={summaryMetricsData}
                margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} horizontal={true} vertical={false} />
                <XAxis type="number" domain={[-50, 50]} tickFormatter={(value) => `${value}%`} />
                <YAxis dataKey="name" type="category" width={100} />
                <ChartTooltip 
                  formatter={(value) => [`${value}%`, "Percentage Change"]}
                  content={<ChartTooltipContent />} 
                />
                <Bar 
                  dataKey="withSummary" 
                  shape={renderSummaryMetricsBar}
                />
              </BarChart>
            </ChartContainer>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>Negative values indicate a reduction (which is positive for time and message count), while positive values show improvement.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
