
import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

// Data for each category
const responseTimeData = [
  { name: "mAI", value: 400, color: "#005B99", best: true },
  { name: "CrewAI", value: 15000, color: "#888888", best: false },
  { name: "Autogen", value: 7000, color: "#888888", best: false },
  { name: "LangGraph", value: 8000, color: "#888888", best: false }
];

const accuracyData = [
  { name: "mAI", value: 92, color: "#005B99", best: true },
  { name: "CrewAI", value: 72, color: "#888888", best: false },
  { name: "Autogen", value: 80, color: "#888888", best: false },
  { name: "LangGraph", value: 83, color: "#888888", best: false }
];

const tokenUsageData = [
  { name: "mAI", value: 50, color: "#005B99", best: true },
  { name: "CrewAI", value: 100, color: "#888888", best: false },
  { name: "Autogen", value: 100, color: "#888888", best: false },
  { name: "LangGraph", value: 100, color: "#888888", best: false }
];

// Custom tooltip formatter
const CustomTooltip = ({ active, payload, label, category }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    let valueDisplay = `${payload[0].value}`;
    
    // Format based on category
    if (category === "responseTime") {
      valueDisplay = data.value >= 1000 ? `${(data.value / 1000).toFixed(1)}s` : `${data.value}ms`;
    } else if (category === "accuracy") {
      valueDisplay = `${data.value}%`;
    } else if (category === "tokenUsage") {
      valueDisplay = data.name === "mAI" ? `${data.value}% fewer` : `${data.value}% (baseline)`;
    }

    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm text-gray-700">{valueDisplay}</p>
        {data.best && <p className="text-xs text-brand-primary mt-1 font-medium">Best Performance</p>}
      </div>
    );
  }

  return null;
};

// Single metric chart component
const MetricChart = ({ data, title, tooltip, category, isMobile }: { 
  data: any[],
  title: string, 
  tooltip: string,
  category: string,
  isMobile: boolean
}) => {
  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium mb-1 text-gray-700">{title}</h4>
      <p className="text-xs text-gray-500 mb-3">{tooltip}</p>
      
      <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} horizontal={!isMobile} />
          <XAxis type="number" hide={category === "tokenUsage"} />
          <YAxis type="category" dataKey="name" width={80} />
          <Tooltip content={<CustomTooltip category={category} />} />
          <Bar dataKey="value">
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`}
                fill={entry.color}
                opacity={entry.best ? 1 : 0.6}
                strokeWidth={entry.best ? 2 : 0}
                stroke={entry.best ? "#007ACC" : "none"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

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
  
  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <h3 className="text-lg font-semibold mb-4 text-brand-primary">Framework Comparison</h3>
      
      <MetricChart 
        data={responseTimeData} 
        title="Response Time" 
        tooltip="Lower is better"
        category="responseTime"
        isMobile={isMobile}
      />
      
      <MetricChart 
        data={accuracyData} 
        title="Accuracy (%)" 
        tooltip="Higher is better"
        category="accuracy"
        isMobile={isMobile}
      />
      
      <MetricChart 
        data={tokenUsageData} 
        title="Token Usage (% of baseline)" 
        tooltip="Lower is better"
        category="tokenUsage"
        isMobile={isMobile}
      />
    </div>
  );
}
