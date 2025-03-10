import { supabase } from '@/integrations/supabase/client';
import { latencyOverTimeData } from '@/components/observe/performance/performanceData';

// Helper function to calculate total tokens from a token value
// This handles both the old integer format and the new JSON format
// Note: Only system/agent messages should have token data
function getTotalTokens(tokenValue: any, role?: string): number {
  // If it's a user message or tokens are null/undefined, return 0
  if (tokenValue === null || tokenValue === undefined || role === 'user') {
    return 0;
  }
  
  if (typeof tokenValue === 'object') {
    // New format: JSON object with input and output fields
    return (tokenValue.input || 0) + (tokenValue.output || 0);
  } else {
    // Old format: integer value
    return tokenValue || 0;
  }
}

export interface ConversationMetrics {
  totalConversations: number;
  totalMessages: number;
  averageLatency: number;
  totalTokensConsumed: number;
  conversationsChange: number;
  messagesChange: number;
  latencyChange: number;
  tokensChange: number;
}

export interface DailyMetric {
  date: string;
  value: number;
}

export interface AppUsageMetric {
  name: string;
  value: number;
}

export interface RecentConversation {
  id: string;
  app: string;
  time: string;
  status: string;
  tokens: number;
}

export interface LatencyByTimeOfDay {
  hour: number;
  monday: number | null;
  tuesday: number | null;
  wednesday: number | null;
  thursday: number | null;
  friday: number | null;
  saturday: number | null;
  sunday: number | null;
}

export interface LatencyByApp {
  name: string;
  median: number;
  q1: number;
  q3: number;
  min: number;
  max: number;
}

/**
 * Interface for latency data by provider over time
 */
export interface LatencyByProviderOverTime {
  date: string;
  [provider: string]: string | number | null | undefined;
}

/**
 * Interface for token consumption vs latency data
 */
export interface TokenVsLatencyDataPoint {
  tokens: number;      // Total tokens (input + output)
  latency: number;     // Latency in milliseconds
  model: string;       // Model name (e.g., "GPT-4", "Claude-3")
  provider: string;    // Provider name (e.g., "OpenAI", "Anthropic")
}

// Helper function to calculate percentage change
function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

// Define a type for the tokens_consumed JSONB structure
interface TokenConsumption {
  input: number;
  output: number;
}

/**
 * Interface for summarization message count comparison
 */
export interface SummarizationMessageCountComparison {
  withSummary: number;
  withoutSummary: number;
}

/**
 * Interface for summarization feedback
 */
export interface SummarizationFeedback {
  positive: number;
  negative: number;
  neutral: number;
}

/**
 * Interface for summarization impact metrics
 */
export interface SummarizationImpact {
  conversationTime: number;
  messagesCount: number;
  userSatisfaction: number;
  taskCompletion: number;
}

