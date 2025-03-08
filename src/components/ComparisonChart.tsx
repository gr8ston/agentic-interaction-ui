
import React from "react";
import { 
  ComposedChart, 
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

// Comparison data
const data = [
  {
    name: "Response Time (ms)",
    mAI: 400,
    CrewAI: 15000,
    Autogen: 7000,
    LangGraph: 8000,
    best: "mAI"
  },
  {
    name: "Accuracy (%)",
    mAI: 92,
    CrewAI: 72,
    Autogen: 80,
    LangGraph: 83,
    best: "mAI"
  },
  {
    name: "Token Usage",
    mAI: 50,
    CrewAI: 100,
    Autogen: 100,
    LangGraph: 100,
    best: "mAI",
    isInverted: true // Lower is better for token usage
  }
];

// Chart colors based on the brand colors
const colors = {
  mAI: "#005B99", // brand-primary
  CrewAI: "#888888",
  Autogen: "#888888",
  LangGraph: "#888888"
};

export function ComparisonChart() {
  const isMobile = useIsMobile();
  
  const normalizedData = data.map(item => {
    if (item.name === "Token Usage") {
      return {
        ...item,
        label: "Token Usage (% of baseline)",
        tooltip: "Lower is better"
      };
    } else if (item.name === "Response Time (ms)") {
      return {
        ...item,
        label: "Response Time (ms)",
        tooltip: "Lower is better"
      };
    } else {
      return {
        ...item,
        label: item.name,
        tooltip: "Higher is better"
      };
    }
  });

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <h3 className="text-lg font-semibold mb-4 text-brand-primary">Framework Comparison</h3>
      
      <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
        <ComposedChart
          layout={isMobile ? "vertical" : "horizontal"}
          data={normalizedData}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: isMobile ? 80 : 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          {isMobile ? (
            <>
              <XAxis type="number" />
              <YAxis dataKey="label" type="category" scale="band" />
            </>
          ) : (
            <>
              <XAxis dataKey="label" scale="band" />
              <YAxis />
            </>
          )}
          <Tooltip 
            formatter={(value, name, props) => {
              const entry = props.payload;
              // Convert response time from ms to seconds for CrewAI, Autogen, LangGraph
              if (entry.label === "Response Time (ms)" && name !== "mAI" && value > 1000) {
                return [`${(value / 1000).toFixed(1)}s`, name];
              }
              // Add "% fewer" for mAI in token usage
              if (entry.label === "Token Usage (% of baseline)" && name === "mAI") {
                return [`${value}% fewer`, name];
              }
              return [value, name];
            }}
            labelFormatter={(label) => {
              const item = normalizedData.find(d => d.label === label);
              return `${label} ${item?.tooltip ? `(${item.tooltip})` : ''}`;
            }}
          />
          <Legend />
          
          {/* Render bars for each framework */}
          {["mAI", "CrewAI", "Autogen", "LangGraph"].map((framework) => (
            <Bar 
              key={framework}
              dataKey={framework}
              fill={colors[framework as keyof typeof colors]}
              opacity={framework === "mAI" ? 1 : 0.6}
            >
              {normalizedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={colors[framework as keyof typeof colors]}
                  opacity={framework === entry.best ? 1 : 0.6}
                  strokeWidth={framework === entry.best ? 2 : 0}
                  stroke={framework === entry.best ? "#007ACC" : "none"}
                />
              ))}
            </Bar>
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
