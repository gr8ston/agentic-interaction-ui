
import { useState, useEffect } from "react";
import { ChatHistory } from "./ChatHistory";
import { ChatInput } from "./ChatInput";
import { ConversationMessage } from "@/types/api";
import { conversationService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export function ConversationContainer() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const { toast } = useToast();

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
        },
      };
      
      setMessages((prev) => [...prev, agentMessage]);
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
