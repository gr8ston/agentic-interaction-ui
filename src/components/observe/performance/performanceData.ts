
// Latency trend data
export const latencyData = [
  { date: "Jan 1", value: 320 },
  { date: "Jan 2", value: 332 },
  { date: "Jan 3", value: 301 },
  { date: "Jan 4", value: 334 },
  { date: "Jan 5", value: 350 },
  { date: "Jan 6", value: 330 },
  { date: "Jan 7", value: 315 },
  { date: "Jan 8", value: 302 },
  { date: "Jan 9", value: 310 },
  { date: "Jan 10", value: 295 },
  { date: "Jan 11", value: 316 },
  { date: "Jan 12", value: 318 },
];

// Token usage data
export const tokenUsageData = [
  { date: "Jan 1", tokens: 1200 },
  { date: "Jan 2", tokens: 1300 },
  { date: "Jan 3", tokens: 1400 },
  { date: "Jan 4", tokens: 1800 },
  { date: "Jan 5", tokens: 2000 },
  { date: "Jan 6", tokens: 1700 },
  { date: "Jan 7", tokens: 1600 },
  { date: "Jan 8", tokens: 1650 },
  { date: "Jan 9", tokens: 1580 },
  { date: "Jan 10", tokens: 1700 },
  { date: "Jan 11", tokens: 1750 },
  { date: "Jan 12", tokens: 1800 },
];

// Token usage per application data
export const tokenUsagePerAppData = [
  { name: "Customer Support", tokens: 25000 },
  { name: "Product Assistant", tokens: 18000 },
  { name: "Internal Tool", tokens: 12000 },
  { name: "Website Chat", tokens: 30000 },
  { name: "Sales Assistant", tokens: 15000 },
];

// Monthly token usage data
export const tokenUsageMonthlyData = [
  { month: "Jan", tokens: 80000 },
  { month: "Feb", tokens: 95000 },
  { month: "Mar", tokens: 102000 },
  { month: "Apr", tokens: 118000 },
  { month: "May", tokens: 125000 },
  { month: "Jun", tokens: 132000 },
];

// Latency vs token usage data
export const latencyVsTokensData = [
  { id: "conv-1001", tokens: 250, latency: 320, app: "Customer Support" },
  { id: "conv-1002", tokens: 320, latency: 380, app: "Customer Support" },
  { id: "conv-1003", tokens: 180, latency: 290, app: "Product Assistant" },
  { id: "conv-1004", tokens: 450, latency: 560, app: "Product Assistant" },
  { id: "conv-1005", tokens: 520, latency: 620, app: "Internal Tool" },
  { id: "conv-1006", tokens: 380, latency: 490, app: "Internal Tool" },
  { id: "conv-1007", tokens: 220, latency: 310, app: "Website Chat" },
  { id: "conv-1008", tokens: 620, latency: 720, app: "Website Chat" },
  { id: "conv-1009", tokens: 180, latency: 280, app: "Sales Assistant" },
  { id: "conv-1010", tokens: 750, latency: 810, app: "Sales Assistant" },
];

// Performance outliers data
export const outlierData = [
  { 
    id: "conv-1234",
    timestamp: "2023-01-05 14:23:45",
    latency: 892,
    resource: "High token usage",
    app: "Customer Support"
  },
  { 
    id: "conv-2345",
    timestamp: "2023-01-06 09:12:32",
    latency: 756,
    resource: "Long conversation",
    app: "Product Assistant"
  },
  { 
    id: "conv-3456",
    timestamp: "2023-01-08 16:45:03",
    latency: 921,
    resource: "Complex request",
    app: "Internal Tool"
  },
  { 
    id: "conv-4567",
    timestamp: "2023-01-10 11:34:19",
    latency: 812,
    resource: "Image generation",
    app: "Website Chat"
  },
];

