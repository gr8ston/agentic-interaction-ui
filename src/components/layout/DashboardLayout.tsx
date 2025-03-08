
import { useState } from "react";
import { ToolsSidebar } from "@/components/sidebar/ToolsSidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { logout, user } = useAuth();
  
  return (
    <div className="flex h-screen bg-gray-50">
      <ToolsSidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
      />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="p-4 border-b bg-white flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-brand-primary">Agentic Framework</h1>
            <span className="px-2 py-1 bg-brand-light text-xs font-medium rounded text-brand-primary">
              Demo
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-gray-600">
                Logged in as <span className="font-medium">{user.username}</span>
              </span>
            )}
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
              onClick={logout}
            >
              <LogOut size={14} />
              Logout
            </Button>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-hidden p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
