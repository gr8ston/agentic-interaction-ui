"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralMetricsTab } from "@/components/observe/performance/GeneralMetricsTab";
import { PerformanceHeatmapTab } from "@/components/observe/performance/PerformanceHeatmapTab";
import { SummarizationEffectivenessTab } from "@/components/observe/performance/SummarizationEffectivenessTab";
import { ConversationDetailsModal } from "@/components/observe/ConversationDetailsModal";

export default function ObservePage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openConversationDetails = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setIsModalOpen(true);
  };

  const closeConversationDetails = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Observe</h2>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="heatmap">Performance Patterns</TabsTrigger>
          <TabsTrigger value="summarization">Summarization</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <GeneralMetricsTab onConversationSelect={openConversationDetails} />
        </TabsContent>
        <TabsContent value="heatmap" className="space-y-4">
          <PerformanceHeatmapTab onConversationSelect={openConversationDetails} />
        </TabsContent>
        <TabsContent value="summarization" className="space-y-4">
          <SummarizationEffectivenessTab />
        </TabsContent>
      </Tabs>

      <ConversationDetailsModal 
        conversationId={selectedConversationId}
        isOpen={isModalOpen}
        onClose={closeConversationDetails}
      />
    </div>
  );
} 