
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RecentConversation } from "@/services/supabase-service";

interface RecentConversationsTableProps {
  conversations: RecentConversation[];
  isLoading: boolean;
  onViewConversation: (id: string) => void;
}

export function RecentConversationsTable({ 
  conversations, 
  isLoading, 
  onViewConversation 
}: RecentConversationsTableProps) {
  
  // Format the tokens consumed for display
  const formatTokens = (tokens: number): string => {
    if (tokens >= 1000) {
      return `${(tokens / 1000).toFixed(1)}k`;
    }
    return tokens.toString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Conversations</CardTitle>
        <CardDescription>The most recent conversations across your platform</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Conversation ID</TableHead>
              <TableHead>App</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tokens</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="flex justify-center py-4">
                    <div className="animate-pulse flex space-x-4">
                      <div className="flex-1 space-y-4 py-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : conversations.length > 0 ? (
              conversations.map((conversation) => (
                <TableRow key={conversation.id}>
                  <TableCell className="font-mono text-xs">
                    <span 
                      className="text-blue-600 cursor-pointer hover:underline"
                      onClick={() => onViewConversation(conversation.id)}
                    >
                      {conversation.id.substring(0, 8)}...
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{conversation.app}</Badge>
                  </TableCell>
                  <TableCell>{conversation.time}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{conversation.status}</Badge>
                  </TableCell>
                  <TableCell>{formatTokens(conversation.tokens)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                  No conversations found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
