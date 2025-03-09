
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Activity } from "lucide-react";

interface ConversationMessage {
  id: string;
  content: string;
  role: string;
  created: string;
  latency: number | null;
  tokens: number | null;
}

interface ConversationDetailsViewProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: {
    conversationId: string;
    app: string;
    created: string;
    messages: ConversationMessage[];
  } | null;
}

export function ConversationDetailsView({ 
  isOpen, 
  onClose, 
  conversation 
}: ConversationDetailsViewProps) {
  if (!conversation) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Conversation Details</DialogTitle>
          <DialogDescription>
            ID: {conversation.conversationId} | App: {conversation.app} | Created: {conversation.created}
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[60vh] pr-4">
          {conversation.messages.map((message, index) => (
            <div key={message.id} className={`mb-4 pb-4 ${index !== conversation.messages.length - 1 ? "border-b" : ""}`}>
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  <Badge variant={message.role === "user" ? "outline" : "secondary"} className="mr-2">
                    {message.role === "user" ? "User" : "AI"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{message.created}</span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {message.latency !== null && (
                    <span className="mr-3 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {message.latency}ms
                    </span>
                  )}
                  {message.tokens !== null && (
                    <span className="flex items-center">
                      <Activity className="h-3 w-3 mr-1" />
                      {message.tokens} tokens
                    </span>
                  )}
                </div>
              </div>
              <div className="whitespace-pre-wrap text-sm">
                {message.content}
              </div>
            </div>
          ))}
        </div>
        
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
