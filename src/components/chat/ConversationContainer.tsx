import { useState, useEffect } from "react";
import { ChatHistory } from "./ChatHistory";
import { ChatInput } from "./ChatInput";
import { ConversationMessage } from "@/types/api";
import { conversationService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function ConversationContainer() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const { user } = useAuth();

  // Store conversation data in Supabase
  const storeConversationInSupabase = async (
    convId: string, 
    userMessage: ConversationMessage, 
    agentMessage: ConversationMessage | null
  ) => {
    try {
      // If this is a new conversation, create it in the conversations table
      if (!conversationId) {
        await supabase.from('conversations').insert({
          conversation_id: convId,
          app_name: 'Framework UI',
          user_id: user?.username || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          summary: userMessage.content.substring(0, 50) + (userMessage.content.length > 50 ? '...' : '')
        });
      } else {
        // Update the conversation's updated_at timestamp
        await supabase.from('conversations')
          .update({ 
            updated_at: new Date().toISOString() 
          })
          .eq('conversation_id', convId);
      }

      // Insert the user message
      await supabase.from('messages').insert({
        message_id: userMessage.id,
        conversation_id: convId,
        role: userMessage.role,
        content: userMessage.content,
        created_at: userMessage.timestamp,
        sequence_number: messages.length,
        user_id: user?.username || null
      });

      // Insert the agent message if it exists
      if (agentMessage) {
        await supabase.from('messages').insert({
          message_id: agentMessage.id,
          conversation_id: convId,
          role: agentMessage.role,
          content: agentMessage.content,
          created_at: agentMessage.timestamp,
          sequence_number: messages.length + 1,
          user_id: user?.username || null,
          tokens_consumed: 
            (agentMessage.metrics?.tokens?.input || 0) + 
            (agentMessage.metrics?.tokens?.output || 0),
          latency_ms: agentMessage.metrics?.latency || 0,
          llm_model: 'gpt-4o',  // Hardcoded for now, could be dynamic
          llm_provider: 'OpenAI', // Hardcoded for now, could be dynamic
          functions_executed: agentMessage.verbose?.composition || null
        });
      }
    } catch (error) {
      console.error("Error storing conversation in Supabase:", error);
      // This is non-blocking, so we don't show a toast to the user
    }
  };

  const handleSendMessage = async (content: string) => {
    // Add user message to chat
    const userMessage: ConversationMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    
    try {
      // Send to API
      const response = await conversationService.sendMessage({
        conversation_id: conversationId,
        question: content,
      });
      
      // Save conversation ID for subsequent messages
      if (!conversationId) {
        setConversationId(response.conversation_id);
      }
      
      // Add agent response to chat
      const agentMessage: ConversationMessage = {
        id: response.message_id,
        role: "agent",
        content: response.answer,
        timestamp: new Date().toISOString(),
        metrics: {
          latency: response.latency_taken,
          tokens: response.tokens_consumed,
        },
        verbose: {
          promptForComposition: response.prompt_for_composition,
          composition: response.composition,
          promptForEnhancedResponse: response.prompt_for_enhanced_response,
          rawResults: response.raw_results,
        },
      };

      setMessages((prev) => [...prev, agentMessage]);
      
      // Store in Supabase
      await storeConversationInSupabase(
        response.conversation_id, 
        userMessage, 
        agentMessage
      );
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-gray-50">
      <ChatHistory messages={messages} isTyping={isTyping} />
      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  );
}
