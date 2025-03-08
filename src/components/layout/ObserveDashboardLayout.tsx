
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, BarChart3, Activity, MessageSquare, Bell, ThumbsUp, Users } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";

type DashboardTab = "overview" | "performance" | "conversations" | "alerts" | "feedback" | "engagement";

interface ObserveDashboardLayoutProps {
  children: React.ReactNode;
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

export function ObserveDashboardLayout({
  children,
  activeTab,
  onTabChange
}: ObserveDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const { logout, user } = useAuth();
  
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const navItems = [
    { id: "overview", label: "Overview", icon: <BarChart3 className="h-5 w-5 text-brand-primary" /> },
    { id: "performance", label: "Performance", icon: <Activity className="h-5 w-5 text-brand-primary" /> },
    { id: "conversations", label: "Conversations", icon: <MessageSquare className="h-5 w-5 text-brand-primary" /> },
    { id: "engagement", label: "User Engagement", icon: <Users className="h-5 w-5 text-brand-primary" /> },
    { id: "alerts", label: "Alerts", icon: <Bell className="h-5 w-5 text-brand-primary" /> },
    { id: "feedback", label: "Feedback", icon: <ThumbsUp className="h-5 w-5 text-brand-primary" /> }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
        <SidebarBody className="justify-between h-full">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div className="flex items-center justify-between py-2">
              {sidebarOpen && <h2 className="font-semibold text-lg text-brand-primary">mAI Observe</h2>}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="ml-auto"
              >
                <Menu size={18} />
              </Button>
            </div>
            
            <div className="mt-6 flex flex-col gap-2">
              {navItems.map((item) => (
                <SidebarLink 
                  key={item.id} 
                  link={{
                    label: item.label,
                    href: "#",
                    icon: item.icon
                  }}
                  active={activeTab === item.id}
                  onClick={() => onTabChange(item.id as DashboardTab)}
                />
              ))}
            </div>
          </div>
          
          <div className="mt-auto pt-4 border-t border-gray-200">
            <Button variant="outline" size="sm" className="w-full flex items-center gap-2" onClick={logout}>
              <LogOut size={14} />
              {sidebarOpen && <span>Logout</span>}
            </Button>
            
            {sidebarOpen && user && (
              <div className="mt-2 text-xs text-gray-600 text-center">
                Logged in as <span className="font-medium">{user.username}</span>
              </div>
            )}
          </div>
        </SidebarBody>
      </Sidebar>
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-brand-primary">
            {activeTab === "overview" && "Overview Dashboard"}
            {activeTab === "performance" && "Performance Metrics"}
            {activeTab === "conversations" && "Conversation Analytics"}
            {activeTab === "alerts" && "Alerts & Notifications"}
            {activeTab === "feedback" && "User Feedback Analysis"}
            {activeTab === "engagement" && "User Engagement"}
          </h1>
          
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 bg-brand-light text-xs font-medium rounded text-brand-primary">
              DEMO
            </div>
          </div>
        </header>
        
        {/* Dashboard content */}
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
