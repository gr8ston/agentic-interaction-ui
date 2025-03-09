
import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ConversationMessage } from "@/types/api";
import { formatMessage } from "@/components/observe/conversation-details/utils/messageFormatter";

interface ConversationData {
  conversationId: string;
  appName: string;
  startTime: string;
  messages: ConversationMessage[];
}

export function useConversationData() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ConversationData | null>(null);
  
  const fetchConversationData = useCallback(async (conversationId: string) => {
    setIsLoading(true);
    setError(null);
    
    // Set a timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      setError('Request timed out after 15 seconds. Please try again.');
    }, 15000);
    
    try {
      console.log(`Fetching details for conversation: ${conversationId}`);
      
      // Validate the conversation ID
      if (!conversationId || conversationId.length < 10) {
        throw new Error("Invalid conversation ID format");
      }
      
      // Fetch the conversation details
      const { data: conversationData, error: conversationError } = await supabase
        .from('conversations')
        .select('conversation_id, app_name, created_at, summary')
        .eq('conversation_id', conversationId)
        .maybeSingle(); // Use maybeSingle instead of single to prevent errors
      
      if (conversationError) {
        console.error("Error fetching conversation:", conversationError);
        throw conversationError;
      }
      
      if (!conversationData) {
        throw new Error("Conversation not found");
      }
      
      // Fetch the messages for this conversation
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('message_id, content, role, created_at, latency_ms, tokens_consumed, sequence_number')
        .eq('conversation_id', conversationId)
        .order('sequence_number', { ascending: true });
      
      if (messagesError) {
        console.error("Error fetching messages:", messagesError);
        throw messagesError;
      }
      
      // Clear the timeout since we've received a response
      clearTimeout(timeoutId);
      
      console.log(`Found ${messagesData?.length || 0} messages for conversation ${conversationId}`);
      
      // Update state with the fetched data
      setData({
        conversationId: conversationData.conversation_id,
        appName: conversationData.app_name || 'Unknown App',
        startTime: new Date(conversationData.created_at || '').toLocaleString(),
        messages: (messagesData || []).map(msg => formatMessage(msg))
      });
      
    } catch (err: any) {
      console.error('Error in fetchConversationData:', err);
      setError(err.message || 'Failed to load conversation details');
    } finally {
      setIsLoading(false);
      clearTimeout(timeoutId); // Make sure timeout is cleared in all cases
    }
  }, []);

  const resetData = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    data,
    fetchConversationData,
    resetData
  };
}
