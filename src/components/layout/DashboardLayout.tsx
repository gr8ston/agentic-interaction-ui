
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Menu, HelpCircle, FileText, Code, FileMinus, Search, MapPin, Flag } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({
  children
}: DashboardLayoutProps) {
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

  const tools = [
    {
      label: "Documentation",
      href: "#",
      icon: <FileText className="h-5 w-5 text-brand-primary" />
    },
    {
      label: "Code Samples",
      href: "#",
      icon: <Code className="h-5 w-5 text-brand-primary" />
    },
    {
      label: "File Browser",
      href: "#",
      icon: <FileMinus className="h-5 w-5 text-brand-primary" />
    },
    {
      label: "Search",
      href: "#",
      icon: <Search className="h-5 w-5 text-brand-primary" />
    },
    {
      label: "Location",
      href: "#",
      icon: <MapPin className="h-5 w-5 text-brand-primary" />
    },
    {
      label: "Reports",
      href: "#",
      icon: <Flag className="h-5 w-5 text-brand-primary" />
    },
    {
      label: "Help",
      href: "#",
      icon: <HelpCircle className="h-5 w-5 text-brand-primary" />
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
        <SidebarBody className="justify-between h-full">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div className="flex items-center justify-between py-2">
              {sidebarOpen && <h2 className="font-semibold text-lg text-brand-primary">Tools</h2>}
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
              {tools.map((tool, index) => (
                <SidebarLink 
                  key={index} 
                  link={tool}
                />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="p-3 md:p-4 border-b bg-white flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4">
            {isMobile && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="md:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
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
    </div>
  );
}
