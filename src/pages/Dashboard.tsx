
import { ConversationContainer } from "@/components/chat/ConversationContainer";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="h-full">
        <ConversationContainer />
      </div>
    </DashboardLayout>
  );
}