// Latency by time of day data
export const latencyByTimeData = [
  { hour: "00:00", monday: 310, tuesday: 320, wednesday: 330, thursday: 340, friday: 320, saturday: 300, sunday: 290 },
  { hour: "04:00", monday: 330, tuesday: 340, wednesday: 350, thursday: 360, friday: 340, saturday: 310, sunday: 300 },
  { hour: "08:00", monday: 380, tuesday: 390, wednesday: 410, thursday: 420, friday: 400, saturday: 340, sunday: 330 },
  { hour: "12:00", monday: 420, tuesday: 430, wednesday: 450, thursday: 460, friday: 440, saturday: 380, sunday: 360 },
  { hour: "16:00", monday: 400, tuesday: 410, wednesday: 430, thursday: 440, friday: 420, saturday: 360, sunday: 340 },
  { hour: "20:00", monday: 350, tuesday: 360, wednesday: 370, thursday: 380, friday: 360, saturday: 330, sunday: 320 },
];

// Latency by application data
export const latencyByAppData = [
  { name: "Customer Support", median: 320, q1: 280, q3: 380, min: 240, max: 450 },
  { name: "Product Assistant", median: 290, q1: 250, q3: 340, min: 220, max: 410 },
  { name: "Internal Tool", median: 380, q1: 330, q3: 440, min: 290, max: 520 },
  { name: "Website Chat", median: 310, q1: 270, q3: 370, min: 230, max: 440 },
  { name: "Sales Assistant", median: 340, q1: 300, q3: 400, min: 260, max: 480 },
];

// Summary comparison data
export const summaryComparisonData = [
  { name: "With Summary", value: 8 },
  { name: "Without Summary", value: 22 },
];

// Summary feedback data
export const summaryFeedbackData = [
  { name: "Positive", value: 72 },
  { name: "Neutral", value: 18 },
  { name: "Negative", value: 10 },
];

// Summary metrics data
export const summaryMetricsData = [
  { name: "Conversation Time", withSummary: -35, withoutSummary: 0 },
  { name: "Messages Count", withSummary: -45, withoutSummary: 0 },
  { name: "User Satisfaction", withSummary: 25, withoutSummary: 0 },
  { name: "Task Completion", withSummary: 18, withoutSummary: 0 },
];

// New data for provider and model visualizations
export const providerLatencyData = [
  { provider: "OpenAI", model: "GPT-4", latency: 320 },
  { provider: "OpenAI", model: "GPT-3.5", latency: 280 },
  { provider: "Anthropic", model: "Claude 3 Opus", latency: 350 },
  { provider: "Anthropic", model: "Claude 3 Sonnet", latency: 310 },
  { provider: "Anthropic", model: "Claude 3 Haiku", latency: 270 },
  { provider: "Google", model: "Gemini Pro", latency: 340 },
  { provider: "Google", model: "Gemini Ultra", latency: 360 },
  { provider: "Mistral", model: "Mistral Large", latency: 300 },
  { provider: "Mistral", model: "Mistral Medium", latency: 270 },
  { provider: "Cohere", model: "Command R+", latency: 330 },
];

// Box plot data for latency distribution
export const latencyDistributionData = [
  { provider: "OpenAI", model: "GPT-4", median: 320, q1: 290, q3: 350, min: 260, max: 420 },
  { provider: "OpenAI", model: "GPT-3.5", median: 280, q1: 250, q3: 310, min: 220, max: 380 },
  { provider: "Anthropic", model: "Claude 3 Opus", median: 350, q1: 320, q3: 380, min: 300, max: 450 },
  { provider: "Anthropic", model: "Claude 3 Sonnet", median: 310, q1: 290, q3: 340, min: 270, max: 400 },
  { provider: "Anthropic", model: "Claude 3 Haiku", median: 270, q1: 250, q3: 300, min: 230, max: 350 },
  { provider: "Google", model: "Gemini Pro", median: 340, q1: 310, q3: 370, min: 280, max: 430 },
  { provider: "Google", model: "Gemini Ultra", median: 360, q1: 330, q3: 390, min: 300, max: 450 },
  { provider: "Mistral", model: "Mistral Large", median: 300, q1: 270, q3: 330, min: 240, max: 390 },
  { provider: "Mistral", model: "Mistral Medium", median: 270, q1: 240, q3: 300, min: 210, max: 360 },
  { provider: "Cohere", model: "Command R+", median: 330, q1: 300, q3: 360, min: 270, max: 420 },
];

