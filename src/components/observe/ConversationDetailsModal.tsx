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
    // New JSON format with input and output fields
    inputTokens = message.tokens_consumed.input || 0;
    outputTokens = message.tokens_consumed.output || 0;
    
    console.log(`Extracted tokens from JSON: input=${inputTokens}, output=${outputTokens}`);
  } else if (message.tokens_consumed && typeof message.tokens_consumed === 'number') {
    // Old integer format - split based on role
    if (message.role === 'system' || message.role === 'agent') {
      inputTokens = Math.floor(message.tokens_consumed * 0.33);
      outputTokens = Math.floor(message.tokens_consumed * 0.67);
      console.log(`Split integer tokens (${message.tokens_consumed}): input=${inputTokens}, output=${outputTokens}`);
    } else {
      inputTokens = message.tokens_consumed;
      outputTokens = 0;
      console.log(`Integer tokens for user: input=${inputTokens}, output=${outputTokens}`);
    }
  }
  
  console.log('Message data from DB:', {
    id: message.message_id,
    role: message.role,
    latency: message.latency_ms ? `${message.latency_ms}ms` : 'null',
    tokens_raw: message.tokens_consumed,
    tokens_formatted: { input: inputTokens, output: outputTokens },
    tokens_type: typeof message.tokens_consumed
  });
  
  return {
    id: message.message_id,
    role: message.role,
    content: message.content,
    timestamp: message.created_at,
    // Only include metrics for system/agent messages
    metrics: hasMetrics ? {
      latency: message.latency_ms ? message.latency_ms / 1000 : 0, // Convert ms to seconds
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
      
      // Log token data types to help debug
      if (messagesData && messagesData.length > 0) {
        console.log("==== DETAILED TOKEN DATA DIAGNOSTICS ====");
        
        let systemMessagesCount = 0;
        let systemMessagesWithTokens = 0;
        let validJsonTokens = 0;
        
        messagesData.forEach((msg, index) => {
          // Analyze JSON structure if present
          let tokenStructure = 'No tokens data';
          let hasValidJsonStructure = false;
          
          if (msg.tokens_consumed !== null) {
            if (typeof msg.tokens_consumed === 'object') {
              const keys = Object.keys(msg.tokens_consumed);
              hasValidJsonStructure = keys.includes('input') && keys.includes('output');
              tokenStructure = `JSON with keys: ${keys.join(', ')}`;
              if (hasValidJsonStructure) {
                validJsonTokens++;
              }
            } else {
              tokenStructure = `Non-JSON value (${typeof msg.tokens_consumed}): ${msg.tokens_consumed}`;
            }
          }
          
          if (msg.role === 'system' || msg.role === 'agent') {
            systemMessagesCount++;
            if (msg.tokens_consumed !== null) {
              systemMessagesWithTokens++;
            }
            
            console.log(`Message ${index + 1} (${msg.role}):`, {
              value: msg.tokens_consumed,
              type: typeof msg.tokens_consumed,
              isNull: msg.tokens_consumed === null,
              structure: tokenStructure,
              validJson: hasValidJsonStructure,
              expected: 'System/agent message should have token data as a JSON object with input and output fields'
            });
          } else {
            console.log(`Message ${index + 1} (${msg.role}):`, {
              value: msg.tokens_consumed,
              expected: 'User message should have NULL tokens data'
            });
          }
        });
        
        // Summary statistics
        console.log("==== TOKEN DATA SUMMARY ====");
        console.log(`Total messages: ${messagesData.length}`);
        console.log(`System/agent messages: ${systemMessagesCount}`);
        console.log(`System/agent messages with tokens: ${systemMessagesWithTokens}`);
        console.log(`Messages with valid JSON token structure: ${validJsonTokens}`);
        console.log("============================");
      }
      
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
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
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
        
        <ScrollArea className="flex-1 pr-4 my-4">
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
