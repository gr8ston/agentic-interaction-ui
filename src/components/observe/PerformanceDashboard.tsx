
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralMetricsTab } from "./performance/GeneralMetricsTab";
import { PerformanceHeatmapTab } from "./performance/PerformanceHeatmapTab";
import { SummarizationEffectivenessTab } from "./performance/SummarizationEffectivenessTab";

interface PerformanceDashboardProps {
  onConversationSelect?: (conversationId: string) => void;
}

export function PerformanceDashboard({ onConversationSelect }: PerformanceDashboardProps) {
  const handleConversationSelect = (conversationId: string) => {
    if (onConversationSelect) {
      onConversationSelect(conversationId);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General Metrics</TabsTrigger>
          <TabsTrigger value="heatmap">Performance Heatmap</TabsTrigger>
          <TabsTrigger value="summarization">Summarization Effectiveness</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <GeneralMetricsTab onConversationSelect={handleConversationSelect} />
        </TabsContent>
        
        <TabsContent value="heatmap">
          <PerformanceHeatmapTab />
        </TabsContent>
        
        <TabsContent value="summarization">
          <SummarizationEffectivenessTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
