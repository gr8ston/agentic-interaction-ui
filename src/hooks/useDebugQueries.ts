
import { useState } from 'react';
import { supabase, getTotalTokens } from "@/integrations/supabase/client";

export function useDebugQueries() {
  const [debugInfo, setDebugInfo] = useState<string>("");
  
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
  
  return {
    debugInfo,
    setDebugInfo,
    runDebugQueries
  };
}
