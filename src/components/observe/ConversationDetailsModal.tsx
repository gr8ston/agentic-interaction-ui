
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ConversationMessage } from "@/types/api";
import { X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Helper function to format the message from Supabase data to our UI format
const formatMessage = (message: any): ConversationMessage => {
  // Check if we have latency or token data (only for system/agent messages)
  const hasMetrics = (message.role === 'system' || message.role === 'agent') && 
                     (message.latency_ms !== null || message.tokens_consumed !== null);
  
  // Extract token information from the JSONB structure
  let inputTokens = 0;
  let outputTokens = 0;
  
  if (message.tokens_consumed && typeof message.tokens_consumed === 'object') {
    // Check for OpenAI format with prompt_tokens and completion_tokens
    if ('prompt_tokens' in message.tokens_consumed && 'completion_tokens' in message.tokens_consumed) {
      inputTokens = Number(message.tokens_consumed.prompt_tokens) || 0;
      outputTokens = Number(message.tokens_consumed.completion_tokens) || 0;
      
      console.log(`Extracted tokens from OpenAI format: input=${inputTokens}, output=${outputTokens}`);
    }
    // Check for our standard format with input and output fields
    else if ('input' in message.tokens_consumed && 'output' in message.tokens_consumed) {
      inputTokens = Number(message.tokens_consumed.input) || 0;
      outputTokens = Number(message.tokens_consumed.output) || 0;
      
      console.log(`Extracted tokens from standard format: input=${inputTokens}, output=${outputTokens}`);
    }
    // If it's some other object format, try to extract whatever is available
    else {
      console.log(`Unknown token format: ${JSON.stringify(message.tokens_consumed)}`);
      inputTokens = Object.values(message.tokens_consumed).reduce((sum: number, val: any) => 
        sum + (typeof val === 'number' ? val : 0), 0);
      
      // Split the total based on role (33% input, 67% output for AI messages)
      if (message.role === 'system' || message.role === 'agent') {
        const total = inputTokens;
        inputTokens = Math.floor(total * 0.33);
        outputTokens = Math.floor(total * 0.67);
      } else {
        outputTokens = 0; // For user messages, all tokens are input
      }
    }
  } else if (message.tokens_consumed && typeof message.tokens_consumed === 'number') {
    // Old integer format - split based on role
    if (message.role === 'system' || message.role === 'agent') {
      inputTokens = Math.floor(Number(message.tokens_consumed) * 0.33);
      outputTokens = Math.floor(Number(message.tokens_consumed) * 0.67);
      console.log(`Split integer tokens (${message.tokens_consumed}): input=${inputTokens}, output=${outputTokens}`);
    } else {
      inputTokens = Number(message.tokens_consumed);
      outputTokens = 0;
      console.log(`Integer tokens for user: input=${inputTokens}, output=${outputTokens}`);
    }
  }
  
  return {
    id: message.message_id,
    role: message.role,
    content: message.content,
    timestamp: message.created_at,
    // Only include metrics for system/agent messages
    metrics: hasMetrics ? {
      latency: message.latency_ms ? Number(message.latency_ms) / 1000 : 0, // Convert ms to seconds
      tokens: {
        input: inputTokens,
        output: outputTokens
      }
    } : undefined
  };
};

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationMessages, setConversationMessages] = useState<ConversationMessage[]>([]);
  const [appName, setAppName] = useState("Loading...");
  const [startTime, setStartTime] = useState("Loading...");
  
  useEffect(() => {
    if (isOpen && conversationId) {
      fetchConversationData(conversationId);
    }
  }, [isOpen, conversationId]);
  
  const fetchConversationData = async (convId: string) => {
    setIsLoading(true);
    setError(null);
    
    // Set a timeout to prevent hanging
    const timeout = setTimeout(() => {
      setIsLoading(false);
      setError('Request timed out after 15 seconds. Please try again.');
    }, 15000);
    
    try {
      console.log(`Fetching details for conversation: ${convId}`);
      
      // Validate the conversation ID
      if (!convId || convId.length < 10) {
        throw new Error("Invalid conversation ID format");
      }
      
      // Fetch the conversation details
      const { data: conversationData, error: conversationError } = await supabase
        .from('conversations')
        .select('conversation_id, app_name, created_at, summary')
        .eq('conversation_id', convId)
        .single();
      
      if (conversationError) {
        console.error("Error fetching conversation:", conversationError);
        if (conversationError.code === 'PGRST116') {
          throw new Error("Conversation not found");
        }
        throw conversationError;
      }
      
      if (!conversationData) {
        throw new Error("No conversation data returned");
      }
      
      // Fetch the messages for this conversation
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('message_id, content, role, created_at, latency_ms, tokens_consumed, sequence_number')
        .eq('conversation_id', convId)
        .order('sequence_number', { ascending: true });
      
      if (messagesError) {
        console.error("Error fetching messages:", messagesError);
        throw messagesError;
      }
      
      // Clear the timeout since we've received a response
      clearTimeout(timeout);
      
      console.log(`Found ${messagesData?.length || 0} messages for conversation ${convId}`);
      
      // Update state with the fetched data
      setAppName(conversationData.app_name || 'Unknown App');
      setStartTime(new Date(conversationData.created_at).toLocaleString());
      setConversationMessages(messagesData.map(msg => formatMessage(msg)));
      
    } catch (err) {
      console.error('Error in fetchConversationData:', err);
      setError('Failed to load conversation details');
      setConversationMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!conversationId) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl flex items-center gap-2">
              Conversation Details
              <span className="text-sm font-normal text-gray-500">({conversationId})</span>
            </DialogTitle>
            <DialogDescription className="mt-1">
              <div className="flex flex-col space-y-1">
                <span>Application: {appName}</span>
                <span>Started: {startTime}</span>
              </div>
            </DialogDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4 my-4 h-[50vh] max-h-[50vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">Loading conversation data...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="bg-red-50 border border-red-200 rounded-md p-6 max-w-md mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-red-800 mb-2">Failed to Load Conversation</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <p className="text-sm text-red-600 mb-4">
                  Possible reasons:
                  <ul className="list-disc pl-5 mt-2 text-left">
                    <li>The conversation might have been deleted</li>
                    <li>The conversation ID might be invalid</li>
                    <li>There might be a database connection issue</li>
                  </ul>
                </p>
                <Button 
                  variant="default" 
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => conversationId && fetchConversationData(conversationId)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Retry
                </Button>
              </div>
            </div>
          ) : conversationMessages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No messages found for this conversation.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {conversationMessages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </div>
          )}
        </ScrollArea>
        
        <DialogFooter>
          <div className="w-full flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {conversationMessages.length} messages
            </div>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
