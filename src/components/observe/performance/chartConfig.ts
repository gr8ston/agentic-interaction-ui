
// Chart configurations for styling and labels
export const chartConfig = {
  value: {
    label: "Latency (ms)",
    color: "#007ACC"
  },
  tokens: {
    label: "Token Usage",
    color: "#3DA6FF"
  },
  latency: {
    label: "Latency (ms)",
    color: "#007ACC"
  },
  customerSupport: {
    label: "Customer Support",
    color: "#4CAF50"
  },
  productAssistant: {
    label: "Product Assistant",
    color: "#2196F3"
  },
  internalTool: {
    label: "Internal Tool",
    color: "#9C27B0"
  },
  websiteChat: {
    label: "Website Chat",
    color: "#FF9800"
  },
  salesAssistant: {
    label: "Sales Assistant",
    color: "#F44336"
  }
};

// Extended chart configuration for additional chart types
export const extendedChartConfig = {
  ...chartConfig,
  monday: {
    label: "Monday",
    color: "#8B5CF6"
  },
  tuesday: {
    label: "Tuesday",
    color: "#3B82F6"
  },
  wednesday: {
    label: "Wednesday",
    color: "#10B981"
  },
  thursday: {
    label: "Thursday",
    color: "#F59E0B"
  },
  friday: {
    label: "Friday",
    color: "#EC4899"
  },
  saturday: {
    label: "Saturday",
    color: "#6366F1"
  },
  sunday: {
    label: "Sunday",
    color: "#EF4444"
  },
  withSummary: {
    label: "With Summary",
    color: "#10B981"
  },
  withoutSummary: {
    label: "Without Summary",
    color: "#9CA3AF"
  }
};
