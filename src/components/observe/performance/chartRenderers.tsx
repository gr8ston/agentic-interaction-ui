
import React from 'react';

// Custom renderer for the positive/negative feedback bar
export const renderPositiveNegativeFeedbackBar = (props: any) => {
  const { x, y, width, height, value, name } = props;
  
  const fill = name === "Positive" ? "#10B981" : 
              name === "Neutral" ? "#F59E0B" : 
              "#EF4444";
  
  return (
    <rect 
      x={x} 
      y={y} 
      width={width} 
      height={height} 
      fill={fill} 
      rx={4}
      ry={4}
    />
  );
};

// Custom renderer for the summary metrics bar
export const renderSummaryMetricsBar = (props: any) => {
  const { x, y, width, height, value } = props;
  
  const fill = value > 0 ? "#10B981" : "#EF4444";
  
  return (
    <rect 
      x={x} 
      y={y} 
      width={width} 
      height={height} 
      fill={fill} 
      rx={4}
      ry={4}
    />
  );
};

// Custom renderer for scatter plot shapes
export const renderScatterShape = (props: any) => {
  const { cx, cy } = props;
  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={8} 
      fill="#8B5CF6" 
      stroke="none" 
    />
  );
};
