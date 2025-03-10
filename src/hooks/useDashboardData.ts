import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ConversationMetrics, DailyMetric, RecentConversation, AppUsageMetric } from "@/integrations/supabase/client";
import { ExtendedAppUsageMetric } from "@/types/api";

export function useDashboardData() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  
  const [metrics, setMetrics] = useState<ConversationMetrics>({
    totalConversations: 0,
    totalMessages: 0,
    averageLatency: 0,
    totalTokensConsumed: 0,
    conversationsChange: 0,
    messagesChange: 0,
    latencyChange: 0,
    tokensChange: 0
  });
  
  const [conversationTrends, setConversationTrends] = useState<DailyMetric[]>([]);
  const [appUsage, setAppUsage] = useState<ExtendedAppUsageMetric[]>([]);
  const [recentConversations, setRecentConversations] = useState<RecentConversation[]>([]);

  const getAppUsageDistribution = async (): Promise<ExtendedAppUsageMetric[]> => {
    try {
      console.log("Fetching app usage distribution from Supabase");
      
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
      
      if (error) throw error;
      
      // Process the results to count by app_name
      const appCounts: Record<string, number> = {};
      let totalConversations = 0;
      
      if (data) {
        data.forEach(item => {
          const appName = item.app_name || 'unknown';
          appCounts[appName] = (appCounts[appName] || 0) + 1;
          totalConversations++;
        });
      }
      
      // Convert to the expected format with percentages
      const formattedData: ExtendedAppUsageMetric[] = Object.entries(appCounts).map(([name, value]) => ({
        name,
        value,
        percentage: totalConversations > 0 ? Math.round((value / totalConversations) * 100) : 0
      }));
      
      console.log("App usage data:", {
        totalConversations,
        formattedData
      });
      
      return formattedData;
    } catch (error) {
      console.error("Error in getAppUsageDistribution:", error);
      return [];
    }
  };
  
  const fetchData = async () => {
    console.log("DASHBOARD: fetchData started");
    setIsLoading(true);
    setHasError(false);
    
    console.log("Manual dashboard refresh triggered at", new Date().toISOString());
    
    try {
      // Fetch all data in parallel
      console.log("DASHBOARD: Starting Promise.allSettled for data fetching");
      
      // Replace the supabaseService with direct supabase queries
      const getOverviewMetrics = async (): Promise<ConversationMetrics> => {
        try {
          // Get current period data
          const currentEnd = new Date();
          const currentStart = new Date(currentEnd);
          currentStart.setDate(currentStart.getDate() - 7);
          
          // Get previous period data
          const previousEnd = new Date(currentStart);
          const previousStart = new Date(previousEnd);
          previousStart.setDate(previousStart.getDate() - 7);
          
          // Fetch current period conversations
          const { data: currentConversations, error: currentConversationsError } = await supabase
            .from('conversations')
            .select('conversation_id')
            .gte('created_at', currentStart.toISOString())
            .lte('created_at', currentEnd.toISOString());
            
          if (currentConversationsError) throw currentConversationsError;
          
          // Fetch previous period conversations
          const { data: previousConversations, error: previousConversationsError } = await supabase
            .from('conversations')
            .select('conversation_id')
            .gte('created_at', previousStart.toISOString())
            .lt('created_at', currentStart.toISOString());
            
          if (previousConversationsError) throw previousConversationsError;
          
          // Fetch current period messages
          const { data: currentMessages, error: currentMessagesError } = await supabase
            .from('messages')
            .select('message_id, latency_ms, tokens_consumed')
            .gte('created_at', currentStart.toISOString())
            .lte('created_at', currentEnd.toISOString());
            
          if (currentMessagesError) throw currentMessagesError;
          
          // Fetch previous period messages
          const { data: previousMessages, error: previousMessagesError } = await supabase
            .from('messages')
            .select('message_id, latency_ms, tokens_consumed')
            .gte('created_at', previousStart.toISOString())
            .lt('created_at', currentStart.toISOString());
            
          if (previousMessagesError) throw previousMessagesError;
          
          // Calculate metrics
          const totalCurrentConversations = currentConversations ? currentConversations.length : 0;
          const totalPreviousConversations = previousConversations ? previousConversations.length : 0;
          
          const totalCurrentMessages = currentMessages ? currentMessages.length : 0;
          const totalPreviousMessages = previousMessages ? previousMessages.length : 0;
          
          // Calculate average latency
          let totalCurrentLatency = 0;
          let validCurrentLatencyCount = 0;
          
          let totalPreviousLatency = 0;
          let validPreviousLatencyCount = 0;
          
          // Calculate total tokens
          let totalCurrentTokens = 0;
          let totalPreviousTokens = 0;
          
          if (currentMessages) {
            currentMessages.forEach(msg => {
              if (msg.latency_ms) {
                totalCurrentLatency += msg.latency_ms;
                validCurrentLatencyCount++;
              }
              
              if (msg.tokens_consumed) {
                const tokens = getTotalTokens(msg.tokens_consumed);
                totalCurrentTokens += tokens;
              }
            });
          }
          
          if (previousMessages) {
            previousMessages.forEach(msg => {
              if (msg.latency_ms) {
                totalPreviousLatency += msg.latency_ms;
                validPreviousLatencyCount++;
              }
              
              if (msg.tokens_consumed) {
                const tokens = getTotalTokens(msg.tokens_consumed);
                totalPreviousTokens += tokens;
              }
            });
          }
          
          const averageCurrentLatency = validCurrentLatencyCount > 0 ? totalCurrentLatency / validCurrentLatencyCount : 0;
          const averagePreviousLatency = validPreviousLatencyCount > 0 ? totalPreviousLatency / validPreviousLatencyCount : 0;
          
          // Calculate percentage changes
          const conversationsChange = totalPreviousConversations > 0 
            ? ((totalCurrentConversations - totalPreviousConversations) / totalPreviousConversations) * 100 
            : 0;
            
          const messagesChange = totalPreviousMessages > 0 
            ? ((totalCurrentMessages - totalPreviousMessages) / totalPreviousMessages) * 100 
            : 0;
            
          const latencyChange = averagePreviousLatency > 0 
            ? ((averageCurrentLatency - averagePreviousLatency) / averagePreviousLatency) * 100 
            : 0;
            
          const tokensChange = totalPreviousTokens > 0 
            ? ((totalCurrentTokens - totalPreviousTokens) / totalPreviousTokens) * 100 
            : 0;
          
          return {
            totalConversations: totalCurrentConversations,
            totalMessages: totalCurrentMessages,
            averageLatency: averageCurrentLatency,
            totalTokensConsumed: totalCurrentTokens,
            conversationsChange,
            messagesChange,
            latencyChange,
            tokensChange
          };
        } catch (error) {
          console.error("Error in getOverviewMetrics:", error);
          throw error;
        }
      };
      
      const getConversationTrends = async (): Promise<DailyMetric[]> => {
        try {
          const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const today = new Date();
          const result: DailyMetric[] = [];
          
          // Create array for past 7 days
          for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dayName = daysOfWeek[date.getDay()];
            
            // Calculate start and end of the day
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            
            // Query conversations created on this day
            const { data, error } = await supabase
              .from('conversations')
              .select('conversation_id')
              .gte('created_at', startOfDay.toISOString())
              .lte('created_at', endOfDay.toISOString());
            
            if (error) throw error;
            
            result.push({
              date: dayName,
              value: data ? data.length : 0
            });
          }
          
          return result;
        } catch (error) {
          console.error("Error in getConversationTrends:", error);
          throw error;
        }
      };
      
      const getRecentConversations = async (): Promise<RecentConversation[]> => {
        try {
          const { data, error } = await supabase
            .from('conversations')
            .select(`
              conversation_id,
              app_name,
              created_at,
              metadata
            `)
            .order('created_at', { ascending: false })
            .limit(5);
          
          if (error) throw error;
          
          if (!data) return [];
          
          const conversationIds = data.map(conv => conv.conversation_id);
          
          // Get message counts and token sums for each conversation
          const { data: messagesData, error: messagesError } = await supabase
            .from('messages')
            .select('conversation_id, tokens_consumed')
            .in('conversation_id', conversationIds);
          
          if (messagesError) throw messagesError;
          
          return data.map(conv => {
            // Get messages for this conversation
            const conversationMessages = messagesData ? 
              messagesData.filter(msg => msg.conversation_id === conv.conversation_id) : 
              [];
            
            // Calculate total tokens
            let totalTokens = 0;
            conversationMessages.forEach(msg => {
              if (msg.tokens_consumed) {
                totalTokens += getTotalTokens(msg.tokens_consumed);
              }
            });
            
            // Format the time
            const createdAt = new Date(conv.created_at);
            const now = new Date();
            const diffMs = now.getTime() - createdAt.getTime();
            const diffMins = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            
            let timeAgo;
            if (diffMins < 60) {
              timeAgo = `${diffMins} ${diffMins === 1 ? 'min' : 'mins'} ago`;
            } else if (diffHours < 24) {
              timeAgo = `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
            } else {
              timeAgo = `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
            }
            
            return {
              id: conv.conversation_id,
              app: conv.app_name,
              time: timeAgo,
              status: 'Completed', // Assuming all conversations are completed
              tokens: totalTokens
            };
          });
        } catch (error) {
          console.error("Error in getRecentConversations:", error);
          throw error;
        }
      };
      
      const results = await Promise.allSettled([
        getOverviewMetrics(),
        getConversationTrends(),
        getAppUsageDistribution(),
        getRecentConversations()
      ]);
      
      console.log("DASHBOARD: All promises settled:", results);
      
      // Process results, using fallbacks if any requests failed
      if (results[0].status === 'fulfilled') {
        console.log("Metrics data received:", results[0].value);
        setMetrics(results[0].value);
      } else {
        console.error("Error fetching metrics:", results[0].reason);
        // Set fallback metrics
        console.log("DASHBOARD: Using fallback metrics");
        setMetrics({
          totalConversations: 27,
          totalMessages: 108,
          averageLatency: 1372.5,
          totalTokensConsumed: 541,
          conversationsChange: 12,
          messagesChange: 8,
          latencyChange: 5,
          tokensChange: 8
        });
        setHasError(true);
      }
      
      if (results[1].status === 'fulfilled') {
        console.log("Trends data received:", results[1].value);
        setConversationTrends(results[1].value);
      } else {
        console.error("Error fetching trends:", results[1].reason);
        setConversationTrends([
          { date: 'Mon', value: 2 },
          { date: 'Tue', value: 3 },
          { date: 'Wed', value: 2 },
          { date: 'Thu', value: 4 },
          { date: 'Fri', value: 2 },
          { date: 'Sat', value: 1 },
          { date: 'Sun', value: 1 }
        ]);
        setHasError(true);
      }
      
      if (results[2].status === 'fulfilled') {
        console.log("App usage data received:", results[2].value);
        if (results[2].value && results[2].value.length > 0) {
          setAppUsage(results[2].value);
        } else {
          console.log("No app usage data found, using fallback");
          setAppUsage([
            { name: 'travel_planner', value: 90, percentage: 64 },
            { name: 'weather_app', value: 23, percentage: 16 },
            { name: 'shopping_assistant', value: 23, percentage: 16 },
            { name: 'summarization_test_app', value: 1, percentage: 1 },
            { name: 'auto_conversation_test_app', value: 4, percentage: 3 }
          ]);
          setHasError(true);
        }
      } else {
        console.error("Error fetching app usage:", results[2].reason);
        setAppUsage([
          { name: 'travel_planner', value: 90, percentage: 64 },
          { name: 'weather_app', value: 23, percentage: 16 },
          { name: 'shopping_assistant', value: 23, percentage: 16 },
          { name: 'summarization_test_app', value: 1, percentage: 1 },
          { name: 'auto_conversation_test_app', value: 4, percentage: 3 }
        ]);
        setHasError(true);
      }
      
      if (results[3].status === 'fulfilled') {
        console.log("Recent conversations data received:", results[3].value);
        setRecentConversations(results[3].value);
      } else {
        console.error("Error fetching recent conversations:", results[3].reason);
        setRecentConversations([
          { id: "11111111-1111-1111-1111-111111111111", app: "weather_app", time: "2 days ago", status: "Completed", tokens: 45 },
          { id: "22222222-2222-2222-2222-222222222222", app: "travel_planner", time: "3 days ago", status: "Completed", tokens: 76 },
          { id: "33333333-3333-3333-3333-333333333333", app: "recipe_finder", time: "4 days ago", status: "Completed", tokens: 90 },
          { id: "44444444-4444-4444-4444-444444444444", app: "weather_app", time: "5 days ago", status: "Completed", tokens: 52 },
          { id: "55555555-5555-5555-5555-555555555555", app: "shopping_assistant", time: "6 days ago", status: "Completed", tokens: 68 }
        ]);
        setHasError(true);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setHasError(true);
    } finally {
      console.log("DASHBOARD: fetchData completed, setting isLoading to false");
      setIsLoading(false);
      setLastRefresh(new Date());
    }
  };
  
  // Initialize data
  useEffect(() => {
    console.log("DASHBOARD: useEffect hook running, calling fetchData");
    fetchData().catch(err => {
      console.error("DASHBOARD: Uncaught error in fetchData:", err);
      setIsLoading(false);
      setHasError(true);
    });
    
    // Add cleanup function
    return () => {
      console.log("DASHBOARD: Component unmounting");
    };
  }, []);
  
  return {
    isLoading,
    hasError,
    lastRefresh,
    metrics,
    conversationTrends,
    appUsage,
    recentConversations,
    fetchData
  };
}

// This function is from client.ts, but referenced here directly for the hook to work
function getTotalTokens(tokensObj: unknown): number {
  if (!tokensObj) return 0;
  
  try {
    // Handle different potential formats
    if (typeof tokensObj === 'number') {
      return Number(tokensObj);
    }
    
    if (typeof tokensObj === 'string') {
      return Number(tokensObj);
    }
    
    // If it's an object with prompt_tokens and completion_tokens
    if (typeof tokensObj === 'object' && tokensObj !== null) {
      const obj = tokensObj as Record<string, unknown>;
      let total = 0;
      
      if ('prompt_tokens' in obj && typeof obj.prompt_tokens === 'number') {
        total += Number(obj.prompt_tokens);
      }
      
      if ('completion_tokens' in obj && typeof obj.completion_tokens === 'number') {
        total += Number(obj.completion_tokens);
      }
      
      if ('total_tokens' in obj && typeof obj.total_tokens === 'number') {
        return Number(obj.total_tokens);
      }
      
      return total;
    }
    
    return 0;
  } catch (error) {
    console.error('Error calculating tokens:', error);
    return 0;
  }
}
