
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
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
  const isPositive = changePercentage > 0;
  const isNegative = changePercentage < 0;
  
  // Determine text to display alongside the percentage
  let changeText = isPositive ? 'increase' : isNegative ? 'slower' : '';
  
  // For response time specifically, "slower" is negative and "faster" is positive
  if (title.toLowerCase().includes('response time') || title.toLowerCase().includes('latency')) {
    changeText = isPositive ? 'slower' : isNegative ? 'faster' : '';
  }
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="text-3xl font-bold mb-2">
            {value}{suffix}
          </div>
          <div className="flex items-center text-sm">
            {isPositive && (
              <div className="flex items-center text-green-600">
                <ArrowUp className="h-3 w-3 mr-1" />
                <span>{Math.abs(roundedPercentage)}% {changeText}</span>
              </div>
            )}
            {isNegative && (
              <div className="flex items-center text-red-600">
                <ArrowDown className="h-3 w-3 mr-1" />
                <span>{Math.abs(roundedPercentage)}% {changeText}</span>
              </div>
            )}
            {!isPositive && !isNegative && (
              <div className="text-gray-500">0% change</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
