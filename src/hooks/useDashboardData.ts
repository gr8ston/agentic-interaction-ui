
import { useState, useEffect } from 'react';
import { supabaseService, ConversationMetrics, DailyMetric, RecentConversation } from "@/services/supabase-service";
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
  
  const fetchData = async () => {
    console.log("DASHBOARD: fetchData started");
    setIsLoading(true);
    setHasError(false);
    
    console.log("Manual dashboard refresh triggered at", new Date().toISOString());
    
    try {
      // Fetch all data in parallel
      console.log("DASHBOARD: Starting Promise.allSettled for data fetching");
      const results = await Promise.allSettled([
        supabaseService.getOverviewMetrics(),
        supabaseService.getConversationTrends(),
        supabaseService.getAppUsageDistribution(),
        supabaseService.getRecentConversations()
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
        // Add percentage property to app usage data
        const appUsageData = results[2].value;
        const totalApps = appUsageData.reduce((sum, app) => sum + app.value, 0);
        
        const enhancedAppUsage = appUsageData.map(app => ({
          ...app,
          percentage: totalApps > 0 ? Math.round((app.value / totalApps) * 100) : 0
        }));
        
        setAppUsage(enhancedAppUsage);
      } else {
        console.error("Error fetching app usage:", results[2].reason);
        setAppUsage([
          { name: 'weather_app', value: 2, percentage: 20 },
          { name: 'travel_planner', value: 2, percentage: 20 },
          { name: 'recipe_finder', value: 2, percentage: 20 },
          { name: 'workout_planner', value: 2, percentage: 20 },
          { name: 'shopping_assistant', value: 2, percentage: 20 }
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
