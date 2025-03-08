
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

// Provider-specific chart configuration
export const providerChartConfig = {
  ...chartConfig,
  OpenAI: {
    label: "OpenAI",
    color: "#10a37f" // OpenAI green
  },
  Anthropic: {
    label: "Anthropic",
    color: "#b622ff" // Anthropic purple
  },
  Google: {
    label: "Google",
    color: "#4285F4" // Google blue
  },
  Mistral: {
    label: "Mistral",
    color: "#7c3aed" // Violet color for Mistral
  },
  Cohere: {
    label: "Cohere",
    color: "#ff5a5f" // Red-ish color for Cohere
  },
  median: {
    label: "Median",
    color: "#64748b"
  },
  q1: {
    label: "Q1",
    color: "#94a3b8"
  },
  q3: {
    label: "Q3",
    color: "#94a3b8"
  },
  min: {
    label: "Min",
    color: "#cbd5e1"
  },
  max: {
    label: "Max",
    color: "#cbd5e1"
  }
};
