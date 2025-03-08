
import { ObserveDashboardLayout } from "@/components/layout/ObserveDashboardLayout";
import { ObserveOverviewDashboard } from "@/components/observe/ObserveOverviewDashboard";
import { useState } from "react";
import { PerformanceDashboard } from "@/components/observe/PerformanceDashboard";
import { ConversationDashboard } from "@/components/observe/ConversationDashboard";
import { AlertsDashboard } from "@/components/observe/AlertsDashboard";

type DashboardTab = "overview" | "performance" | "conversations" | "alerts";

export default function ObserveDashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");

  return (
    <ObserveDashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "overview" && <ObserveOverviewDashboard />}
      {activeTab === "performance" && <PerformanceDashboard />}
      {activeTab === "conversations" && <ConversationDashboard />}
      {activeTab === "alerts" && <AlertsDashboard />}
    </ObserveDashboardLayout>
  );
}
