
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

// Custom renderer for provider-specific scatter plot shapes
export const renderProviderScatterShape = (props: any) => {
  const { cx, cy, payload } = props;
  
  let fill = "#8B5CF6"; // Default color
  
  // Determine color based on provider
  if (payload && payload.provider) {
    switch (payload.provider) {
      case "OpenAI":
        fill = "#10a37f";
        break;
      case "Anthropic":
        fill = "#b622ff";
        break;
      case "Google":
        fill = "#4285F4";
        break;
      case "Mistral":
        fill = "#7c3aed";
        break;
      case "Cohere":
        fill = "#ff5a5f";
        break;
      default:
        fill = "#8B5CF6";
    }
  }
  
  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={6} 
      fill={fill} 
      stroke="#ffffff" 
      strokeWidth={1}
      opacity={0.8}
    />
  );
};

// Custom renderer for provider-specific bars
export const renderProviderBar = (props: any) => {
  const { x, y, width, height, value, name } = props;
  
  let fill = "#007ACC"; // Default color
  
  // Determine color based on provider
  switch (name) {
    case "OpenAI":
      fill = "#10a37f";
      break;
    case "Anthropic":
      fill = "#b622ff";
      break;
    case "Google":
      fill = "#4285F4";
      break;
    case "Mistral":
      fill = "#7c3aed";
      break;
    case "Cohere":
      fill = "#ff5a5f";
      break;
    default:
      // Handle model-specific colors if name is a model
      if (name.includes("GPT")) {
        fill = "#10a37f"; // OpenAI
      } else if (name.includes("Claude")) {
        fill = "#b622ff"; // Anthropic
      } else if (name.includes("Gemini")) {
        fill = "#4285F4"; // Google
      } else if (name.includes("Mistral")) {
        fill = "#7c3aed"; // Mistral
      } else if (name.includes("Command")) {
        fill = "#ff5a5f"; // Cohere
      }
  }
  
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
