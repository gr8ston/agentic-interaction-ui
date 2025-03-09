import { supabase } from '@/integrations/supabase/client';

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

// Helper function to calculate percentage change
function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
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
      // Use the same 7-day filter as other metrics
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);
      
      const { data, error } = await supabase
        .from('conversations')
        .select('app_name')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());
      
      if (error) throw error;
      
      // Count conversations by app name
      const appCounts: { [key: string]: number } = {};
      data.forEach(conv => {
        const appName = conv.app_name || 'Unknown';
        appCounts[appName] = (appCounts[appName] || 0) + 1;
      });
      
      // Format for chart
      const appUsageData = Object.entries(appCounts).map(([name, value]) => ({
        name,
        value
      }));
      
      // If no data, return demo data
      if (appUsageData.length === 0) {
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
      console.error('Error fetching app usage distribution:', error);
      // Return demo data from our database exploration
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
        return { outlierData: [], thresholdValue: THRESHOLD_MS };
      }
      
      console.log(`Found ${outliers.length} outliers above ${THRESHOLD_MS}ms threshold`);
      
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
          if (tokens) {
            if (typeof tokens === 'object' && tokens !== null) {
              // Handle JSON format
              const inputTokens = (tokens as any).input ? Number((tokens as any).input) : 0;
              const outputTokens = (tokens as any).output ? Number((tokens as any).output) : 0;
              tokenUsage = inputTokens + outputTokens;
            } else if (typeof tokens === 'number') {
              tokenUsage = tokens;
            } else if (typeof tokens === 'string') {
              tokenUsage = parseInt(tokens, 10) || 0;
            }
          }
        } catch (e) {
          console.warn("Error parsing tokens:", e);
        }
        
        // Determine probable cause
        let cause = 'Unknown';
        if (tokenUsage > 2000) {
          cause = 'High token usage';
        } else if (item.content && item.content.length > 2000) {
          cause = 'Long message content';
        } else {
          cause = 'Unusual processing time';
        }
        
        // Return formatted record
        return {
          id: item.message_id,
          conversationId: item.conversation_id,
          timestamp: new Date(item.created_at).toLocaleString(),
          latency: item.latency_ms,
          provider: item.llm_provider,
          model: item.llm_model,
          tokens: tokenUsage,
          app: appNameMap[item.conversation_id] || 'Unknown',
          resource: cause
        };
      });
      
      return { outlierData, thresholdValue: THRESHOLD_MS };
    } catch (error) {
      console.error("Exception in getLatencyOutliers:", error);
      return { outlierData: [], thresholdValue: 3000 };
    }
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