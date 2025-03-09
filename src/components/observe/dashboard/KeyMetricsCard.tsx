
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown } from "lucide-react";

interface KeyMetricsCardProps {
  title: string;
  value: string | number;
  changePercentage: number;
  suffix?: string;
  description?: string;
}

export function KeyMetricsCard({ 
  title, 
  value, 
  changePercentage, 
  suffix = '', 
  description = 'vs previous period' 
}: KeyMetricsCardProps) {
  // Round the percentage to a whole number
  const roundedPercentage = Math.round(changePercentage);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">
            {value}{suffix}
          </div>
          <div className="flex items-center">
            {changePercentage > 0 ? (
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                <ArrowUp className="h-3 w-3 mr-1" />
                {Math.abs(roundedPercentage)}%
              </Badge>
            ) : changePercentage < 0 ? (
              <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                <ArrowDown className="h-3 w-3 mr-1" />
                {Math.abs(roundedPercentage)}%
              </Badge>
            ) : (
              <Badge variant="outline">0%</Badge>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
