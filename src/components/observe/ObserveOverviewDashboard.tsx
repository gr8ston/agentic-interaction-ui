
import React from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useDebugQueries } from '@/hooks/useDebugQueries';
import { useSeedDemoData } from '@/hooks/useSeedDemoData';
import { useConversationDetails } from '@/hooks/useConversationDetails';
import { DashboardHeader } from '@/components/observe/dashboard/DashboardHeader';
import { KeyMetricsCard } from '@/components/observe/dashboard/KeyMetricsCard';
import { ConversationTrendsChart } from '@/components/observe/dashboard/ConversationTrendsChart';
import { AppUsageChart } from '@/components/observe/dashboard/AppUsageChart';
import { RecentConversationsTable } from '@/components/observe/dashboard/RecentConversationsTable';
import { DebugSection } from '@/components/observe/dashboard/DebugSection';
import { ConversationDetailsView } from '@/components/observe/dashboard/ConversationDetailsView';

interface ObserveOverviewDashboardProps {
  onConversationSelect?: (conversationId: string) => void;
}

export function ObserveOverviewDashboard({ onConversationSelect }: ObserveOverviewDashboardProps) {
  // Use custom hooks for data and functionality
  const {
    isLoading,
    hasError,
    lastRefresh,
    metrics,
    conversationTrends,
    appUsage,
    recentConversations,
    fetchData
  } = useDashboardData();
  
  const { debugInfo, setDebugInfo, runDebugQueries } = useDebugQueries();
  const { seedingStatus, setSeedingStatus, seedDemoData } = useSeedDemoData();
  const {
    isModalOpen,
    selectedConversation,
    isLoadingConversation,
    fetchConversationDetails,
    closeConversationDetails
  } = useConversationDetails();

  // Handle conversation selection - either use parent handler or local modal
  const handleConversationClick = (id: string) => {
    if (onConversationSelect) {
      onConversationSelect(id);
    } else {
      fetchConversationDetails(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <DashboardHeader onRefresh={fetchData} lastRefreshTime={lastRefresh} />

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KeyMetricsCard 
          title="Total Conversations" 
          value={metrics.totalConversations} 
          changePercentage={metrics.conversationsChange} 
        />
        
        <KeyMetricsCard 
          title="Total Messages" 
          value={metrics.totalMessages} 
          changePercentage={metrics.messagesChange} 
        />
        
        <KeyMetricsCard 
          title="Avg. Response Time" 
          value={metrics.averageLatency.toFixed(0)} 
          suffix="ms"
          changePercentage={metrics.latencyChange} 
        />
        
        <KeyMetricsCard 
          title="Token Usage (Total)" 
          value={metrics.totalTokensConsumed >= 1000 
            ? (metrics.totalTokensConsumed / 1000).toFixed(1) + 'K' 
            : metrics.totalTokensConsumed} 
          changePercentage={metrics.tokensChange} 
        />
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConversationTrendsChart data={conversationTrends} />
        <AppUsageChart data={appUsage} />
      </div>
      
      {/* Recent Conversations Table */}
      <RecentConversationsTable 
        conversations={recentConversations}
        isLoading={isLoading}
        onViewConversation={handleConversationClick}
      />
      
      {/* Debug Section */}
      <DebugSection 
        debugInfo={debugInfo}
        seedingStatus={seedingStatus}
        onRunDebugQueries={runDebugQueries}
        onSeedDemoData={seedDemoData}
        onClearDebugInfo={() => setDebugInfo("")}
      />
      
      {/* Conversation Details Modal - shown when a conversation is selected and no external handler is provided */}
      <ConversationDetailsView 
        isOpen={isModalOpen}
        onClose={closeConversationDetails}
        conversation={selectedConversation}
      />
    </div>
  );
}
