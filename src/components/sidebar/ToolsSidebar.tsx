
import { useEffect, useState } from "react";
import { Tool } from "@/types/api";
import { toolsService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  HelpCircle,
  Code,
  FileMinus,
  Search,
  LucideIcon,
  Menu,
  X,
  MapPin,
  Flag
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolsSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const getIconByName = (iconName: string): LucideIcon => {
  switch (iconName) {
    case 'help-circle':
      return HelpCircle;
    case 'file-text':
      return FileText;
    case 'code':
      return Code;
    case 'file-minus':
      return FileMinus;
    case 'search':
      return Search;
    case 'map-pin':
      return MapPin;
    case 'flag':
      return Flag;
    default:
      return HelpCircle;
  }
};

export function ToolsSidebar({ collapsed, setCollapsed }: ToolsSidebarProps) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const data = await toolsService.getTools();
        setTools(data);
      } catch (error) {
        console.error("Error fetching tools:", error);
        toast({
          title: "Error",
          description: "Failed to load tools. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTools();
  }, [toast]);

  return (
    <div className={cn(
      "transition-all duration-300 ease-in-out border-r bg-white h-full flex flex-col z-20",
      collapsed ? "w-[60px]" : "w-[240px] md:w-[280px]",
      collapsed ? "" : "absolute md:relative",  // Make sidebar overlay on mobile when expanded
      collapsed ? "relative" : ""
    )}>
      <div className="p-3 md:p-4 flex items-center justify-between">
        {!collapsed && <h2 className="font-semibold text-base md:text-lg text-brand-primary">Tools</h2>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </Button>
      </div>
      
      <Separator />
      
      <div className="p-2 md:p-3 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded" />
                {!collapsed && (
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-3 w-3/5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {tools.map((tool) => {
              const Icon = getIconByName(tool.icon || 'help-circle');
              
              return (
                <div 
                  key={tool.id}
                  className={cn(
                    "flex items-center space-x-3 p-2 rounded-md cursor-pointer hover:bg-brand-light group transition-colors",
                    collapsed ? "justify-center" : ""
                  )}
                >
                  <div className="flex items-center justify-center bg-brand-light text-brand-primary rounded-md h-9 w-9 md:h-10 md:w-10 transition-colors group-hover:bg-brand-primary group-hover:text-white">
                    <Icon size={18} />
                  </div>
                  
                  {!collapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{tool.name}</p>
                      <p className="text-xs text-gray-500 truncate">{tool.description}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
