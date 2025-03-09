
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DailyMetric } from "@/services/supabase-service";

interface ConversationTrendsChartProps {
  data: DailyMetric[];
}

export function ConversationTrendsChart({ data }: ConversationTrendsChartProps) {
  return (
    <Card className="min-h-[330px]">
      <CardHeader>
        <CardTitle>Conversation Trends</CardTitle>
        <CardDescription>Conversations over the past 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value} conversations`, 'Volume']}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="value" fill="#007ACC" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
