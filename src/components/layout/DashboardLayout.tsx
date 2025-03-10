import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Menu, HelpCircle, FileText, Code, FileMinus, Search, MapPin, Flag, Calendar, Cloud, Map, Home, BarChart } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { Tool } from "@/types/api";
import { useToast } from "@/hooks/use-toast";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({
  children
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const { logout, user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch('http://0.0.0.0:8000/tools', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch tools');
        }
        
        const data = await response.json();
        
        // Map the array of tool names to the expected Tool interface format
        const mappedTools = data.tools.map((toolName: string, index: number) => ({
          id: `tool-${index}`,
          name: toolName.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          description: `Execute the ${toolName} function`,
          icon: getToolIcon(toolName),
        }));
        
        setTools(mappedTools);
      } catch (error) {
        console.error('Error fetching tools:', error);
        toast({
          title: "Error",
          description: "Failed to load tools. Please try again.",
          variant: "destructive",
        });
        // Fallback to default tools if API fails
        setTools(getDefaultTools());
      } finally {
        setIsLoading(false);
      }
    };

    fetchTools();
  }, [toast]);

  // Helper function to get default tools as fallback
  const getDefaultTools = (): Tool[] => [
    {
      id: 'doc',
      name: "Documentation",
      description: "Read documentation",
      icon: "file-text"
    },
    {
      id: 'code',
      name: "Code Samples",
      description: "View code samples",
      icon: "code"
    },
    {
      id: 'file',
      name: "File Browser",
      description: "Browse files",
      icon: "file-minus"
    },
    {
      id: 'search',
      name: "Search",
      description: "Search content",
      icon: "search"
    },
    {
      id: 'location',
      name: "Location",
      description: "Find locations",
      icon: "map-pin"
    },
    {
      id: 'reports',
      name: "Reports",
      description: "View reports",
      icon: "flag"
    },
    {
      id: 'help',
      name: "Help",
      description: "Get help",
      icon: "help-circle"
    }
  ];

  // Helper function to get icon component based on tool name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'file-text': return <FileText className="h-5 w-5 text-brand-primary" />;
      case 'code': return <Code className="h-5 w-5 text-brand-primary" />;
      case 'file-minus': return <FileMinus className="h-5 w-5 text-brand-primary" />;
      case 'search': return <Search className="h-5 w-5 text-brand-primary" />;
      case 'map-pin': return <MapPin className="h-5 w-5 text-brand-primary" />;
      case 'flag': return <Flag className="h-5 w-5 text-brand-primary" />;
      case 'help-circle': return <HelpCircle className="h-5 w-5 text-brand-primary" />;
      case 'calendar': return <Calendar className="h-5 w-5 text-brand-primary" />;
      case 'cloud': return <Cloud className="h-5 w-5 text-brand-primary" />;
      case 'map': return <Map className="h-5 w-5 text-brand-primary" />;
      case 'home': return <Home className="h-5 w-5 text-brand-primary" />;
      case 'chart': return <BarChart className="h-5 w-5 text-brand-primary" />;
      default: return <HelpCircle className="h-5 w-5 text-brand-primary" />;
    }
  };

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
              {isLoading ? (
                // Loading skeleton
                Array(5).fill(0).map((_, index) => (
                  <div key={`skeleton-${index}`} className="h-10 animate-pulse rounded bg-gray-200"></div>
                ))
              ) : (
                tools.map((tool) => (
                  <SidebarLink 
                    key={tool.id} 
                    link={{
                      label: tool.name,
                      href: "#",
                      icon: getIconComponent(tool.icon || 'help-circle')
                    }}
                  />
                ))
              )}
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

// Helper function to assign icons based on tool name
const getToolIcon = (toolName: string): string => {
  const iconMappings: Record<string, string> = {
    'write_email': 'file-text',
    'create_travel_guide': 'file-text',
    'compare_destinations': 'file-text',
    'get_current_date': 'calendar',
    'get_forecast': 'cloud',
    'get_distance': 'map',
    'find_hotels': 'home',
    'get_attractions': 'map-pin',
    'get_property_id_by_name': 'search',
    'predict_demand_for_resort': 'chart',
    'check_availability': 'calendar',
  };
  
  return iconMappings[toolName] || 'help-circle';
};
