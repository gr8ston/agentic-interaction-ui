import { ChartConfig } from "@/components/ui/chart";

// Basic chart config with blues and grays
export const chartConfig: ChartConfig = {
  value: {
    label: "Latency (ms)",
    color: "#3b82f6",
  },
  date: {
    label: "Date",
    color: "#3b82f6",
  },
};

// Extended chart config with custom colors for days of week
export const extendedChartConfig: ChartConfig = {
  monday: {
    label: "Monday",
    color: "#4285F4", // Google Blue
  },
  tuesday: {
    label: "Tuesday",
    color: "#10a37f", // OpenAI Green
  },
  wednesday: {
    label: "Wednesday",
    color: "#b622ff", // Anthropic Purple
  },
  thursday: {
    label: "Thursday",
    color: "#7c3aed", // Mistral Violet
  },
  friday: {
    label: "Friday",
    color: "#ff5a5f", // Cohere Red
  },
  saturday: {
    label: "Saturday",
    color: "#f59e0b", // Amber
  },
  sunday: {
    label: "Sunday",
    color: "#ec4899", // Pink
  },
};

// Provider-specific chart config
export const providerChartConfig: ChartConfig = {
  OpenAI: {
    label: "OpenAI",
    color: "#10a37f",
  },
  Anthropic: {
    label: "Anthropic",
    color: "#b622ff",
  },
  Google: {
    label: "Google",
    color: "#4285F4",
  },
  Mistral: {
    label: "Mistral",
    color: "#7c3aed",
  },
  Cohere: {
    label: "Cohere",
    color: "#ff5a5f",
  },
  median: {
    label: "Median Latency",
    color: "#64748b",
  },
  q1: {
    label: "25th Percentile",
    color: "#94a3b8",
  },
  q3: {
    label: "75th Percentile",
    color: "#94a3b8",
  },
};