// Latency over time data (by provider)
export const latencyOverTimeData = [
  { date: "Jan 1", OpenAI: 315, Anthropic: 345, Google: 355, Mistral: 285, Cohere: 325 },
  { date: "Jan 2", OpenAI: 310, Anthropic: 340, Google: 350, Mistral: 280, Cohere: 330 },
  { date: "Jan 3", OpenAI: 320, Anthropic: 330, Google: 345, Mistral: 290, Cohere: 335 },
  { date: "Jan 4", OpenAI: 305, Anthropic: 335, Google: 340, Mistral: 275, Cohere: 320 },
  { date: "Jan 5", OpenAI: 300, Anthropic: 330, Google: 335, Mistral: 270, Cohere: 315 },
  { date: "Jan 6", OpenAI: 295, Anthropic: 325, Google: 330, Mistral: 265, Cohere: 310 },
  { date: "Jan 7", OpenAI: 290, Anthropic: 320, Google: 325, Mistral: 260, Cohere: 305 },
  { date: "Jan 8", OpenAI: 295, Anthropic: 330, Google: 340, Mistral: 265, Cohere: 315 },
  { date: "Jan 9", OpenAI: 300, Anthropic: 335, Google: 345, Mistral: 270, Cohere: 320 },
  { date: "Jan 10", OpenAI: 310, Anthropic: 340, Google: 350, Mistral: 280, Cohere: 330 },
];

// Scatter plot data for latency vs tokens consumed
export const latencyVsTokensByModelData = [
  // OpenAI
  { id: "msg-001", provider: "OpenAI", model: "GPT-4", tokens: 850, latency: 330 },
  { id: "msg-002", provider: "OpenAI", model: "GPT-4", tokens: 1200, latency: 350 },
  { id: "msg-003", provider: "OpenAI", model: "GPT-4", tokens: 600, latency: 310 },
  { id: "msg-004", provider: "OpenAI", model: "GPT-3.5", tokens: 900, latency: 290 },
  { id: "msg-005", provider: "OpenAI", model: "GPT-3.5", tokens: 500, latency: 260 },
  { id: "msg-006", provider: "OpenAI", model: "GPT-3.5", tokens: 700, latency: 275 },
  
  // Anthropic
  { id: "msg-007", provider: "Anthropic", model: "Claude 3 Opus", tokens: 1100, latency: 360 },
  { id: "msg-008", provider: "Anthropic", model: "Claude 3 Opus", tokens: 800, latency: 345 },
  { id: "msg-009", provider: "Anthropic", model: "Claude 3 Sonnet", tokens: 950, latency: 320 },
  { id: "msg-010", provider: "Anthropic", model: "Claude 3 Sonnet", tokens: 650, latency: 305 },
  { id: "msg-011", provider: "Anthropic", model: "Claude 3 Haiku", tokens: 550, latency: 275 },
  { id: "msg-012", provider: "Anthropic", model: "Claude 3 Haiku", tokens: 400, latency: 260 },
  
  // Google
  { id: "msg-013", provider: "Google", model: "Gemini Pro", tokens: 950, latency: 345 },
  { id: "msg-014", provider: "Google", model: "Gemini Pro", tokens: 750, latency: 330 },
  { id: "msg-015", provider: "Google", model: "Gemini Ultra", tokens: 1050, latency: 370 },
  { id: "msg-016", provider: "Google", model: "Gemini Ultra", tokens: 1300, latency: 390 },
  
  // Mistral
  { id: "msg-017", provider: "Mistral", model: "Mistral Large", tokens: 700, latency: 310 },
  { id: "msg-018", provider: "Mistral", model: "Mistral Large", tokens: 450, latency: 285 },
  { id: "msg-019", provider: "Mistral", model: "Mistral Medium", tokens: 550, latency: 275 },
  { id: "msg-020", provider: "Mistral", model: "Mistral Medium", tokens: 350, latency: 255 },
  
  // Cohere
  { id: "msg-021", provider: "Cohere", model: "Command R+", tokens: 800, latency: 335 },
  { id: "msg-022", provider: "Cohere", model: "Command R+", tokens: 650, latency: 320 },
];
