
import { ObserveDashboardLayout } from "@/components/layout/ObserveDashboardLayout";
import { ObserveOverviewDashboard } from "@/components/observe/ObserveOverviewDashboard";
import { useState } from "react";
import { PerformanceDashboard } from "@/components/observe/PerformanceDashboard";
import { ConversationDashboard } from "@/components/observe/ConversationDashboard";
import { AlertsDashboard } from "@/components/observe/AlertsDashboard";
import { FeedbackDashboard } from "@/components/observe/FeedbackDashboard";
import { ConversationDetailsModal } from "@/components/observe/ConversationDetailsModal";

type DashboardTab = "overview" | "performance" | "conversations" | "alerts" | "feedback";

export default function ObserveDashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <ObserveDashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === "overview" && <ObserveOverviewDashboard onConversationSelect={handleConversationSelect} />}
        {activeTab === "performance" && <PerformanceDashboard onConversationSelect={handleConversationSelect} />}
        {activeTab === "conversations" && <ConversationDashboard onConversationSelect={handleConversationSelect} />}
        {activeTab === "alerts" && <AlertsDashboard onConversationSelect={handleConversationSelect} />}
        {activeTab === "feedback" && <FeedbackDashboard onConversationSelect={handleConversationSelect} />}
      </ObserveDashboardLayout>

      <ConversationDetailsModal 
        conversationId={selectedConversationId} 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
