import React, { useEffect, useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Cell
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  ChartContainer, 
  ChartTooltipContent, 
  ChartTooltip, 
  ChartLegendContent, 
  ChartLegend,
  type ChartConfig
} from "@/components/ui/chart";
import { supabaseService } from "@/services/supabase-service";

// Create chart configs
const responseTimeConfig: ChartConfig = {
  mAI: { label: "mAI", color: "#005B99" },
  CrewAI: { label: "CrewAI", color: "#888888" },
  Autogen: { label: "Autogen", color: "#888888" },
  LangGraph: { label: "LangGraph", color: "#888888" },
};

const accuracyConfig: ChartConfig = {
  mAI: { label: "mAI", color: "#005B99" },
  CrewAI: { label: "CrewAI", color: "#888888" },
  Autogen: { label: "Autogen", color: "#888888" },
  LangGraph: { label: "LangGraph", color: "#888888" },
};

const tokenUsageConfig: ChartConfig = {
  mAI: { label: "mAI", color: "#005B99" },
  CrewAI: { label: "CrewAI", color: "#888888" },
  Autogen: { label: "Autogen", color: "#888888" },
  LangGraph: { label: "LangGraph", color: "#888888" },
};

// Custom formatter based on metric type
const formatValue = (value: number, category: string) => {
  if (category === "responseTime") {
    return value >= 1000 ? `${(value / 1000).toFixed(1)}s` : `${value}ms`;
  } else if (category === "accuracy") {
    return `${value}%`;
  } else if (category === "tokenUsage") {
    return value === 50 ? `${value}% fewer` : `${value}% (baseline)`;
  }
  return value;
};

// Single metric chart component
const MetricChart = ({ 
  data, 
  title, 
  tooltip, 
  category, 
  config,
  isLoading
}: { 
  data: any[],
  title: string, 
  tooltip: string,
  category: string,
  config: ChartConfig,
  isLoading: boolean
}) => {
  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium mb-1 text-gray-700">{title}</h4>
      <p className="text-xs text-gray-500 mb-3">{tooltip}</p>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-[250px]">
          <div className="animate-spin rounded-full border-t-4 border-brand-primary border-opacity-50 h-8 w-8"></div>
        </div>
      ) : (
        <ChartContainer config={config} className="h-[250px] w-full">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} horizontal={true} />
            <XAxis type="number" hide={category === "tokenUsage"} />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={80} 
              axisLine={false}
              tickLine={false}
            />
            <ChartTooltip 
              content={
                <ChartTooltipContent 
                  formatter={(value, name) => {
                    return [formatValue(value as number, category), name];
                  }}
                />
              } 
            />
            <Bar 
              dataKey="value" 
              radius={[0, 4, 4, 0]}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={`var(--color-${entry.name})`}
                  opacity={entry.best ? 1 : 0.6}
                  strokeWidth={entry.best ? 2 : 0}
                  stroke={entry.best ? "#007ACC" : "none"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      )}

      {category === "tokenUsage" && (
        <div className="flex justify-center mt-2">
          <div className="flex items-center text-xs text-gray-500">
            <span className="font-medium mr-4">Lower is better</span>
            <span>50% → 100%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export function ComparisonChart() {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [responseTimeData, setResponseTimeData] = useState([]);
  const [accuracyData, setAccuracyData] = useState([]);
  const [tokenUsageData, setTokenUsageData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const comparisonData = await supabaseService.getFrameworkComparison();
        setResponseTimeData(comparisonData.responseTimeData);
        setAccuracyData(comparisonData.accuracyData);
        setTokenUsageData(comparisonData.tokenUsageData);
      } catch (error) {
        console.error("Error fetching comparison data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <h3 className="text-lg font-semibold mb-4 text-brand-primary">Framework Comparison</h3>
      
      <MetricChart 
        data={responseTimeData} 
        title="Response Time" 
        tooltip="Lower is better"
        category="responseTime"
        config={responseTimeConfig}
        isLoading={isLoading}
      />
      
      <MetricChart 
        data={accuracyData} 
        title="Accuracy (%)" 
        tooltip="Higher is better"
        category="accuracy"
        config={accuracyConfig}
        isLoading={isLoading}
      />
      
      <MetricChart 
        data={tokenUsageData} 
        title="Token Usage (% of baseline)" 
        tooltip="Lower is better"
        category="tokenUsage"
        config={tokenUsageConfig}
        isLoading={isLoading}
      />
    </div>
  );
}
