
import { useState } from 'react';
import { supabase, getTotalTokens } from "@/integrations/supabase/client";

interface ConversationMessage {
  id: string;
  content: string;
  role: string;
  created: string;
  latency: number | null;
  tokens: number | null;
}

interface ConversationDetails {
  conversationId: string;
  app: string;
  created: string;
  messages: ConversationMessage[];
}

export function useConversationDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<ConversationDetails | null>(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  
  const fetchConversationDetails = async (conversationId: string) => {
    setIsLoadingConversation(true);
    try {
      // Fetch the conversation details
      const { data: conversationData, error: conversationError } = await supabase
        .from('conversations')
        .select('conversation_id, app_name, created_at')
        .eq('conversation_id', conversationId)
        .single();
      
      if (conversationError) throw conversationError;
      
      // Fetch the messages for this conversation
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('message_id, content, role, created_at, latency_ms, tokens_consumed')
        .eq('conversation_id', conversationId)
        .order('sequence_number', { ascending: true });
      
      if (messagesError) throw messagesError;
      
      // Format the data
      const details: ConversationDetails = {
        conversationId: conversationData.conversation_id,
        app: conversationData.app_name || 'Unknown',
        created: new Date(conversationData.created_at || '').toLocaleString(),
        messages: messagesData.map(msg => ({
          id: msg.message_id,
          content: msg.content,
          role: msg.role,
          created: new Date(msg.created_at || '').toLocaleString(),
          latency: msg.latency_ms !== null ? Number(msg.latency_ms) : null,
          tokens: msg.tokens_consumed !== null ? getTotalTokens(msg.tokens_consumed) : null
        }))
      };
      
      setSelectedConversation(details);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching conversation details:', error);
      // Handle error - could show a toast or other UI notification
    } finally {
      setIsLoadingConversation(false);
    }
  };
  
  const closeConversationDetails = () => {
    setIsModalOpen(false);
  };
  
  return {
    isModalOpen,
    selectedConversation,
    isLoadingConversation,
    fetchConversationDetails,
    closeConversationDetails
  };
}
