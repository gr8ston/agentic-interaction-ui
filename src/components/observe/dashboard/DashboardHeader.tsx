
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface DashboardHeaderProps {
  onRefresh: () => void;
  lastRefreshTime: Date;
}

export function DashboardHeader({ onRefresh, lastRefreshTime }: DashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">Conversation Analytics</h2>
        <p className="text-muted-foreground">Track and analyze AI conversations across your platform</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onRefresh} className="flex items-center gap-1">
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </Button>
        <span className="text-xs text-muted-foreground">
          Last updated: {lastRefreshTime.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
