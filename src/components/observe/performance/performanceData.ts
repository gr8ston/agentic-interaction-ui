
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
