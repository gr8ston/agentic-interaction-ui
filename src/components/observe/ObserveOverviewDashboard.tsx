import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { ArrowUp, ArrowDown, Users, MessageSquare, Activity, Clock, RefreshCw, Bug, Database, X } from "lucide-react";
import { ObserveFeatureChart } from "@/components/ObserveFeatureChart";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabaseService, ConversationMetrics, DailyMetric, AppUsageMetric, RecentConversation } from "@/services/supabase-service";
import { Button } from "@/components/ui/button";
import { supabase, getTotalTokens } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

// Just keeping colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const chartConfig = {
  value: {
    label: "Conversations",
    color: "#007ACC"
  }
};

// Type definition for conversation details
interface ConversationDetails {
  conversationId: string;
  app: string;
  created: string;
  messages: {
    id: string;
    content: string;
    role: string;
    created: string;
    latency: number | null;
    tokens: number | null;
  }[];
}

interface ObserveOverviewDashboardProps {
  onConversationSelect?: (conversationId: string) => void;
}

export function ObserveOverviewDashboard({ onConversationSelect }: ObserveOverviewDashboardProps) {
  // State to hold data from Supabase
  const [isLoading, setIsLoading] = useState(true);
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
  const [appUsage, setAppUsage] = useState<AppUsageMetric[]>([]);
  const [recentConversations, setRecentConversations] = useState<RecentConversation[]>([]);
  const [hasError, setHasError] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [seedingStatus, setSeedingStatus] = useState<string>("");
  
  // State for the conversation details modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<ConversationDetails | null>(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  
  // Function to fetch conversation details
  const fetchConversationDetails = async (conversationId: string) => {
    setIsLoadingConversation(true);
    try {
      // Fetch the conversation details
      const { data: conversationData, error: conversationError } = await supabase
        .from('conversations')
        .select('conversation_id, app_name, created_at')
        .eq('conversation_id', conversationId)
        .single();
      
      if (conversationError) throw conversationError;
      
      // Fetch the messages for this conversation
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('message_id, content, role, created_at, latency_ms, tokens_consumed')
        .eq('conversation_id', conversationId)
        .order('sequence_number', { ascending: true });
      
      if (messagesError) throw messagesError;
      
      // Format the data
      const details: ConversationDetails = {
        conversationId: conversationData.conversation_id,
        app: conversationData.app_name || 'Unknown',
        created: new Date(conversationData.created_at || '').toLocaleString(),
        messages: messagesData.map(msg => ({
          id: msg.message_id,
          content: msg.content,
          role: msg.role,
          created: new Date(msg.created_at || '').toLocaleString(),
          latency: msg.latency_ms !== null ? Number(msg.latency_ms) : null,
          tokens: msg.tokens_consumed !== null ? getTotalTokens(msg.tokens_consumed) : null
        }))
      };
      
      setSelectedConversation(details);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching conversation details:', error);
      alert('Failed to load conversation details. Please try again.');
    } finally {
      setIsLoadingConversation(false);
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
        setAppUsage(results[2].value);
      } else {
        console.error("Error fetching app usage:", results[2].reason);
        setAppUsage([
          { name: 'weather_app', value: 2 },
          { name: 'travel_planner', value: 2 },
          { name: 'recipe_finder', value: 2 },
          { name: 'workout_planner', value: 2 },
          { name: 'shopping_assistant', value: 2 }
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
  
  const handleRefresh = () => {
    fetchData();
  };

  // Debug function to directly query Supabase and show data in the UI
  const runDebugQueries = async () => {
    setDebugInfo("Running debug queries...");
    try {
      // Get current date and date 7 days ago - using actual system time
      const now = new Date();
      const last7DaysStart = new Date();
      last7DaysStart.setDate(now.getDate() - 7);
      
      // Previous 7 days period (7-14 days ago)
      const prev7DaysEnd = new Date(last7DaysStart);
      prev7DaysEnd.setDate(prev7DaysEnd.getDate() - 1); // One day before last7DaysStart
      
      const prev7DaysStart = new Date(last7DaysStart);
      prev7DaysStart.setDate(prev7DaysStart.getDate() - 7); // 7 days before last7DaysStart
      
      // Define the date periods for queries
      const currentStartStr = last7DaysStart.toISOString();
      const currentEndStr = now.toISOString();
      const prevStartStr = prev7DaysStart.toISOString();
      const prevEndStr = prev7DaysEnd.toISOString();
      
      console.log("DEBUG DETAILED TIME PERIODS:", { 
        currentPeriod: {
          start: currentStartStr,
          end: currentEndStr,
          startDate: last7DaysStart.toLocaleDateString(),
          endDate: now.toLocaleDateString()
        },
        previousPeriod: {
          start: prevStartStr,
          end: prevEndStr,
          startDate: prev7DaysStart.toLocaleDateString(),
          endDate: prev7DaysEnd.toLocaleDateString()
        }
      });
      
      // === CONVERSATIONS COUNT ===
      // Current period (last 7 days)
      const { data: currentConvData, error: currentConvError } = await supabase
        .from('conversations')
        .select('conversation_id')
        .gte('created_at', currentStartStr)
        .lte('created_at', currentEndStr);
      
      // Previous period (7-14 days ago)
      const { data: prevConvData, error: prevConvError } = await supabase
        .from('conversations')
        .select('conversation_id')
        .gte('created_at', prevStartStr)
        .lte('created_at', prevEndStr);
      
      // All time
      const { data: allConvData, error: allConvError } = await supabase
        .from('conversations')
        .select('conversation_id');
      
      // === MESSAGES COUNT ===
      // Current period (last 7 days)
      const { data: currentMsgData, error: currentMsgError } = await supabase
        .from('messages')
        .select('message_id')
        .gte('created_at', currentStartStr)
        .lte('created_at', currentEndStr);
      
      // Previous period (7-14 days ago)
      const { data: prevMsgData, error: prevMsgError } = await supabase
        .from('messages')
        .select('message_id')
        .gte('created_at', prevStartStr)
        .lte('created_at', prevEndStr);
      
      // All time
      const { data: allMsgData, error: allMsgError } = await supabase
        .from('messages')
        .select('message_id');
        
      // === LATENCY DATA ===
      // Current period (last 7 days)
      const { data: currentLatencyData, error: currentLatencyError } = await supabase
        .from('messages')
        .select('latency_ms')
        .not('latency_ms', 'is', null)
        .gte('created_at', currentStartStr)
        .lte('created_at', currentEndStr);
      
      // Previous period (7-14 days ago)
      const { data: prevLatencyData, error: prevLatencyError } = await supabase
        .from('messages')
        .select('latency_ms')
        .not('latency_ms', 'is', null)
        .gte('created_at', prevStartStr)
        .lte('created_at', prevEndStr);
        
      // === TOKEN USAGE DATA ===
      // Current period (last 7 days)
      const { data: currentTokenData, error: currentTokenError } = await supabase
        .from('messages')
        .select('tokens_consumed')
        .not('tokens_consumed', 'is', null)
        .gte('created_at', currentStartStr)
        .lte('created_at', currentEndStr);
      
      // Previous period (7-14 days ago)
      const { data: prevTokenData, error: prevTokenError } = await supabase
        .from('messages')
        .select('tokens_consumed')
        .not('tokens_consumed', 'is', null)
        .gte('created_at', prevStartStr)
        .lte('created_at', prevEndStr);
      
      // === CONVERSATION TRENDS DATA (LINE CHART) ===
      // Query for last 7 days conversations by day
      const { data: trendData, error: trendError } = await supabase
        .from('conversations')
        .select('created_at')
        .gte('created_at', currentStartStr)
        .lte('created_at', currentEndStr);
      
      // Group conversations by day
      const dailyCounts: { [key: string]: number } = {};
      const dateLabels: string[] = [];
      
      // Initialize all days with 0
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        dailyCounts[dateStr] = 0;
        dateLabels.unshift(dateStr);
      }
      
      // Count conversations per day
      trendData?.forEach(conv => {
        const dateStr = new Date(conv.created_at || '').toISOString().split('T')[0];
        if (dailyCounts[dateStr] !== undefined) {
          dailyCounts[dateStr]++;
        }
      });
      
      // Format for chart
      const formattedTrendData = dateLabels.map(date => {
        const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
        return {
          date: dayOfWeek,
          value: dailyCounts[date]
        };
      });
      
      // === APP USAGE DISTRIBUTION DATA (PIE CHART) ===
      // Query for app usage distribution
      const { data: appUsageRawData, error: appUsageError } = await supabase
        .from('conversations')
        .select('app_name')
        .gte('created_at', currentStartStr)
        .lte('created_at', currentEndStr);
      
      // Count conversations by app name
      const appCounts: { [key: string]: number } = {};
      let totalApps = 0;
      
      appUsageRawData?.forEach(conv => {
        const appName = conv.app_name || 'Unknown';
        appCounts[appName] = (appCounts[appName] || 0) + 1;
        totalApps++;
      });
      
      // Format for chart
      const appUsageData = Object.entries(appCounts).map(([name, value]) => ({
        name,
        value,
        percentage: totalApps > 0 ? Math.round((value / totalApps) * 100) : 0
      }));
      
      // === CALCULATION HELPERS ===
      const calculatePercentageChange = (current: number, previous: number) => {
        if (previous === 0) return 0;
        return ((current - previous) / previous) * 100;
      };
      
      // === CALCULATE METRICS ===
      // Conversations
      const currentConvCount = currentConvData?.length || 0;
      const prevConvCount = prevConvData?.length || 0;
      const convChange = calculatePercentageChange(currentConvCount, prevConvCount);
      
      // Messages
      const currentMsgCount = currentMsgData?.length || 0;
      const prevMsgCount = prevMsgData?.length || 0;
      const msgChange = calculatePercentageChange(currentMsgCount, prevMsgCount);
      
      // Latency 
      const currentLatencyValues = currentLatencyData?.map(item => Number(item.latency_ms || 0)) || [];
      const prevLatencyValues = prevLatencyData?.map(item => Number(item.latency_ms || 0)) || [];
      
      const avgCurrentLatency = currentLatencyValues.length > 0 
        ? currentLatencyValues.reduce((sum, val) => sum + val, 0) / currentLatencyValues.length 
        : 0;
        
      const avgPrevLatency = prevLatencyValues.length > 0 
        ? prevLatencyValues.reduce((sum, val) => sum + val, 0) / prevLatencyValues.length 
        : 0;
      
      // For latency, a decrease is an improvement (faster response time) 
      const latencyChangeRaw = calculatePercentageChange(avgCurrentLatency, avgPrevLatency);
      const latencyChange = avgCurrentLatency < avgPrevLatency 
        ? Math.abs(latencyChangeRaw) // Faster (improvement)
        : -Math.abs(latencyChangeRaw); // Slower (degradation)
      
      // Token Usage
      const totalCurrentTokens = currentTokenData ? 
        currentTokenData.reduce((sum, item) => sum + getTotalTokens(item.tokens_consumed), 0) : 0;
        
      const totalPrevTokens = prevTokenData ? 
        prevTokenData.reduce((sum, item) => sum + getTotalTokens(item.tokens_consumed), 0) : 0;
        
      const tokenChange = calculatePercentageChange(totalCurrentTokens, totalPrevTokens);
      
      // === RECENT CONVERSATIONS DATA ===
      // Get most recent conversations
      const { data: recentConvsData, error: recentConvsError } = await supabase
        .from('conversations')
        .select('conversation_id, app_name, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      
      // For each conversation, get the total tokens consumed
      const recentConvsWithTokens = [];
      
      for (const conv of recentConvsData || []) {
        const { data: msgTokenData, error: msgTokenError } = await supabase
          .from('messages')
          .select('tokens_consumed')
          .eq('conversation_id', conv.conversation_id)
          .not('tokens_consumed', 'is', null);
        
        const totalTokens = msgTokenData ? 
          msgTokenData.reduce((sum, msg) => sum + getTotalTokens(msg.tokens_consumed), 0) : 
          0;
          
        const timeAgo = (() => {
          const now = new Date();
          const date = new Date(conv.created_at || '');
          const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
          
          if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
          if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
          if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
          return `${Math.floor(diffInSeconds / 86400)} days ago`;
        })();
        
        recentConvsWithTokens.push({
          id: conv.conversation_id,
          app: conv.app_name || 'Unknown',
          time: timeAgo,
          status: 'Completed',
          tokens: totalTokens,
          created_at: conv.created_at
        });
      }
      
      // Format results for display
      const debugText = `
=== DETAILED DEBUG RESULTS ===

TIME PERIODS:
- Current period: ${last7DaysStart.toLocaleDateString()} to ${now.toLocaleDateString()}
- Previous period: ${prev7DaysStart.toLocaleDateString()} to ${prev7DaysEnd.toLocaleDateString()}

CONVERSATIONS:
- Current period (last 7 days): ${currentConvCount} conversations
- Previous period (7-14 days ago): ${prevConvCount} conversations
- Percentage change: ${convChange.toFixed(2)}%
- Raw calculation: ((${currentConvCount} - ${prevConvCount}) / ${prevConvCount}) * 100 = ${convChange.toFixed(2)}%
- All time: ${allConvData?.length || 0} conversations
${currentConvError ? `- Error: ${currentConvError.message}` : ''}
${prevConvError ? `- Error: ${prevConvError.message}` : ''}
${allConvError ? `- Error: ${allConvError.message}` : ''}
- SQL equivalent (current): 
  SELECT COUNT(*) FROM conversations 
  WHERE created_at >= '${currentStartStr}' AND created_at <= '${currentEndStr}'
- SQL equivalent (previous): 
  SELECT COUNT(*) FROM conversations 
  WHERE created_at >= '${prevStartStr}' AND created_at <= '${prevEndStr}'

MESSAGES:
- Current period (last 7 days): ${currentMsgCount} messages
- Previous period (7-14 days ago): ${prevMsgCount} messages
- Percentage change: ${msgChange.toFixed(2)}%
- Raw calculation: ((${currentMsgCount} - ${prevMsgCount}) / ${prevMsgCount}) * 100 = ${msgChange.toFixed(2)}%
- All time: ${allMsgData?.length || 0} messages
${currentMsgError ? `- Error: ${currentMsgError.message}` : ''}
${prevMsgError ? `- Error: ${prevMsgError.message}` : ''}
${allMsgError ? `- Error: ${allMsgError.message}` : ''}
- SQL equivalent (current): 
  SELECT COUNT(*) FROM messages 
  WHERE created_at >= '${currentStartStr}' AND created_at <= '${currentEndStr}'
- SQL equivalent (previous): 
  SELECT COUNT(*) FROM messages 
  WHERE created_at >= '${prevStartStr}' AND created_at <= '${prevEndStr}'

AVG. RESPONSE TIME:
- Current period avg: ${avgCurrentLatency.toFixed(2)}ms (from ${currentLatencyValues.length} data points)
- Previous period avg: ${avgPrevLatency.toFixed(2)}ms (from ${prevLatencyValues.length} data points)
- Raw percentage change: ${latencyChangeRaw.toFixed(2)}%
- Adjusted percentage change: ${latencyChange.toFixed(2)}% (${latencyChange >= 0 ? 'faster' : 'slower'})
- Raw calculation: ${avgCurrentLatency.toFixed(2)} ${avgCurrentLatency < avgPrevLatency ? '<' : '>'} ${avgPrevLatency.toFixed(2)} (${Math.abs(latencyChangeRaw).toFixed(2)}% ${avgCurrentLatency < avgPrevLatency ? 'decrease' : 'increase'})
${currentLatencyError ? `- Error: ${currentLatencyError.message}` : ''}
${prevLatencyError ? `- Error: ${prevLatencyError.message}` : ''}
- SQL equivalent (current): 
  SELECT AVG(latency_ms) FROM messages 
  WHERE created_at >= '${currentStartStr}' AND created_at <= '${currentEndStr}'
  AND latency_ms IS NOT NULL
- SQL equivalent (previous): 
  SELECT AVG(latency_ms) FROM messages 
  WHERE created_at >= '${prevStartStr}' AND created_at <= '${prevEndStr}'
  AND latency_ms IS NOT NULL

TOKEN USAGE:
- Current period total: ${totalCurrentTokens.toFixed(2)} tokens (from ${currentTokenData?.length || 0} data points)
- Previous period total: ${totalPrevTokens.toFixed(2)} tokens (from ${prevTokenData?.length || 0} data points)
- Percentage change: ${tokenChange.toFixed(2)}%
- Raw calculation: ((${totalCurrentTokens.toFixed(2)} - ${totalPrevTokens.toFixed(2)}) / ${totalPrevTokens.toFixed(2)}) * 100 = ${tokenChange.toFixed(2)}%
${currentTokenError ? `- Error: ${currentTokenError.message}` : ''}
${prevTokenError ? `- Error: ${prevTokenError.message}` : ''}
- SQL equivalent (current): 
  SELECT SUM(tokens_consumed) FROM messages 
  WHERE created_at >= '${currentStartStr}' AND created_at <= '${currentEndStr}'
  AND tokens_consumed IS NOT NULL
- SQL equivalent (previous): 
  SELECT SUM(tokens_consumed) FROM messages 
  WHERE created_at >= '${prevStartStr}' AND created_at <= '${prevEndStr}'
  AND tokens_consumed IS NOT NULL

CONVERSATION TRENDS (LINE CHART):
- Data points: ${trendData?.length || 0} conversations over 7 days
${trendError ? `- Error: ${trendError.message}` : ''}
- SQL query:
  SELECT created_at FROM conversations
  WHERE created_at >= '${currentStartStr}' AND created_at <= '${currentEndStr}'
- Processing steps:
  1. Group conversations by day of week
  2. Count occurrences for each day
  3. Format as [{ date: 'Mon', value: 15 }, ...]
- Processed data:
  ${JSON.stringify(formattedTrendData)}

APP USAGE DISTRIBUTION (PIE CHART):
- Data points: ${appUsageRawData?.length || 0} conversations (from the last 7 days only)
${appUsageError ? `- Error: ${appUsageError.message}` : ''}
- SQL query:
  SELECT app_name FROM conversations
  WHERE created_at >= '${currentStartStr}' AND created_at <= '${currentEndStr}'
- Processing steps:
  1. Group conversations by app_name (for last 7 days only)
  2. Count occurrences for each app
  3. Calculate percentage of total
  4. Format as [{ name: 'weather_app', value: 20, percentage: 25 }, ...]
- Processed data:
  ${JSON.stringify(appUsageData)}

RECENT CONVERSATIONS:
- Data points: ${recentConvsData?.length || 0} recent conversations
${recentConvsError ? `- Error: ${recentConvsError.message}` : ''}
- SQL queries:
  1. Main query:
     SELECT conversation_id, app_name, created_at 
     FROM conversations
     ORDER BY created_at DESC
     LIMIT 5
  2. For each conversation:
     SELECT tokens_consumed 
     FROM messages
     WHERE conversation_id = '[conversation_id]'
     AND tokens_consumed IS NOT NULL
- Processing steps:
  1. Get 5 most recent conversations
  2. For each conversation, calculate total tokens consumed
  3. Format time ago for display
- Processed data:
  ${JSON.stringify(recentConvsWithTokens, null, 2)}

TABLE DATA:
- First conversation: ${allConvData && allConvData.length > 0 ? 
  JSON.stringify(allConvData[0], null, 2) : 'No data'}
- First message: ${allMsgData && allMsgData.length > 0 ? 
  JSON.stringify(allMsgData[0], null, 2) : 'No data'}
`;
      
      setDebugInfo(debugText);
      console.log(debugText);
    } catch (error) {
      console.error("Debug query error:", error);
      setDebugInfo(`Error running debug queries: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Function to seed the database with demo data
  const seedDemoData = async () => {
    setSeedingStatus("Seeding database with demo data...");
    
    try {
      const now = new Date();
      const appNames = ["travel_planner", "weather_app", "recipe_finder", "shopping_assistant", "workout_planner"];
      const conversations = [];
      const messages = [];
      
      // Helper function to generate a proper UUID
      const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };
      
      // Generate 30 conversations for the current 14-day period
      for (let i = 0; i < 30; i++) {
        // Random date within last 14 days
        const daysAgo = Math.floor(Math.random() * 14);
        const createdAt = new Date();
        createdAt.setDate(now.getDate() - daysAgo);
        
        const conversation_id = generateUUID();
        const app_name = appNames[Math.floor(Math.random() * appNames.length)];
        
        conversations.push({
          conversation_id,
          app_name,
          created_at: createdAt.toISOString(),
          user_id: "demo-user",
          summary: `Demo conversation ${i+1}`
        });
        
        // Generate 3-5 messages per conversation
        const messageCount = Math.floor(Math.random() * 3) + 3;
        for (let j = 0; j < messageCount; j++) {
          const isUser = j % 2 === 0;
          const message_id = generateUUID();
          
          // For AI responses, add metrics
          const latency = isUser ? null : 800 + Math.floor(Math.random() * 1200);
          const tokens = isUser ? null : 200 + Math.floor(Math.random() * 800);
          
          messages.push({
            message_id,
            conversation_id,
            content: isUser ? `User message ${j/2+1}` : `AI response to message ${Math.floor(j/2)+1}`,
            role: isUser ? "user" : "system",
            created_at: createdAt.toISOString(),
            sequence_number: j + 1,
            latency_ms: latency,
            tokens_consumed: tokens,
            llm_model: isUser ? null : "gpt-4o",
            llm_provider: isUser ? null : "OpenAI"
          });
        }
      }
      
      // Insert conversations
      const { error: convError } = await supabase
        .from('conversations')
        .insert(conversations);
      
      if (convError) {
        throw new Error(`Error inserting conversations: ${convError.message}`);
      }
      
      // Insert messages
      const { error: msgError } = await supabase
        .from('messages')
        .insert(messages);
      
      if (msgError) {
        throw new Error(`Error inserting messages: ${msgError.message}`);
      }
      
      setSeedingStatus(`Successfully seeded database with ${conversations.length} conversations and ${messages.length} messages!`);
      
      // Refresh data
      fetchData();
      
    } catch (error) {
      console.error("Error seeding demo data:", error);
      setSeedingStatus(`Error seeding demo data: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleConversationClick = (id: string) => {
    // Option 1: If parent has provided a handler, use that instead of our local modal
    if (onConversationSelect) {
      onConversationSelect(id);
    } 
    // Option 2: Otherwise use our own modal implementation
    else {
      fetchConversationDetails(id);
    }
  };

  // Format the tokens consumed for display
  const formatTokens = (tokens: number): string => {
    if (tokens >=
