
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bug, Database, X } from "lucide-react";

interface DebugSectionProps {
  debugInfo: string;
  seedingStatus: string;
  onRunDebugQueries: () => void;
  onSeedDemoData: () => void;
  onClearDebugInfo: () => void;
}

export function DebugSection({
  debugInfo,
  seedingStatus,
  onRunDebugQueries,
  onSeedDemoData,
  onClearDebugInfo
}: DebugSectionProps) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={onRunDebugQueries}>
          <Bug className="mr-2 h-4 w-4" />
          Run Debug Queries
        </Button>
        <Button variant="outline" size="sm" onClick={onSeedDemoData}>
          <Database className="mr-2 h-4 w-4" />
          Seed Demo Data
        </Button>
      </div>
      
      {seedingStatus && (
        <div className="bg-gray-50 p-4 rounded border">
          <h3 className="font-medium mb-2">Seeding Status</h3>
          <p>{seedingStatus}</p>
        </div>
      )}
      
      {debugInfo && (
        <div className="bg-gray-50 p-4 rounded border relative">
          <h3 className="font-medium mb-2">Debug Information</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2"
            onClick={onClearDebugInfo}
          >
            <X className="h-4 w-4" />
          </Button>
          <pre className="text-xs overflow-auto max-h-[400px] p-2 bg-white rounded">
            {debugInfo}
          </pre>
        </div>
      )}
    </div>
  );
}