export const supabaseService = {
  // Get overview metrics (for cards)
  async getOverviewMetrics(): Promise<ConversationMetrics> {
    try {
      console.log("=== STARTING getOverviewMetrics() ===");
      console.log("Fetching metrics data for last 7 days vs previous 7 days");
      
      // Define time periods using system time
      const now = new Date();
      const last7DaysEnd = now.toISOString();
      
      // Last 7 days period
      const last7DaysStart = new Date();
      last7DaysStart.setDate(now.getDate() - 7);
      
      // Previous 7 days period (7-14 days ago)
      const prev7DaysEnd = new Date(last7DaysStart);
      prev7DaysEnd.setDate(prev7DaysEnd.getDate() - 1); // One day before last7DaysStart
      
      const prev7DaysStart = new Date(last7DaysStart);
      prev7DaysStart.setDate(prev7DaysStart.getDate() - 7); // 7 days before last7DaysStart
      
      const last7Period = {
        start: last7DaysStart.toISOString(),
        end: last7DaysEnd
      };
      
      const prev7Period = {
        start: prev7DaysStart.toISOString(),
        end: prev7DaysEnd.toISOString()
      };
      
      console.log(`Current period: ${last7DaysStart.toLocaleDateString()} to ${now.toLocaleDateString()}`);
      console.log(`Previous period: ${prev7DaysStart.toLocaleDateString()} to ${prev7DaysEnd.toLocaleDateString()}`);
      
      // === CONVERSATIONS COUNT ===
      console.log("Fetching current period conversations...");
      const { data: currentConversations, error: convErrorCurrent } = await supabase
        .from('conversations')
        .select('conversation_id')
        .gte('created_at', last7Period.start)
        .lte('created_at', last7Period.end);
      
      if (convErrorCurrent) {
        console.error("Error fetching current period conversations:", convErrorCurrent);
        throw convErrorCurrent;
      }
      
      console.log("Fetching previous period conversations...");
      const { data: prevConversations, error: convErrorPrev } = await supabase
        .from('conversations')
        .select('conversation_id')
        .gte('created_at', prev7Period.start)
        .lte('created_at', prev7Period.end);
      
      if (convErrorPrev) {
        console.error("Error fetching previous period conversations:", convErrorPrev);
        throw convErrorPrev;
      }
      
      const totalConversationsLast7 = currentConversations ? currentConversations.length : 0;
      const totalConversationsPrev7 = prevConversations ? prevConversations.length : 0;
      console.log(`Found ${totalConversationsLast7} conversations (current period) vs ${totalConversationsPrev7} (previous period)`);
      
      // === MESSAGES COUNT ===
      // Get messages from current period (last 7 days)
      const { data: currentMessages, error: msgErrorCurrent } = await supabase
        .from('messages')
        .select('message_id')
        .gte('created_at', last7Period.start)
        .lte('created_at', last7Period.end);
      
      if (msgErrorCurrent) {
        console.error("Error fetching current period messages:", msgErrorCurrent);
        throw msgErrorCurrent;
      }
      
      // Get messages from previous period (7-14 days ago)
      const { data: prevMessages, error: msgErrorPrev } = await supabase
        .from('messages')
        .select('message_id')
        .gte('created_at', prev7Period.start)
        .lte('created_at', prev7Period.end);
      
      if (msgErrorPrev) {
        console.error("Error fetching previous period messages:", msgErrorPrev);
        throw msgErrorPrev;
      }
      
      const totalMessagesLast7 = currentMessages ? currentMessages.length : 0;
      const totalMessagesPrev7 = prevMessages ? prevMessages.length : 0;
      console.log(`Found ${totalMessagesLast7} messages (current period) vs ${totalMessagesPrev7} (previous period)`);
      
      // === AVERAGE LATENCY ===
      // Get latency data from current period (last 7 days)
      const { data: currentLatency, error: latErrorCurrent } = await supabase
        .from('messages')
        .select('latency_ms')
        .not('latency_ms', 'is', null)
        .gte('created_at', last7Period.start)
        .lte('created_at', last7Period.end);
      
      if (latErrorCurrent) {
        console.error("Error fetching current period latency:", latErrorCurrent);
        throw latErrorCurrent;
      }
      
      // Get latency data from previous period (7-14 days ago)
      const { data: prevLatency, error: latErrorPrev } = await supabase
        .from('messages')
        .select('latency_ms')
        .not('latency_ms', 'is', null)
        .gte('created_at', prev7Period.start)
        .lte('created_at', prev7Period.end);
      
      if (latErrorPrev) {
        console.error("Error fetching previous period latency:", latErrorPrev);
        throw latErrorPrev;
      }
      
      const avgLatencyLast7 = currentLatency && currentLatency.length > 0
        ? currentLatency.reduce((sum, msg) => sum + (msg.latency_ms || 0), 0) / currentLatency.length
        : 1372.5;
      
      const avgLatencyPrev7 = prevLatency && prevLatency.length > 0
        ? prevLatency.reduce((sum, msg) => sum + (msg.latency_ms || 0), 0) / prevLatency.length
        : 1372.5;
      
      console.log(`Average latency: ${avgLatencyLast7.toFixed(2)}ms (current period) vs ${avgLatencyPrev7.toFixed(2)}ms (previous period)`);
      console.log(`Latency data points: ${currentLatency?.length || 0} (current period) vs ${prevLatency?.length || 0} (previous period)`);
      
      // === TOKEN USAGE ===
      // Get token data from current period (last 7 days)
      const { data: currentTokens, error: tokErrorCurrent } = await supabase
        .from('messages')
        .select('tokens_consumed')
        .not('tokens_consumed', 'is', null)
        .gte('created_at', last7Period.start)
        .lte('created_at', last7Period.end);
      
      if (tokErrorCurrent) {
        console.error("Error fetching current period tokens:", tokErrorCurrent);
        throw tokErrorCurrent;
      }
      
      // Get token data from previous period (7-14 days ago)
      const { data: prevTokens, error: tokErrorPrev } = await supabase
        .from('messages')
        .select('tokens_consumed')
        .not('tokens_consumed', 'is', null)
        .gte('created_at', prev7Period.start)
        .lte('created_at', prev7Period.end);
      
      if (tokErrorPrev) {
        console.error("Error fetching previous period tokens:", tokErrorPrev);
        throw tokErrorPrev;
      }
      
      const totalTokensLast7 = currentTokens && currentTokens.length > 0
        ? currentTokens.reduce((sum, msg) => sum + getTotalTokens(msg.tokens_consumed), 0)
        : 541;
      
      const totalTokensPrev7 = prevTokens && prevTokens.length > 0
        ? prevTokens.reduce((sum, msg) => sum + getTotalTokens(msg.tokens_consumed), 0)
        : 500;
      
      console.log(`Total tokens: ${totalTokensLast7} (current period) vs ${totalTokensPrev7} (previous period)`);
      console.log(`Token data points: ${currentTokens?.length || 0} (current period) vs ${prevTokens?.length || 0} (previous period)`);
      
      // Calculate percentage changes - making sure they match our debug calculations
      const conversationsChange = calculatePercentageChange(totalConversationsLast7, totalConversationsPrev7);
      const messagesChange = calculatePercentageChange(totalMessagesLast7, totalMessagesPrev7);
      
      // For latency, a decrease is an improvement (faster response time), so we invert the sign
      // A positive latencyChange means things got faster (response time decreased)
      const latencyChange = avgLatencyLast7 < avgLatencyPrev7 
        ? Math.abs(calculatePercentageChange(avgLatencyLast7, avgLatencyPrev7)) // Improvement
        : -Math.abs(calculatePercentageChange(avgLatencyLast7, avgLatencyPrev7)); // Degradation
      
      // For tokens, an increase means more usage (potentially worse)
      const tokensChange = calculatePercentageChange(totalTokensLast7, totalTokensPrev7);
      
      // Log the raw calculations for debugging
      console.log(`PERCENTAGE CALCULATIONS:`);
      console.log(`Conversations: ((${totalConversationsLast7} - ${totalConversationsPrev7}) / ${totalConversationsPrev7}) * 100 = ${conversationsChange.toFixed(2)}%`);
      console.log(`Messages: ((${totalMessagesLast7} - ${totalMessagesPrev7}) / ${totalMessagesPrev7}) * 100 = ${messagesChange.toFixed(2)}%`);
      console.log(`Latency: ${latencyChange.toFixed(2)}% (${latencyChange >= 0 ? 'faster' : 'slower'})`);
      console.log(`Tokens: ${tokensChange.toFixed(2)}% (${tokensChange >= 0 ? 'increase' : 'decrease'})`);
      
      return {
        totalConversations: totalConversationsLast7,
        totalMessages: totalMessagesLast7,
        averageLatency: avgLatencyLast7,
        totalTokensConsumed: totalTokensLast7,
        conversationsChange,
        messagesChange,
        latencyChange, 
        tokensChange
      };
    } catch (error) {
      console.error('Error fetching overview metrics:', error);
      // Return hardcoded fallback data
      return {
        totalConversations: 10,
        totalMessages: 20,
        averageLatency: 1372.5,
        totalTokensConsumed: 541,
        conversationsChange: 0,
        messagesChange: 0,
        latencyChange: 5,
        tokensChange: 8
      };
    }
  },

  // Get conversation trends (for line chart)
  async getConversationTrends(days = 7): Promise<DailyMetric[]> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);
      
      const { data, error } = await supabase
        .from('conversations')
        .select('created_at')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());
      
      if (error) throw error;
      
      // Group conversations by day
      const dailyCounts: { [key: string]: number } = {};
      const dateLabels: string[] = [];
      
      // Initialize all days with 0
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(endDate.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        dailyCounts[dateStr] = 0;
        dateLabels.unshift(dateStr);
      }
      
      // Count conversations per day
      data.forEach(conv => {
        const dateStr = new Date(conv.created_at || '').toISOString().split('T')[0];
        if (dailyCounts[dateStr] !== undefined) {
          dailyCounts[dateStr]++;
        }
      });
      
      // Format for chart
      const trendData = dateLabels.map(date => {
        const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
        return {
          date: dayOfWeek,
          value: dailyCounts[date]
        };
      });
      
      // If no data, return demo data
      if (trendData.every(item => item.value === 0)) {
        return [
          { date: 'Mon', value: 2 },
          { date: 'Tue', value: 3 },
          { date: 'Wed', value: 2 },
          { date: 'Thu', value: 4 },
          { date: 'Fri', value: 2 },
          { date: 'Sat', value: 1 },
          { date: 'Sun', value: 1 }
        ];
      }
      
      return trendData;
    } catch (error) {
      console.error('Error fetching conversation trends:', error);
      // Return demo data if there's an error
      return [
        { date: 'Mon', value: 2 },
        { date: 'Tue', value: 3 },
        { date: 'Wed', value: 2 },
        { date: 'Thu', value: 4 },
        { date: 'Fri', value: 2 },
        { date: 'Sat', value: 1 },
        { date: 'Sun', value: 1 }
      ];
    }
  },

  // Get app usage distribution (for pie chart)
  async getAppUsageDistribution(): Promise<AppUsageMetric[]> {
    try {
      console.log("=== STARTING getAppUsageDistribution() ===");
      
      // Set date range for last 7 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);
      
      console.log(`Fetching app usage for date range: ${startDate.toISOString()} to ${endDate.toISOString()}`);
      
      // Query conversations with date filtering
      const { data, error } = await supabase
        .from('conversations')
        .select('app_name')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());
      
      if (error) {
        console.error("Database error:", error);
        throw error;
      }
      
      console.log("Raw database response:", {
        dataLength: data?.length || 0,
        sampleData: data?.slice(0, 3)
      });
      
      // Count conversations by app name
      const appCounts: { [key: string]: number } = {};
      data.forEach(conv => {
        const appName = conv.app_name || 'Unknown';
        appCounts[appName] = (appCounts[appName] || 0) + 1;
      });
      
      console.log("Processed app counts:", appCounts);
      
      // Format for chart
      const appUsageData = Object.entries(appCounts).map(([name, value]) => ({
        name,
        value
      }));
      
      console.log("Final formatted data:", appUsageData);
      
      // If no data, return demo data
      if (appUsageData.length === 0) {
        console.log("No data found, returning demo data");
        return [
          { name: 'weather_app', value: 2 },
          { name: 'travel_planner', value: 2 },
          { name: 'recipe_finder', value: 2 },
          { name: 'workout_planner', value: 2 },
          { name: 'shopping_assistant', value: 2 }
        ];
      }
      
      return appUsageData;
    } catch (error) {
      console.error('Error in getAppUsageDistribution:', error);
      // Return demo data if there's an error
      return [
        { name: 'weather_app', value: 2 },
        { name: 'travel_planner', value: 2 },
        { name: 'recipe_finder', value: 2 },
        { name: 'workout_planner', value: 2 },
        { name: 'shopping_assistant', value: 2 }
      ];
    }
  },

  // Get recent conversations
  async getRecentConversations(limit = 5): Promise<RecentConversation[]> {
    try {
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select('conversation_id, app_name, created_at')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (convError) throw convError;
      
      const result: RecentConversation[] = [];
      
      // For each conversation, get the total tokens consumed
      for (const conv of conversations) {
        const { data: messages, error: msgError } = await supabase
          .from('messages')
          .select('tokens_consumed')
          .eq('conversation_id', conv.conversation_id)
          .not('tokens_consumed', 'is', null);
        
        if (msgError) continue;
        
        const totalTokens = messages.reduce((sum, msg) => sum + getTotalTokens(msg.tokens_consumed), 0);
        const timeAgo = getTimeAgo(new Date(conv.created_at || ''));
        
        result.push({
          id: conv.conversation_id,
          app: conv.app_name || 'Unknown',
          time: timeAgo,
          status: 'Completed',
          tokens: totalTokens
        });
      }
      
      // If no data, return demo data
      if (result.length === 0) {
        return [
          { id: "11111111-1111-1111-1111-111111111111", app: "weather_app", time: "2 days ago", status: "Completed", tokens: 45 },
          { id: "22222222-2222-2222-2222-222222222222", app: "travel_planner", time: "3 days ago", status: "Completed", tokens: 76 },
          { id: "33333333-3333-3333-3333-333333333333", app: "recipe_finder", time: "4 days ago", status: "Completed", tokens: 90 },
          { id: "44444444-4444-4444-4444-444444444444", app: "weather_app", time: "5 days ago", status: "Completed", tokens: 52 },
          { id: "55555555-5555-5555-5555-555555555555", app: "shopping_assistant", time: "6 days ago", status: "Completed", tokens: 68 }
        ];
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching recent conversations:', error);
      // Return demo data if there's an error
      return [
        { id: "11111111-1111-1111-1111-111111111111", app: "weather_app", time: "2 days ago", status: "Completed", tokens: 45 },
        { id: "22222222-2222-2222-2222-222222222222", app: "travel_planner", time: "3 days ago", status: "Completed", tokens: 76 },
        { id: "33333333-3333-3333-3333-333333333333", app: "recipe_finder", time: "4 days ago", status: "Completed", tokens: 90 },
        { id: "44444444-4444-4444-4444-444444444444", app: "weather_app", time: "5 days ago", status: "Completed", tokens: 52 },
        { id: "55555555-5555-5555-5555-555555555555", app: "shopping_assistant", time: "6 days ago", status: "Completed", tokens: 68 }
      ];
    }
  },

  // Get framework comparison data
  async getFrameworkComparison(): Promise<{
    responseTimeData: any[],
    accuracyData: any[],
    tokenUsageData: any[]
  }> {
    try {
      // Get actual average latency from our database
      const { data: latencyData, error: latencyError } = await supabase
        .from('messages')
        .select('latency_ms')
        .not('latency_ms', 'is', null);
      
      if (latencyError) throw latencyError;
      
      const avgLatency = latencyData.length > 0
        ? latencyData.reduce((sum, msg) => sum + (msg.latency_ms || 0), 0) / latencyData.length
        : 1372.5;
      
      // Real mAI latency from database, mock data for others
      const responseTimeData = [
        { name: "mAI", value: avgLatency, color: "#005B99", best: true },
        { name: "CrewAI", value: 15000, color: "#888888", best: false },
        { name: "Autogen", value: 7000, color: "#888888", best: false },
        { name: "LangGraph", value: 8000, color: "#888888", best: false }
      ];
      
      // Mock data for accuracy - no real way to measure this from the database
      const accuracyData = [
        { name: "mAI", value: 92, color: "#005B99", best: true },
        { name: "CrewAI", value: 72, color: "#888888", best: false },
        { name: "Autogen", value: 80, color: "#888888", best: false },
        { name: "LangGraph", value: 83, color: "#888888", best: false }
      ];
      
      // Mock data for token usage - we'd need comparative data
      const tokenUsageData = [
        { name: "mAI", value: 50, color: "#005B99", best: true },
        { name: "CrewAI", value: 100, color: "#888888", best: false },
        { name: "Autogen", value: 100, color: "#888888", best: false },
        { name: "LangGraph", value: 100, color: "#888888", best: false }
      ];
      
      return {
        responseTimeData,
        accuracyData,
        tokenUsageData
      };
    } catch (error) {
      console.error('Error fetching framework comparison data:', error);
      // Return mock data if there's an error
      return {
        responseTimeData: [
          { name: "mAI", value: 1372, color: "#005B99", best: true },
          { name: "CrewAI", value: 15000, color: "#888888", best: false },
          { name: "Autogen", value: 7000, color: "#888888", best: false },
          { name: "LangGraph", value: 8000, color: "#888888", best: false }
        ],
        accuracyData: [
          { name: "mAI", value: 92, color: "#005B99", best: true },
          { name: "CrewAI", value: 72, color: "#888888", best: false },
          { name: "Autogen", value: 80, color: "#888888", best: false },
          { name: "LangGraph", value: 83, color: "#888888", best: false }
        ],
        tokenUsageData: [
          { name: "mAI", value: 50, color: "#005B99", best: true },
          { name: "CrewAI", value: 100, color: "#888888", best: false },
          { name: "Autogen", value: 100, color: "#888888", best: false },
          { name: "LangGraph", value: 100, color: "#888888", best: false }
        ]
      };
    }
  },

  // Get latency trends (for latency line chart)
  async getLatencyTrends(days = 12, fromDate?: Date, toDate?: Date): Promise<{
    trendData: DailyMetric[],
    modelData: {
      provider: string,
      model: string, 
      avgLatency: number
    }[]
  }> {
    try {
      // Use either provided dates or calculate based on days
      const endDate = toDate || new Date();
      const startDate = fromDate || new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000));
      
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
      console.log(`Fetching latency trends from ${startDate.toISOString()} to ${endDate.toISOString()} (${daysDiff} days)`);
      
      // Get model latency data using the query
      const { data: modelQueryData, error: modelQueryError } = await supabase
        .from('messages')
        .select('llm_provider, llm_model, latency_ms')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .not('latency_ms', 'is', null);
      
      if (modelQueryError) throw modelQueryError;
      
      // Group by provider and model to calculate average latency
      const modelGroups: { [key: string]: { provider: string, model: string, values: number[] } } = {};
      
      modelQueryData.forEach(msg => {
        const provider = msg.llm_provider || 'unknown';
        const model = msg.llm_model || 'unknown';
        const key = `${provider}-${model}`;
        
        if (!modelGroups[key]) {
          modelGroups[key] = {
            provider,
            model,
            values: []
          };
        }
        
        if (msg.latency_ms !== null) {
          modelGroups[key].values.push(msg.latency_ms);
        }
      });
      
      // Calculate averages exactly like the SQL query would
      const modelData = Object.values(modelGroups)
        .map(group => ({
          provider: group.provider,
          model: group.model,
          avgLatency: group.values.length > 0 
            ? Math.round(group.values.reduce((sum, val) => sum + val, 0) / group.values.length) 
            : 0
        }))
        .filter(item => item.avgLatency > 0)
        .sort((a, b) => b.avgLatency - a.avgLatency);
      
      console.log(`Found ${modelData.length} models with latency data`);
      
      // Get daily trend data
      const { data: dayData, error: dayError } = await supabase
        .from('messages')
        .select('created_at, latency_ms')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .not('latency_ms', 'is', null);
      
      if (dayError) throw dayError;
      
      // Group latency by day and calculate averages
      const dailyLatencies: { [key: string]: number[] } = {};
      const dateLabels: string[] = [];
      
      // Initialize all days with empty arrays
      for (let i = 0; i < daysDiff; i++) {
        const date = new Date(endDate);
        date.setDate(endDate.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        dailyLatencies[dateStr] = [];
        dateLabels.unshift(dateStr);
      }
      
      // Group latencies by day
      dayData.forEach(msg => {
        const dateStr = new Date(msg.created_at || '').toISOString().split('T')[0];
        if (dailyLatencies[dateStr] !== undefined && msg.latency_ms !== null) {
          dailyLatencies[dateStr].push(msg.latency_ms);
        }
      });
      
      // Calculate averages and format for chart
      const trendData = dateLabels.map(date => {
        const dayLatencies = dailyLatencies[date];
        const avgLatency = dayLatencies.length > 0
          ? dayLatencies.reduce((sum, latency) => sum + latency, 0) / dayLatencies.length
          : 0;
        
        const month = new Date(date).toLocaleDateString('en-US', { month: 'short' });
        const day = new Date(date).getDate();
        
        return {
          date: `${month} ${day}`,
          value: Math.round(avgLatency)
        };
      });
      
      // If no data, return mock data
      if (trendData.every(item => item.value === 0) && modelData.length === 0) {
        console.log("No latency data found, returning mock data");
        return {
          trendData: latencyTrendMockData(),
          modelData: [
            { provider: 'OpenAI', model: 'gpt-4o', avgLatency: 580 },
            { provider: 'Anthropic', model: 'claude-3-opus', avgLatency: 720 },
            { provider: 'OpenAI', model: 'gpt-4-turbo', avgLatency: 620 },
            { provider: 'Anthropic', model: 'claude-3-sonnet', avgLatency: 650 }
          ]
        };
      }
      
      return { trendData, modelData };
    } catch (error) {
      console.error('Error fetching latency trends:', error);
      // Return mock data if there's an error
      return {
        trendData: latencyTrendMockData(),
        modelData: [
          { provider: 'OpenAI', model: 'gpt-4o', avgLatency: 580 },
          { provider: 'Anthropic', model: 'claude-3-opus', avgLatency: 720 },
          { provider: 'OpenAI', model: 'gpt-4-turbo', avgLatency: 620 },
          { provider: 'Anthropic', model: 'claude-3-sonnet', avgLatency: 650 }
        ]
      };
    }
  },

  // Get token usage trends (for token usage area chart)
  async getTokenUsageTrends(days = 12, fromDate?: Date, toDate?: Date): Promise<{
    trendData: { date: string, tokens: number }[],
    modelData: {
      provider: string,
      model: string, 
      avgTokens: number,
      totalTokens: number
    }[]
  }> {
    try {
      // Use either provided dates or calculate based on days
      const endDate = toDate || new Date();
      const startDate = fromDate || new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000));
      
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
      console.log(`Fetching token usage trends from ${startDate.toISOString()} to ${endDate.toISOString()} (${daysDiff} days)`);
      
      // Get model token usage data directly
      const { data: modelTokenData, error: modelTokenError } = await supabase
        .from('messages')
        .select('llm_provider, llm_model, tokens_consumed')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .not('tokens_consumed', 'is', null);
      
      if (modelTokenError) throw modelTokenError;
      
      // Group by provider and model to calculate token statistics
      const modelGroups: { [key: string]: { provider: string, model: string, tokens: number[] } } = {};
      
      modelTokenData.forEach(msg => {
        if (msg.tokens_consumed) {
          const provider = msg.llm_provider || 'unknown';
          const model = msg.llm_model || 'unknown';
          const key = `${provider}-${model}`;
          const tokens = getTotalTokens(msg.tokens_consumed);
          
          if (tokens > 0) {
            if (!modelGroups[key]) {
              modelGroups[key] = {
                provider,
                model,
                tokens: []
              };
            }
            modelGroups[key].tokens.push(tokens);
          }
        }
      });
      
      // Calculate token statistics by model
      const modelData = Object.values(modelGroups)
        .map(group => ({
          provider: group.provider,
          model: group.model,
          avgTokens: group.tokens.length > 0 
            ? Math.round(group.tokens.reduce((sum, val) => sum + val, 0) / group.tokens.length) 
            : 0,
          totalTokens: group.tokens.reduce((sum, val) => sum + val, 0)
        }))
        .filter(item => item.avgTokens > 0)
        .sort((a, b) => b.totalTokens - a.totalTokens);
      
      console.log(`Found ${modelData.length} models with token data`);
      
      // Get daily trend data
      const { data: dayData, error: dayError } = await supabase
        .from('messages')
        .select('created_at, tokens_consumed, role')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .not('tokens_consumed', 'is', null);
      
      if (dayError) throw dayError;
      
      // Group tokens by day and calculate daily totals
      const dailyTokens: { [key: string]: number } = {};
      const dateLabels: string[] = [];
      
      // Initialize all days with zero tokens
      for (let i = 0; i < daysDiff; i++) {
        const date = new Date(endDate);
        date.setDate(endDate.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        dailyTokens[dateStr] = 0;
        dateLabels.unshift(dateStr);
      }
      
      // Sum tokens by day
      dayData.forEach(msg => {
        if (msg.tokens_consumed) {
          const dateStr = new Date(msg.created_at).toISOString().split('T')[0];
          if (dailyTokens[dateStr] !== undefined) {
            dailyTokens[dateStr] += getTotalTokens(msg.tokens_consumed, msg.role);
          }
        }
      });
      
      // Format for chart display
      const trendData = dateLabels.map(date => {
        const tokens = dailyTokens[date] || 0;
        const month = new Date(date).toLocaleDateString('en-US', { month: 'short' });
        const day = new Date(date).getDate();
        
        return {
          date: `${month} ${day}`,
          tokens
        };
      });
      
      // If no data, return mock data
      if (trendData.every(item => item.tokens === 0) && modelData.length === 0) {
        console.log("No token data found, returning mock data");
        return {
          trendData: tokenUsageTrendMockData(),
          modelData: [
            { provider: 'OpenAI', model: 'gpt-4o', avgTokens: 4800, totalTokens: 24000 },
            { provider: 'Anthropic', model: 'claude-3-opus', avgTokens: 6200, totalTokens: 31000 },
            { provider: 'OpenAI', model: 'gpt-4-turbo', avgTokens: 5200, totalTokens: 26000 },
            { provider: 'Anthropic', model: 'claude-3-sonnet', avgTokens: 5600, totalTokens: 28000 }
          ]
        };
      }
      
      return { trendData, modelData };
    } catch (error) {
      console.error('Error fetching token usage trends:', error);
      // Return mock data if there's an error
      return {
        trendData: tokenUsageTrendMockData(),
        modelData: [
          { provider: 'OpenAI', model: 'gpt-4o', avgTokens: 4800, totalTokens: 24000 },
          { provider: 'Anthropic', model: 'claude-3-opus', avgTokens: 6200, totalTokens: 31000 },
          { provider: 'OpenAI', model: 'gpt-4-turbo', avgTokens: 5200, totalTokens: 26000 },
          { provider: 'Anthropic', model: 'claude-3-sonnet', avgTokens: 5600, totalTokens: 28000 }
        ]
      };
    }
  },

  // Get latency distribution statistics for box plot - simplified version
  async getLatencyDistribution(startDate: Date, endDate: Date) {
    try {
      console.log("=== STARTING getLatencyDistribution() ===");
      console.log(`Fetching distribution data from ${startDate.toISOString()} to ${endDate.toISOString()}`);
      
      // Set a timeout to avoid hanging
      const startTime = Date.now();
      const TIMEOUT_MS = 10000;
      
      // First, get unique models with a simpler query
      const { data: distinctModels, error: distinctError } = await supabase
        .from('messages')
        .select('llm_provider, llm_model')
        .not('latency_ms', 'is', null)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .limit(200);
      
      if (distinctError) {
        console.error("Error fetching distinct models:", distinctError);
        return { distributionData: [] };
      }
      
      // Create a Set to get unique model-provider combinations
      const uniqueModels = new Map();
      (distinctModels || []).forEach(item => {
        const key = `${item.llm_provider}|${item.llm_model}`;
        if (!uniqueModels.has(key)) {
          uniqueModels.set(key, {
            provider: item.llm_provider,
            model: item.llm_model
          });
        }
      });
      
      // Convert to array and limit to top 15 models for performance
      const modelsList = Array.from(uniqueModels.values()).slice(0, 15);
      console.log(`Processing ${modelsList.length} unique models`);
      
      if (modelsList.length === 0) {
        return { distributionData: [] };
      }
      
      // Process each model one by one (safer than parallel processing)
      const results = [];
      for (const modelInfo of modelsList) {
        // Check for timeout
        if (Date.now() - startTime > TIMEOUT_MS) {
          console.warn("Timeout reached while processing models");
          break; // Stop processing more models
        }
        
        try {
          const { data: samples, error: sampleError } = await supabase
            .from('messages')
            .select('latency_ms')
            .eq('llm_provider', modelInfo.provider)
            .eq('llm_model', modelInfo.model)
            .not('latency_ms', 'is', null)
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString())
            .order('latency_ms')
            .limit(500);
            
          if (sampleError || !samples || samples.length < 5) {
            // Skip models with errors or too few data points
            continue;
          }
          
          // Calculate statistics
          const latencies = samples.map(s => s.latency_ms);
          const len = latencies.length;
          
          results.push({
            provider: modelInfo.provider,
            model: modelInfo.model,
            min: Math.round(latencies[0]),
            max: Math.round(latencies[len - 1]),
            median: Math.round(latencies[Math.floor(len * 0.5)]),
            q1: Math.round(latencies[Math.floor(len * 0.25)]),
            q3: Math.round(latencies[Math.floor(len * 0.75)]),
            count: len
          });
        } catch (err) {
          console.error(`Error processing model ${modelInfo.model}:`, err);
        }
      }
      
      return { distributionData: results };
    } catch (error) {
      console.error("Exception in getLatencyDistribution:", error);
      return { distributionData: [] };
    }
  },

  // Get latency outliers - simplified version
  async getLatencyOutliers(startDate: Date, endDate: Date) {
    try {
      console.log("=== STARTING getLatencyOutliers() ===");
      console.log(`Fetching outliers from ${startDate.toISOString()} to ${endDate.toISOString()}`);
      
      // Set a fixed threshold for now to avoid expensive calculations
      const THRESHOLD_MS = 3000; // Consider anything over 3 seconds an outlier
      
      // Fetch top outliers directly
      const { data: outliers, error: outliersError } = await supabase
        .from('messages')
        .select(`
          message_id,
          conversation_id, 
          created_at,
          latency_ms,
          llm_provider,
          llm_model,
          tokens_consumed,
          content
        `)
        .not('latency_ms', 'is', null)
        .gte('latency_ms', THRESHOLD_MS)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('latency_ms', { ascending: false })
        .limit(10);
      
      if (outliersError) {
        console.error("Error fetching outliers:", outliersError);
        return { outlierData: [], thresholdValue: THRESHOLD_MS };
      }
      
      if (!outliers || outliers.length === 0) {
        console.log("No outliers found above threshold", THRESHOLD_MS);
        return { outlierData: [], thresholdValue: THRESHOLD_MS };
      }
      
      console.log(`Found ${outliers.length} outliers above ${THRESHOLD_MS}ms threshold`);
      console.log("Sample outlier data:", {
        firstOutlier: outliers[0],
        tokensExample: outliers[0]?.tokens_consumed,
        tokensType: outliers[0]?.tokens_consumed ? typeof outliers[0].tokens_consumed : 'undefined'
      });
      
      // Get conversation IDs to fetch app names
      const conversationIds = outliers.map(m => m.conversation_id);
      
      // Fetch conversation data for these outliers
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select('conversation_id, app_name')
        .in('conversation_id', conversationIds);
      
      // Create app name lookup map
      const appNameMap: Record<string, string> = {};
      if (!convError && conversations) {
        conversations.forEach(conv => {
          appNameMap[conv.conversation_id] = conv.app_name;
        });
      }
      
      // Format the outlier data
      const outlierData = outliers.map(item => {
        // Calculate token usage
        let tokenUsage = 0;
        try {
          const tokens = item.tokens_consumed;
          console.log("Processing tokens for message:", {
            messageId: item.message_id,
            tokensRaw: tokens,
            tokensType: typeof tokens,
            isObject: tokens && typeof tokens === 'object'
          });
          
          if (tokens && typeof tokens === 'object') {
            // Handle JSON format with input and output fields
            tokenUsage = (tokens.input || 0) + (tokens.output || 0);
            console.log("Calculated token usage:", {
              messageId: item.message_id,
              input: tokens.input,
              output: tokens.output,
              total: tokenUsage
            });
          }
        } catch (e) {
          console.warn("Error parsing tokens for message:", item.message_id, e);
        }
        
        // Determine probable cause
        let resource = 'Unusual processing time';
        if (tokenUsage > 2000) {
          resource = 'High token usage';
        } else if (item.content && item.content.length > 2000) {
          resource = 'Long message content';
        }
        
        // Return formatted record
        return {
          id: item.message_id,
          conversationId: item.conversation_id,
          timestamp: new Date(item.created_at).toLocaleString(),
          latency: item.latency_ms,
          model: item.llm_model,
          tokens: tokenUsage,
          resource: resource,
          app: appNameMap[item.conversation_id] || 'Unknown'
        };
      });
      
      console.log("Final outlier data:", outlierData);
      return { outlierData, thresholdValue: THRESHOLD_MS };
    } catch (error) {
      console.error("Exception in getLatencyOutliers:", error);
      return { outlierData: [], thresholdValue: 3000 };
    }
  },

  async getLatencyByTimeOfDay(startDate: Date, endDate: Date): Promise<LatencyByTimeOfDay[]> {
    try {
      // For now, always return mock data since we need to update the database schema first
      // to include user_preferences and message.latency field
      return this.getLatencyByTimeOfDayMock();

      /* 
      // This code will be uncommented when we have the proper database schema
      // First check if development mode is enabled
      const devMode = localStorage.getItem('developmentMode') === 'true';
      
      // Return mock data if in development mode
      if (devMode) {
        return this.getLatencyByTimeOfDayMock();
      }

      // Setup result array with 24 hours
      const result: LatencyByTimeOfDay[] = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null,
      }));

      // Format dates for query
      const formattedStartDate = startDate.toISOString();
      const formattedEndDate = endDate.toISOString();

      // Get all messages with timestamps in the date range
      // Only include messages with role="system" as they're the only ones with meaningful latency
      const { data, error } = await supabase
        .from('messages')
        .select('created_at, latency')
        .eq('role', 'system')  // <-- Add this filter for system messages only
        .gte('created_at', formattedStartDate)
        .lte('created_at', formattedEndDate)
        .not('latency', 'is', null)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching latency by time of day data:', error);
        return this.getLatencyByTimeOfDayMock();
      }

      if (!data || data.length === 0) {
        return this.getLatencyByTimeOfDayMock();
      }

      // Process the data to group by day of week and hour
      const dayGroups: { [key: string]: { [hour: number]: number[] } } = {
        monday: {},
        tuesday: {},
        wednesday: {},
        thursday: {},
        friday: {},
        saturday: {},
        sunday: {},
      };

      // Initialize all hours for all days
      for (let hour = 0; hour < 24; hour++) {
        Object.keys(dayGroups).forEach(day => {
          dayGroups[day][hour] = [];
        });
      }

      // Map day number to day name
      const dayMap: { [key: number]: string } = {
        0: 'sunday',
        1: 'monday',
        2: 'tuesday',
        3: 'wednesday',
        4: 'thursday',
        5: 'friday',
        6: 'saturday',
      };

      // Group latency values by day and hour
      data.forEach(message => {
        if (message.latency) {
          const date = new Date(message.created_at);
          const dayOfWeek = dayMap[date.getDay()];
          const hour = date.getHours();
          
          dayGroups[dayOfWeek][hour].push(message.latency);
        }
      });

      // Calculate median latency for each hour and day
      for (let hour = 0; hour < 24; hour++) {
        Object.keys(dayGroups).forEach(day => {
          const values = dayGroups[day][hour];
          if (values.length > 0) {
            // Calculate median
            values.sort((a, b) => a - b);
            const mid = Math.floor(values.length / 2);
            const median = values.length % 2 === 0
              ? (values[mid - 1] + values[mid]) / 2
              : values[mid];
            
            result[hour][day as keyof Omit<LatencyByTimeOfDay, 'hour'>] = median;
          }
        });
      }

      return result;
      */
    } catch (err) {
      console.error('Error in getLatencyByTimeOfDay:', err);
      return this.getLatencyByTimeOfDayMock();
    }
  },

  // Mock data for latency by time of day
  getLatencyByTimeOfDayMock(): LatencyByTimeOfDay[] {
    return Array.from({ length: 24 }, (_, hour) => ({
      hour,
      monday: 250 + Math.floor(Math.random() * 180),
      tuesday: 260 + Math.floor(Math.random() * 190),
      wednesday: 270 + Math.floor(Math.random() * 200),
      thursday: 280 + Math.floor(Math.random() * 180),
      friday: 290 + Math.floor(Math.random() * 170),
      saturday: hour < 8 || hour > 20 ? null : 300 + Math.floor(Math.random() * 150),
      sunday: hour < 9 || hour > 18 ? null : 310 + Math.floor(Math.random() * 140),
    }));
  },

  async getLatencyByApp(startDate: Date, endDate: Date): Promise<LatencyByApp[]> {
    try {
      // For now, return mock data while we implement the database schema
      return this.getLatencyByAppMock();
      
      /* This code will be uncommented when we have the proper schema
      // Format dates for query
      const formattedStartDate = startDate.toISOString();
      const formattedEndDate = endDate.toISOString();

      // Get conversations with their app names in the date range
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select('conversation_id, app_name')
        .gte('created_at', formattedStartDate)
        .lte('created_at', formattedEndDate);

      if (conversationsError || !conversationsData || conversationsData.length === 0) {
        console.error('Error fetching conversations:', conversationsError);
        return this.getLatencyByAppMock();
      }

      // Get all messages with latency information for these conversations
      // Only include messages with role="system" as they're the only ones with meaningful latency
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('conversation_id, latency')
        .eq('role', 'system')  // <-- Add this filter for system messages only
        .in('conversation_id', conversationsData.map(conv => conv.conversation_id))
        .not('latency', 'is', null);

      if (messagesError || !messagesData || messagesData.length === 0) {
        console.error('Error fetching messages:', messagesError);
        return this.getLatencyByAppMock();
      }

      // Create a map from conversation_id to app_name
      const conversationToApp = new Map();
      conversationsData.forEach(conv => {
        conversationToApp.set(conv.conversation_id, conv.app_name);
      });

      // Group latency values by app
      const appLatencyValues: Record<string, number[]> = {};
      
      messagesData.forEach(message => {
        const appName = conversationToApp.get(message.conversation_id);
        if (appName && message.latency) {
          if (!appLatencyValues[appName]) {
            appLatencyValues[appName] = [];
          }
          appLatencyValues[appName].push(message.latency);
        }
      });

      // Calculate statistics for each app
      const result: LatencyByApp[] = [];
      
      Object.entries(appLatencyValues).forEach(([appName, latencies]) => {
        if (latencies.length >= 5) { // Only include apps with enough data
          latencies.sort((a, b) => a - b);
          
          const min = latencies[0];
          const max = latencies[latencies.length - 1];
          
          const medianIndex = Math.floor(latencies.length / 2);
          const median = latencies.length % 2 === 0
            ? (latencies[medianIndex - 1] + latencies[medianIndex]) / 2
            : latencies[medianIndex];
          
          const q1Index = Math.floor(latencies.length * 0.25);
          const q1 = latencies[q1Index];
          
          const q3Index = Math.floor(latencies.length * 0.75);
          const q3 = latencies[q3Index];
          
          result.push({
            name: appName,
            median,
            q1,
            q3,
            min,
            max
          });
        }
      });

      return result.sort((a, b) => a.median - b.median);
      */
    } catch (error) {
      console.error('Error in getLatencyByApp:', error);
      return this.getLatencyByAppMock();
    }
  },

  // Mock data for latency by application
  getLatencyByAppMock(): LatencyByApp[] {
    const apps = [
      "Customer Support",
      "Product Assistant",
      "Internal Tool",
      "Website Chat",
      "Sales Assistant"
    ];
    
    return apps.map(app => {
      const median = 300 + Math.floor(Math.random() * 200);
      const range = 50 + Math.floor(Math.random() * 50);
      const q1 = median - Math.floor(Math.random() * range);
      const q3 = median + Math.floor(Math.random() * range);
      const min = q1 - Math.floor(Math.random() * range);
      const max = q3 + Math.floor(Math.random() * range);
      
      return {
        name: app,
        median,
        q1,
        q3,
        min,
        max
      };
    });
  },

  async getLatencyOverTimeByProvider(startDate: Date, endDate: Date): Promise<LatencyByProviderOverTime[]> {
    try {
      // Format dates for query
      const formattedStartDate = startDate.toISOString();
      const formattedEndDate = endDate.toISOString();

      // Only query system messages with latency values
      const { data, error } = await supabase
        .from('messages')
        .select('created_at, latency_ms, llm_provider')
        .eq('role', 'system')  // Only system messages have meaningful latency
        .gte('created_at', formattedStartDate)
        .lte('created_at', formattedEndDate)
        .not('latency_ms', 'is', null)
        .not('llm_provider', 'is', null)
        .order('created_at', { ascending: true });
      
      if (error || !data || data.length === 0) {
        console.error('Error fetching provider latency data:', error);
        return this.getLatencyOverTimeByProviderMock();
      }
      
      // Collect all unique providers from the data
      const uniqueProviders = new Set<string>();
      data.forEach(message => {
        if (message.llm_provider) {
          uniqueProviders.add(message.llm_provider);
        }
      });
      
      // Convert to array for easier handling
      const providers = Array.from(uniqueProviders);
      
      // Group latencies by date and provider
      const dailyProviderData = new Map<string, Map<string, number[]>>();
      
      data.forEach(message => {
        const date = message.created_at.split('T')[0]; // YYYY-MM-DD format
        const provider = message.llm_provider;
        
        if (!dailyProviderData.has(date)) {
          dailyProviderData.set(date, new Map<string, number[]>());
        }
        
        if (!dailyProviderData.get(date)?.has(provider)) {
          dailyProviderData.get(date)?.set(provider, []);
        }
        
        dailyProviderData.get(date)?.get(provider)?.push(message.latency_ms);
      });
      
      // Calculate daily averages for each provider
      const result: LatencyByProviderOverTime[] = [];
      
      // Ensure we have an entry for each day in the range
      const dayMillis = 24 * 60 * 60 * 1000;
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / dayMillis);
      
      for (let i = 0; i < days; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + i);
        const dateStr = currentDate.toISOString().split('T')[0];
        
        const dataPoint: LatencyByProviderOverTime = { date: dateStr };
        
        // Set values for each provider (or null if no data)
        if (dailyProviderData.has(dateStr)) {
          const providerMap = dailyProviderData.get(dateStr)!;
          
          providers.forEach(provider => {
            if (providerMap.has(provider) && providerMap.get(provider)!.length > 0) {
              // Calculate average latency
              const latencies = providerMap.get(provider)!;
              const sum = latencies.reduce((acc, val) => acc + val, 0);
              dataPoint[provider] = Math.round(sum / latencies.length);
            } else {
              dataPoint[provider] = null; // No data for this provider on this day
            }
          });
        } else {
          // No data for any provider on this day
          providers.forEach(provider => {
            dataPoint[provider] = null;
          });
        }
        
        result.push(dataPoint);
      }
      
      return result;
    } catch (error) {
      console.error('Error in getLatencyOverTimeByProvider:', error);
      return this.getLatencyOverTimeByProviderMock();
    }
  },

  // Mock data for latency over time by provider
  getLatencyOverTimeByProviderMock(): LatencyByProviderOverTime[] {
    // Generate the last 12 days
    const days = 12;
    const result: LatencyByProviderOverTime[] = [];
    
    // Use generic provider names instead of hardcoding real company names
    const mockProviders = ['Provider A', 'Provider B', 'Provider C', 'Provider D', 'Provider E'];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      const dateStr = date.toISOString().split('T')[0];
      
      const dataPoint: LatencyByProviderOverTime = { date: dateStr };
      
      // Generate varying latency values for each provider
      mockProviders.forEach((provider, index) => {
        // Base value varies by provider index to create visual separation
        const baseValue = 270 + (index * 20);
        
        // Add some randomness
        dataPoint[provider] = baseValue + Math.floor(Math.random() * 30);
      });
      
      result.push(dataPoint);
    }
    
    return result;
  },

  /**
   * Fetches latency vs tokens consumption data for the scatter chart
   * @param startDate Start date for filtering 
   * @param endDate End date for filtering
   * @returns Array of data points with token consumption and latency values
   */
  async getTokenVsLatencyData(startDate: Date, endDate: Date): Promise<TokenVsLatencyDataPoint[]> {
    try {
      // Format dates for query
      const formattedStartDate = startDate.toISOString();
      const formattedEndDate = endDate.toISOString();

      // Query messages with token consumption and latency data
      const { data, error } = await supabase
        .from('messages')
        .select('message_id, latency_ms, tokens_consumed, llm_model, llm_provider')
        .eq('role', 'system')  // Only system messages have meaningful latency and tokens
        .gte('created_at', formattedStartDate)
        .lte('created_at', formattedEndDate)
        .not('latency_ms', 'is', null)
        .not('tokens_consumed', 'is', null)
        .not('llm_model', 'is', null)
        .not('llm_provider', 'is', null);
      
      if (error || !data || data.length === 0) {
        console.error('Error fetching token vs latency data:', error);
        return this.getTokenVsLatencyDataMock();
      }

      // Process results to calculate total tokens for each message
      const result: TokenVsLatencyDataPoint[] = [];
      
      data.forEach(message => {
        // Parse tokens_consumed (we know it's always the new format with input and output)
        // Use unknown as intermediate type for safe type conversion
        const tokensData = message.tokens_consumed as unknown as TokenConsumption;
        if (!tokensData || typeof tokensData.input !== 'number' || typeof tokensData.output !== 'number') {
          return; // Skip entries with invalid token data
        }
        
        // Calculate total tokens
        const totalTokens = tokensData.input + tokensData.output;
        
        // Skip entries with zero tokens (shouldn't happen, but being safe)
        if (totalTokens <= 0 || !message.latency_ms) {
          return;
        }
        
        // Add data point
        result.push({
          tokens: totalTokens,
          latency: message.latency_ms,
          model: message.llm_model,
          provider: message.llm_provider
        });
      });
      
      // Filter out extreme outliers (optional)
      // This prevents chart distortion from unusual data points
      if (result.length > 10) {
        // Calculate quartiles for latency
        const latencies = result.map(point => point.latency).sort((a, b) => a - b);
        const q1Index = Math.floor(latencies.length * 0.25);
        const q3Index = Math.floor(latencies.length * 0.75);
        const q1 = latencies[q1Index];
        const q3 = latencies[q3Index];
        const iqr = q3 - q1;
        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;
        
        // Filter out latency outliers (values outside 1.5*IQR from Q1 and Q3)
        return result.filter(point => 
          point.latency >= lowerBound && 
          point.latency <= upperBound
        );
      }
      
      return result;
    } catch (error) {
      console.error('Error in getTokenVsLatencyData:', error);
      return this.getTokenVsLatencyDataMock();
    }
  },

  /**
   * Generates mock data for token vs latency scatter chart
   */
  getTokenVsLatencyDataMock(): TokenVsLatencyDataPoint[] {
    const result: TokenVsLatencyDataPoint[] = [];
    
    // Generate mock data points for different providers and models
    const providers = ['OpenAI', 'Anthropic', 'Google', 'Mistral', 'Cohere'];
    const models = {
      'OpenAI': ['GPT-4', 'GPT-3.5'],
      'Anthropic': ['Claude 3 Opus', 'Claude 3 Sonnet', 'Claude 3 Haiku'],
      'Google': ['Gemini Ultra', 'Gemini Pro'],
      'Mistral': ['Mistral Large', 'Mistral Medium', 'Mistral Small'],
      'Cohere': ['Command R', 'Command']
    };
    
    // For each provider and model, generate some data points
    providers.forEach(provider => {
      const providerModels = models[provider as keyof typeof models] || [];
      
      providerModels.forEach(model => {
        // Generate 20-30 data points per model
        const numPoints = 20 + Math.floor(Math.random() * 10);
        
        // Base token consumption and latency vary by provider and model
        let baseTokens: number, baseLatency: number, tokenVariance: number, latencyVariance: number;
        
        // Set different base values for different providers/models for visual separation
        switch(provider) {
          case 'OpenAI':
            baseTokens = model === 'GPT-4' ? 800 : 600;
            baseLatency = model === 'GPT-4' ? 350 : 300;
            tokenVariance = 400;
            latencyVariance = 100;
            break;
          case 'Anthropic':
            baseTokens = 700;
            baseLatency = 320;
            tokenVariance = 350;
            latencyVariance = 80;
            break;
          case 'Google':
            baseTokens = 900;
            baseLatency = 330;
            tokenVariance = 300;
            latencyVariance = 120;
            break;
          case 'Mistral':
            baseTokens = 650;
            baseLatency = 310;
            tokenVariance = 280;
            latencyVariance = 90;
            break;
          default:
            baseTokens = 750;
            baseLatency = 340;
            tokenVariance = 320;
            latencyVariance = 110;
        }
        
        // Create data points with some randomness but also correlation
        for (let i = 0; i < numPoints; i++) {
          // Create some correlation between tokens and latency
          const tokenFactor = Math.random();
          const tokens = Math.round(baseTokens + tokenFactor * tokenVariance);
          
          // Latency is partly based on tokens (correlation) and partly random
          const latencyRandomness = Math.random() * 0.5; // 50% randomness
          const latencyCorrelation = tokenFactor * 0.5; // 50% correlation with tokens
          const latency = Math.round(baseLatency + latencyCorrelation * latencyVariance + latencyRandomness * latencyVariance);
          
          result.push({
            tokens,
            latency,
            model,
            provider
          });
        }
      });
    });
    
    return result;
  },

  /**
   * Fetches a comparison of message counts for conversations with and without summarization
   */
  async getSummarizationMessageCountComparison(startDate: Date, endDate: Date): Promise<SummarizationMessageCountComparison> {
    try {
      console.log("getSummarizationMessageCountComparison called with:", { startDate, endDate });
      const formattedStartDate = startDate.toISOString();
      const formattedEndDate = endDate.toISOString();

      // Get all messages in the date range
      const { data: messages, error: msgError } = await supabase
        .from('messages')
        .select('conversation_id, was_summarized')
        .gte('created_at', formattedStartDate)
        .lte('created_at', formattedEndDate);

      console.log("Messages data:", { 
        count: messages?.length || 0, 
        error: msgError,
        sampleConversations: messages?.slice(0, 10).map(m => m.conversation_id) || []
      });

      if (msgError || !messages || messages.length === 0) {
        console.error('Error fetching messages:', msgError);
        return this.getSummarizationMessageCountComparisonMock();
      }

      // Identify which conversations have summarization
      const summarizedConvIds = new Set<string>();
      const seenConversations = new Set<string>();
      
      messages.forEach(msg => {
        seenConversations.add(msg.conversation_id);
        if (msg.was_summarized) {
          summarizedConvIds.add(msg.conversation_id);
        }
      });

      console.log("Conversation counts:", { 
        total: seenConversations.size,
        summarized: summarizedConvIds.size,
        nonSummarized: seenConversations.size - summarizedConvIds.size
      });

      // Count messages per conversation
      const conversations: Record<string, { count: number, isSummarized: boolean }> = {};

      messages.forEach(msg => {
        if (!conversations[msg.conversation_id]) {
          conversations[msg.conversation_id] = { 
            count: 0, 
            isSummarized: summarizedConvIds.has(msg.conversation_id) 
          };
        }
        conversations[msg.conversation_id].count++;
      });

      // Calculate average message counts
      let summarizedCount = 0;
      let summarizedTotal = 0;
      let nonSummarizedCount = 0;
      let nonSummarizedTotal = 0;

      Object.values(conversations).forEach(conv => {
        if (conv.isSummarized) {
          summarizedTotal += conv.count;
          summarizedCount++;
        } else {
          nonSummarizedTotal += conv.count;
          nonSummarizedCount++;
        }
      });

      console.log("Calculation details:", {
        summarizedCount,
        summarizedTotal,
        nonSummarizedCount,
        nonSummarizedTotal
      });

      // If we don't have both types of conversations, return mock data
      if (summarizedCount === 0 || nonSummarizedCount === 0) {
        console.log("Missing one type of conversation, returning mock data");
        return this.getSummarizationMessageCountComparisonMock();
      }

      // Calculate averages
      const withSummary = Math.round(summarizedTotal / summarizedCount);
      const withoutSummary = Math.round(nonSummarizedTotal / nonSummarizedCount);

      console.log("Final comparison data:", { withSummary, withoutSummary });
      return { withSummary, withoutSummary };
    } catch (error) {
      console.error('Error in getSummarizationMessageCountComparison:', error);
      return this.getSummarizationMessageCountComparisonMock();
    }
  },

  /**
   * Fetches feedback statistics on conversations using summarization
   */
  async getSummarizationFeedback(startDate: Date, endDate: Date): Promise<SummarizationFeedback> {
    try {
      console.log("getSummarizationFeedback called with:", { startDate, endDate });
      const formattedStartDate = startDate.toISOString();
      const formattedEndDate = endDate.toISOString();

      // Get all messages within date range (we'll filter by was_summarized after getting real data)
      const { data: messagesData, error: msgError } = await supabase
        .from('messages')
        .select('message_id, created_at, was_summarized')
        .gte('created_at', formattedStartDate)
        .lte('created_at', formattedEndDate);

      console.log("Messages data:", { count: messagesData?.length || 0, error: msgError });
      
      if (msgError || !messagesData || messagesData.length === 0) {
        console.error('Error fetching messages:', msgError);
        return this.getSummarizationFeedbackMock();
      }

      // Filter to get only summarized messages
      const summarizedMessages = messagesData.filter(msg => msg.was_summarized);
      console.log("Summarized messages count:", summarizedMessages.length);
      
      if (summarizedMessages.length === 0) {
        console.log("No summarized messages found, returning mock data");
        return this.getSummarizationFeedbackMock();
      }

      // Extract message IDs
      const summarizedMessageIds = summarizedMessages.map(msg => msg.message_id);

      // Get feedback for these messages
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('message_feedback')
        .select('message_id, is_positive')
        .in('message_id', summarizedMessageIds);

      console.log("Feedback data:", { 
        count: feedbackData?.length || 0, 
        error: feedbackError,
        sample: feedbackData?.slice(0, 3) || []
      });

      if (feedbackError) {
        console.error('Error fetching feedback data:', feedbackError);
        return this.getSummarizationFeedbackMock();
      }

      // Count feedback categories
      let positiveCount = 0;
      let negativeCount = 0;

      if (feedbackData) {
        positiveCount = feedbackData.filter(f => f.is_positive === true).length;
        negativeCount = feedbackData.filter(f => f.is_positive === false).length;
      }

      // Messages without feedback are considered neutral
      const neutralCount = summarizedMessageIds.length - (positiveCount + negativeCount);
      console.log("Feedback counts:", { positiveCount, negativeCount, neutralCount });

      // Calculate percentages
      const total = summarizedMessageIds.length;
      if (total === 0) {
        console.log("Total is zero, returning mock data");
        return this.getSummarizationFeedbackMock();
      }
      
      const positive = Math.round((positiveCount / total) * 100);
      const negative = Math.round((negativeCount / total) * 100);
      const neutral = 100 - (positive + negative); // Ensure percentages add up to 100

      console.log("Calculated percentages:", { positive, negative, neutral });
      return { positive, negative, neutral };
    } catch (error) {
      console.error('Error in getSummarizationFeedback:', error);
      return this.getSummarizationFeedbackMock();
    }
  },

  /**
   * Fetches impact metrics for conversations with summarization vs without
   */
  async getSummarizationImpact(startDate: Date, endDate: Date): Promise<SummarizationImpact> {
    try {
      console.log("getSummarizationImpact called with:", { startDate, endDate });
      const formattedStartDate = startDate.toISOString();
      const formattedEndDate = endDate.toISOString();

      // Get all messages with their conversation and summarization status
      const { data: messages, error: msgError } = await supabase
        .from('messages')
        .select('message_id, conversation_id, created_at, was_summarized')
        .gte('created_at', formattedStartDate)
        .lte('created_at', formattedEndDate)
        .order('created_at', { ascending: true });

      console.log("Messages query result:", { 
        count: messages?.length || 0, 
        error: msgError 
      });

      if (msgError || !messages || messages.length === 0) {
        console.error('Error fetching messages:', msgError);
        return this.getSummarizationImpactMock();
      }

      // Identify which conversations have summarization
      const summarizedConvIds = new Set<string>();
      messages.forEach(msg => {
        if (msg.was_summarized) {
          summarizedConvIds.add(msg.conversation_id);
        }
      });

      console.log("Summarized conversations:", summarizedConvIds.size);

      // Group messages by conversation
      const conversationMessages: Record<string, typeof messages> = {};
      messages.forEach(msg => {
        if (!conversationMessages[msg.conversation_id]) {
          conversationMessages[msg.conversation_id] = [];
        }
        conversationMessages[msg.conversation_id].push(msg);
      });

      // Calculate conversation times and message counts
      const summarizedStats = { timeTotal: 0, messageTotal: 0, count: 0 };
      const nonSummarizedStats = { timeTotal: 0, messageTotal: 0, count: 0 };

      Object.entries(conversationMessages).forEach(([convId, msgs]) => {
        if (msgs.length < 2) return; // Skip conversations with only one message

        // Calculate conversation duration
        const firstMsg = msgs[0];
        const lastMsg = msgs[msgs.length - 1];
        const startTime = new Date(firstMsg.created_at).getTime();
        const endTime = new Date(lastMsg.created_at).getTime();
        const duration = (endTime - startTime) / 1000; // Duration in seconds

        // Add to appropriate stats
        if (summarizedConvIds.has(convId)) {
          summarizedStats.timeTotal += duration;
          summarizedStats.messageTotal += msgs.length;
          summarizedStats.count++;
        } else {
          nonSummarizedStats.timeTotal += duration;
          nonSummarizedStats.messageTotal += msgs.length;
          nonSummarizedStats.count++;
        }
      });

      console.log("Statistics calculation:", {
        summarized: summarizedStats,
        nonSummarized: nonSummarizedStats
      });

      // Get feedback for messages to calculate satisfaction
      // Only if we have a decent number of conversations in both categories
      let userSatisfaction = 0;
      let taskCompletion = 0;

      if (summarizedStats.count > 0 && nonSummarizedStats.count > 0) {
        // Get message IDs for feedback lookup
        const allMessageIds = messages.map(msg => msg.message_id);

        // Get feedback data
        const { data: feedbackData, error: feedbackError } = await supabase
          .from('message_feedback')
          .select('message_id, is_positive')
          .in('message_id', allMessageIds);

        console.log("Feedback data:", { 
          count: feedbackData?.length || 0, 
          error: feedbackError 
        });

        if (!feedbackError && feedbackData && feedbackData.length > 0) {
          // Group feedback by message
          const feedbackByMessage: Record<string, boolean> = {};
          feedbackData.forEach(feedback => {
            feedbackByMessage[feedback.message_id] = feedback.is_positive;
          });

          // Calculate satisfaction rates
          let summarizedPositiveFeedback = 0;
          let summarizedFeedbackTotal = 0;
          let nonSummarizedPositiveFeedback = 0;
          let nonSummarizedFeedbackTotal = 0;

          // Count positive feedback for each group
          messages.forEach(msg => {
            if (msg.message_id in feedbackByMessage) {
              if (summarizedConvIds.has(msg.conversation_id)) {
                summarizedFeedbackTotal++;
                if (feedbackByMessage[msg.message_id]) {
                  summarizedPositiveFeedback++;
                }
              } else {
                nonSummarizedFeedbackTotal++;
                if (feedbackByMessage[msg.message_id]) {
                  nonSummarizedPositiveFeedback++;
                }
              }
            }
          });

          console.log("Feedback calculations:", {
            summarizedPositive: summarizedPositiveFeedback,
            summarizedTotal: summarizedFeedbackTotal,
            nonSummarizedPositive: nonSummarizedPositiveFeedback,
            nonSummarizedTotal: nonSummarizedFeedbackTotal
          });

          // Calculate satisfaction percentages if we have enough data
          if (summarizedFeedbackTotal > 0 && nonSummarizedFeedbackTotal > 0) {
            const summarizedSatisfaction = (summarizedPositiveFeedback / summarizedFeedbackTotal) * 100;
            const nonSummarizedSatisfaction = (nonSummarizedPositiveFeedback / nonSummarizedFeedbackTotal) * 100;
            
            // Calculate percentage change in satisfaction
            userSatisfaction = calculatePercentageChange(summarizedSatisfaction, nonSummarizedSatisfaction);
            
            // For task completion, use the same satisfaction metrics
            // (In a real implementation, you might have specific task completion data)
            taskCompletion = userSatisfaction;
          }
        }
      }

      // Calculate averages and percentage changes
      if (summarizedStats.count === 0 || nonSummarizedStats.count === 0) {
        console.log("Not enough data in both categories, returning mock data");
        return this.getSummarizationImpactMock();
      }

      const summarizedAvgTime = summarizedStats.timeTotal / summarizedStats.count;
      const nonSummarizedAvgTime = nonSummarizedStats.timeTotal / nonSummarizedStats.count;
      
      const summarizedAvgMessages = summarizedStats.messageTotal / summarizedStats.count;
      const nonSummarizedAvgMessages = nonSummarizedStats.messageTotal / nonSummarizedStats.count;

      // Calculate percentage changes (negative means reduction, which is good for time and message count)
      const conversationTime = calculatePercentageChange(summarizedAvgTime, nonSummarizedAvgTime) * -1;
      const messagesCount = calculatePercentageChange(summarizedAvgMessages, nonSummarizedAvgMessages) * -1;

      const result = {
        conversationTime,
        messagesCount,
        userSatisfaction,
        taskCompletion
      };

      console.log("Final impact metrics:", result);
      return result;
    } catch (error) {
      console.error('Error in getSummarizationImpact:', error);
      return this.getSummarizationImpactMock();
    }
  },

  /**
   * Mock data for summarization message count comparison
   */
  getSummarizationMessageCountComparisonMock(): SummarizationMessageCountComparison {
    console.log("⚠️ Using MOCK data for message count comparison");
    return {
      withSummary: 7,
      withoutSummary: 22
    };
  },

  /**
   * Mock data for summarization feedback
   */
  getSummarizationFeedbackMock(): SummarizationFeedback {
    console.log("⚠️ Using MOCK data for feedback statistics");
    return {
      positive: 70,
      neutral: 18,
      negative: 12
    };
  },

  /**
   * Mock data for summarization impact
   */
  getSummarizationImpactMock(): SummarizationImpact {
    console.log("⚠️ Using MOCK data for impact metrics");
    return {
      conversationTime: -32, // 32% reduction in time
      messagesCount: -28,    // 28% reduction in messages
      userSatisfaction: 18,  // 18% increase in satisfaction
      taskCompletion: 15     // 15% increase in task completion
    };
  }
};

// Helper function to format time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

// Mock data functions
function latencyTrendMockData(): DailyMetric[] {
  return [
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
}

function tokenUsageTrendMockData(): { date: string, tokens: number }[] {
  return [
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
} 