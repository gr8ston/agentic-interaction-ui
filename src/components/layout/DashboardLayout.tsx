
import { useState } from "react";
import { ToolsSidebar } from "@/components/sidebar/ToolsSidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({
  children
}: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const {
    logout,
    user
  } = useAuth();
  
  // Auto-collapse sidebar on mobile
  useState(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  });

  return <div className="flex h-screen bg-gray-50">
      <ToolsSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="p-3 md:p-4 border-b bg-white flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4">
            {isMobile && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="md:hidden"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                <Menu size={18} />
              </Button>
            )}
            <h1 className="text-lg md:text-xl font-bold text-brand-primary truncate">mAI Agentic Framework</h1>
            <span className="px-2 py-1 bg-brand-light text-xs font-medium rounded text-brand-primary hidden md:inline-block">
              Demo
            </span>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            {user && <span className="text-xs md:text-sm text-gray-600 hidden sm:inline-block">
                Logged in as <span className="font-medium">{user.username}</span>
              </span>}
            <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={logout}>
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-hidden p-2 md:p-4">
          {children}
        </main>
      </div>
    </div>;
}
