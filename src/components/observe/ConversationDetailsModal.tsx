
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { useConversationData } from "@/hooks/useConversationData";
import { ConversationDetailsHeader } from "./conversation-details/ConversationDetailsHeader";
import { ConversationMessageList } from "./conversation-details/ConversationMessageList";
import { ConversationDetailsFooter } from "./conversation-details/ConversationDetailsFooter";

interface ConversationDetailsModalProps {
  conversationId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ConversationDetailsModal({
  conversationId,
  isOpen,
  onClose
}: ConversationDetailsModalProps) {
  const {
    isLoading,
    error,
    data,
    fetchConversationData,
    resetData
  } = useConversationData();

  // Reset data when modal is closed
  useEffect(() => {
    if (!isOpen) {
      resetData();
    }
  }, [isOpen, resetData]);
  
  // Fetch data when modal is opened with a valid conversationId
  useEffect(() => {
    if (isOpen && conversationId) {
      fetchConversationData(conversationId);
    }
  }, [isOpen, conversationId, fetchConversationData]);

  if (!conversationId) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        <ConversationDetailsHeader 
          conversationId={conversationId}
          appName={data?.appName || 'Loading...'}
          startTime={data?.startTime || 'Loading...'}
          onClose={onClose}
        />
        
        <ScrollArea className="flex-1 pr-4 my-4 h-[50vh] max-h-[50vh] overflow-y-auto">
          <ConversationMessageList 
            isLoading={isLoading}
            error={error}
            messages={data?.messages || []}
            onRetry={() => conversationId && fetchConversationData(conversationId)}
          />
        </ScrollArea>
        
        <ConversationDetailsFooter 
          messageCount={data?.messages.length || 0}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
