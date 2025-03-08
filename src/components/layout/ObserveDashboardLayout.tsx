
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Menu, BarChart3, Activity, MessageSquare, Bell } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type DashboardTab = "overview" | "performance" | "conversations" | "alerts";

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const { logout, user } = useAuth();
  
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);

  const navItems: { id: DashboardTab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <BarChart3 className="h-5 w-5" /> },
    { id: "performance", label: "Performance", icon: <Activity className="h-5 w-5" /> },
    { id: "conversations", label: "Conversations", icon: <MessageSquare className="h-5 w-5" /> },
    { id: "alerts", label: "Alerts", icon: <Bell className="h-5 w-5" /> }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div 
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
          sidebarCollapsed ? "w-[70px]" : "w-64"
        )}
      >
        {/* Logo area */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!sidebarCollapsed && <h1 className="text-xl font-bold text-brand-primary">mAI Observe</h1>}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="ml-auto"
          >
            <Menu size={18} />
          </Button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-2">
          <TooltipProvider delayDuration={0}>
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={activeTab === item.id ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-2 mb-1",
                          activeTab === item.id ? "bg-brand-primary text-white" : "text-gray-700",
                          sidebarCollapsed && "justify-center"
                        )}
                        onClick={() => onTabChange(item.id)}
                      >
                        {item.icon}
                        {!sidebarCollapsed && <span>{item.label}</span>}
                      </Button>
                    </TooltipTrigger>
                    {sidebarCollapsed && (
                      <TooltipContent side="right">
                        {item.label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </li>
              ))}
            </ul>
          </TooltipProvider>
        </nav>
        
        {/* User area */}
        <div className="p-4 border-t border-gray-200">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="w-full flex items-center gap-2" onClick={logout}>
                  <LogOut size={14} />
                  {!sidebarCollapsed && <span>Logout</span>}
                </Button>
              </TooltipTrigger>
              {sidebarCollapsed && (
                <TooltipContent side="right">
                  Logout
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          
          {!sidebarCollapsed && user && (
            <div className="mt-2 text-xs text-gray-600 text-center">
              Logged in as <span className="font-medium">{user.username}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-brand-primary">
            {activeTab === "overview" && "Overview Dashboard"}
            {activeTab === "performance" && "Performance Metrics"}
            {activeTab === "conversations" && "Conversation Analytics"}
            {activeTab === "alerts" && "Alerts & Notifications"}
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
